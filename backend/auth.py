import os
import uuid
from datetime import timedelta

import bcrypt
import jwt
from fastapi import HTTPException, Request, Response

from core import db, now, logger

COOKIE = "nx_admin_session"
SESSION_HOURS = 8
ALGO = "HS256"
MAX_FAILS = 5
LOCK_MINUTES = 15


def cookie_samesite() -> str:
    """'strict' (default) works when site and API share one registrable domain.
    Use ADMIN_COOKIE_SAMESITE=none when the frontend and API are on different sites (cookie is still Secure + HttpOnly,
    and every state-changing admin request also needs the X-Requested-With header)."""
    v = os.environ.get("ADMIN_COOKIE_SAMESITE", "strict").strip().lower()
    return v if v in {"strict", "lax", "none"} else "strict"


def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt(rounds=12)).decode()


def verify_password(p: str, h: str) -> bool:
    try:
        return bcrypt.checkpw(p.encode(), h.encode())
    except ValueError:
        return False


async def seed_admin():
    username = os.environ.get("ADMIN_USERNAME")
    pw_hash = os.environ.get("ADMIN_PASSWORD_HASH")
    pw = os.environ.get("ADMIN_PASSWORD")
    if not username or not (pw_hash or pw):
        logger.warning("Admin bootstrap credentials not configured; skipping seed.")
        return
    existing = await db.admin_users.find_one({"username": username})
    if existing is None:
        await db.admin_users.insert_one({
            "id": str(uuid.uuid4()), "username": username, "role": "admin",
            "password_hash": pw_hash or hash_password(pw), "created_at": now(),
        })
        logger.info("Admin account provisioned.")
    elif pw_hash and existing["password_hash"] != pw_hash:
        await db.admin_users.update_one({"username": username}, {"$set": {"password_hash": pw_hash}})
    elif not pw_hash and not verify_password(pw, existing["password_hash"]):
        await db.admin_users.update_one({"username": username}, {"$set": {"password_hash": hash_password(pw)}})
        logger.info("Admin password rotated from environment.")


async def check_lock(identifier: str):
    rec = await db.login_attempts.find_one({"identifier": identifier})
    if rec and rec.get("locked_until") and rec["locked_until"].replace(tzinfo=now().tzinfo) > now():
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")


async def record_fail(identifier: str):
    rec = await db.login_attempts.find_one_and_update(
        {"identifier": identifier}, {"$inc": {"count": 1}, "$set": {"updated_at": now()}}, upsert=True, return_document=True)
    if rec and rec.get("count", 0) >= MAX_FAILS:
        await db.login_attempts.update_one({"identifier": identifier},
                                           {"$set": {"locked_until": now() + timedelta(minutes=LOCK_MINUTES), "count": 0}})


async def create_session(response: Response, user: dict, ip_hash: str):
    jti = str(uuid.uuid4())
    exp = now() + timedelta(hours=SESSION_HOURS)
    await db.admin_sessions.insert_one({"jti": jti, "user_id": user["id"], "ip_hash": ip_hash, "created_at": now(), "expires_at": exp})
    token = jwt.encode({"sub": user["id"], "jti": jti, "role": user["role"], "exp": exp}, os.environ["JWT_SECRET"], algorithm=ALGO)
    response.set_cookie(COOKIE, token, httponly=True, secure=True, samesite=cookie_samesite(), max_age=SESSION_HOURS * 3600, path="/api")


async def require_admin(request: Request) -> dict:
    token = request.cookies.get(COOKIE)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[ALGO])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Session expired")
    session = await db.admin_sessions.find_one({"jti": payload.get("jti")})
    if not session:
        raise HTTPException(status_code=401, detail="Session expired")
    user = await db.admin_users.find_one({"id": payload.get("sub")}, {"_id": 0, "password_hash": 0})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    if request.method in {"POST", "PATCH", "PUT", "DELETE"} and request.headers.get("x-requested-with") != "nexcare-admin":
        raise HTTPException(status_code=403, detail="CSRF check failed")
    user["jti"] = payload["jti"]
    return user
