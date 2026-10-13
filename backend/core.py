import os
import re
import time
import hmac
import hashlib
import logging
from collections import defaultdict, deque
from datetime import datetime, timezone

import httpx
from fastapi import HTTPException, Request
from motor.motor_asyncio import AsyncIOMotorClient

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("nexcare")

client = AsyncIOMotorClient(os.environ["MONGO_URL"], tz_aware=True)
db = client[os.environ["DB_NAME"]]


def now() -> datetime:
    return datetime.now(timezone.utc)


def client_ip(req: Request) -> str:
    fwd = req.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return req.client.host if req.client else "0.0.0.0"


def pseudonymize(value: str) -> str:
    salt = os.environ["IP_HASH_SALT"].encode()
    return hmac.new(salt, value.encode(), hashlib.sha256).hexdigest()[:32]


class RateLimiter:
    """In-memory sliding window limiter (per process)."""

    def __init__(self):
        self.hits = defaultdict(deque)

    def check(self, key: str, limit: int, window: int):
        q = self.hits[key]
        t = time.monotonic()
        while q and q[0] <= t - window:
            q.popleft()
        if len(q) >= limit:
            raise HTTPException(status_code=429, detail="Too many requests. Please wait a few minutes and try again.")
        q.append(t)


limiter = RateLimiter()


async def verify_captcha(token: str, ip: str):
    """Server-side check of a Google reCAPTCHA v2 ("I'm not a robot") token. The secret never leaves the server."""
    secret = os.environ.get("RECAPTCHA_SECRET_KEY")
    if not secret:
        raise HTTPException(status_code=503, detail="Human verification is not configured.")
    if not token:
        raise HTTPException(status_code=400, detail="Please tick the \u201cI\u2019m not a robot\u201d checkbox and try again.")
    try:
        async with httpx.AsyncClient(timeout=6.0) as c:
            r = await c.post("https://www.google.com/recaptcha/api/siteverify",
                             data={"secret": secret, "response": token, "remoteip": ip})
            data = r.json()
    except Exception as e:
        logger.error("captcha verification error: %s", type(e).__name__)
        raise HTTPException(status_code=503, detail="Human verification is temporarily unavailable. Please try again.")
    if data.get("success") is not True:
        codes = data.get("error-codes") or []
        logger.warning("captcha rejected codes=%s", codes)
        if "invalid-input-secret" in codes or "missing-input-secret" in codes:
            logger.error("RECAPTCHA_SECRET_KEY is wrong or not a v2 secret; visitors cannot submit forms.")
            raise HTTPException(status_code=503, detail="Human verification is temporarily unavailable. Please try again later.")
        if "missing-input-response" in codes:
            raise HTTPException(status_code=400, detail="Please tick the \u201cI\u2019m not a robot\u201d checkbox and try again.")
        if "timeout-or-duplicate" in codes:
            raise HTTPException(status_code=400, detail="Human verification expired. Please tick the checkbox again.")
        raise HTTPException(status_code=400, detail="Human verification failed. Please try again.")
    hosts = [h.strip() for h in os.environ.get("RECAPTCHA_ALLOWED_HOSTNAMES", "").split(",") if h.strip()]
    if hosts and data.get("hostname") not in hosts:
        logger.warning("captcha hostname mismatch host=%s", data.get("hostname"))
        raise HTTPException(status_code=400, detail="Human verification failed. Please try again.")


def safe_regex(text: str) -> dict:
    return {"$regex": re.escape(text.strip()[:100]), "$options": "i"}


def parse_device(ua: str) -> str:
    ua = (ua or "").lower()
    if "ipad" in ua or "tablet" in ua:
        return "tablet"
    if "mobile" in ua or "iphone" in ua or "android" in ua:
        return "mobile"
    return "desktop"


def parse_browser(ua: str) -> str:
    ua = (ua or "").lower()
    if "edg/" in ua:
        return "Edge"
    if "chrome/" in ua and "safari/" in ua:
        return "Chrome"
    if "firefox/" in ua:
        return "Firefox"
    if "safari/" in ua:
        return "Safari"
    return "Other"


_geo_cache: dict = {}


async def lookup_country(ip: str) -> dict:
    """Approximate IP-based geo. Returns 'Unknown' when unavailable; the IP itself is never stored."""
    unknown = {"country": "Unknown", "region": "Unknown", "geo_source": "unavailable"}
    if os.environ.get("GEO_LOOKUP_ENABLED", "false").lower() != "true":
        return unknown
    if not ip or ip.startswith(("127.", "10.", "192.168.", "172.")):
        return unknown
    key = pseudonymize(ip)
    if key in _geo_cache:
        return _geo_cache[key]
    try:
        async with httpx.AsyncClient(timeout=3.0) as c:
            r = await c.get(f"https://ipapi.co/{ip}/json/")
            d = r.json() if r.status_code == 200 else {}
            if d.get("country_name"):
                res = {"country": d["country_name"], "region": d.get("region") or "Unknown", "geo_source": "ip_lookup"}
                _geo_cache[key] = res
                return res
    except Exception:
        pass
    return unknown
