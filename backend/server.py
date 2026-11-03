from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

import os  # noqa: E402
import uuid  # noqa: E402
import secrets  # noqa: E402
import hashlib  # noqa: E402
from datetime import timedelta  # noqa: E402

from fastapi import APIRouter, FastAPI, HTTPException, Request  # noqa: E402
from fastapi.responses import JSONResponse  # noqa: E402
from starlette.middleware.cors import CORSMiddleware  # noqa: E402
from pymongo.errors import DuplicateKeyError  # noqa: E402

from core import client, client_ip, db, limiter, logger, lookup_country, now, parse_browser, parse_device, pseudonymize, verify_captcha  # noqa: E402
from auth import seed_admin  # noqa: E402
from notifications import deliver_contact  # noqa: E402
from validators import AssessmentComplete, AssessmentStart, ContactIn, HeartbeatIn, VisitIn  # noqa: E402
import admin_routes  # noqa: E402

MAX_BODY = 64 * 1024

app = FastAPI(title="NEXCARE API", docs_url=None, redoc_url=None, openapi_url=None)
api = APIRouter(prefix="/api")


@app.middleware("http")
async def security_middleware(request: Request, call_next):
    cl = request.headers.get("content-length")
    if cl and cl.isdigit() and int(cl) > MAX_BODY:
        return JSONResponse({"detail": "Request too large"}, status_code=413)
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    if request.url.path.startswith("/api/admin"):
        response.headers["Cache-Control"] = "no-store"
    return response


@api.get("/")
async def root():
    return {"message": "NEXCARE API", "status": "ok"}


@api.get("/health")
async def health():
    try:
        await db.command("ping")
        return {"status": "ok", "database": "ok"}
    except Exception:
        return JSONResponse({"status": "degraded", "database": "unavailable"}, status_code=503)


@api.post("/contact")
async def create_contact(payload: ContactIn, request: Request):
    ip = client_ip(request)
    ip_h = pseudonymize(ip)
    limiter.check(f"contact:{ip_h}", 5, 600)
    if payload.website:
        raise HTTPException(status_code=400, detail="Submission rejected.")
    await verify_captcha(payload.captcha_token, ip)
    msg_hash = hashlib.sha256(f"{payload.email}|{payload.message}".encode()).hexdigest()
    dup = await db.contacts.find_one({"email": payload.email, "msg_hash": msg_hash, "created_at": {"$gte": now() - timedelta(minutes=15)}},
                                     {"_id": 0, "id": 1, "delivery": 1})
    if dup:
        return {"stored": True, "duplicate": True, "id": dup["id"],
                "acknowledgement_email": (dup.get("delivery") or {}).get("acknowledgement", {}).get("status", "pending")}
    doc = {
        "id": str(uuid.uuid4()), "name": payload.name, "email": payload.email, "phone": payload.phone,
        "service": payload.service, "message": payload.message, "status": "new", "msg_hash": msg_hash,
        "ip_hash": ip_h, "created_at": now(), "updated_at": now(),
        "delivery": {k: {"status": "pending"} for k in ("acknowledgement", "notification", "n8n")},
    }
    try:
        await db.contacts.insert_one(dict(doc))
    except Exception as e:
        logger.error("contact insert failed: %s", type(e).__name__)
        raise HTTPException(status_code=503, detail="We couldn't save your inquiry right now. Please try again shortly.")
    delivery = await deliver_contact(doc)
    await db.contacts.update_one({"id": doc["id"]}, {"$set": {"delivery": delivery, "updated_at": now()}})
    return {"stored": True, "id": doc["id"], "acknowledgement_email": delivery["acknowledgement"]["status"]}


@api.post("/assessments")
async def start_assessment(payload: AssessmentStart, request: Request):
    ip = client_ip(request)
    ip_h = pseudonymize(ip)
    limiter.check(f"assess:{ip_h}", 5, 600)
    if payload.website:
        raise HTTPException(status_code=400, detail="Submission rejected.")
    existing = await db.quiz_submissions.find_one({"client_ref": payload.client_ref}, {"id": 1})
    if existing:
        raise HTTPException(status_code=409, detail="This assessment has already been submitted.")
    await verify_captcha(payload.captcha_token, ip)
    token = secrets.token_urlsafe(32)
    ua = request.headers.get("user-agent", "")
    doc = {
        "id": str(uuid.uuid4()), "client_ref": payload.client_ref,
        "name": payload.name, "email": payload.email, "phone": payload.phone,
        "answers": [a.model_dump() for a in payload.answers], "status": "in_progress", "recommended": [],
        "device": parse_device(ua), "ip_hash": ip_h,
        "token_hash": hashlib.sha256(token.encode()).hexdigest(),
        "created_at": now(), "updated_at": now(),
    }
    try:
        await db.quiz_submissions.insert_one(doc)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="This assessment has already been submitted.")
    return {"id": doc["id"], "token": token}


@api.post("/assessments/{aid}/complete")
async def complete_assessment(aid: str, payload: AssessmentComplete, request: Request):
    limiter.check(f"assess-c:{pseudonymize(client_ip(request))}", 10, 600)
    doc = await db.quiz_submissions.find_one({"id": aid[:64]})
    if not doc or not secrets.compare_digest(doc.get("token_hash", ""), hashlib.sha256(payload.token.encode()).hexdigest()):
        raise HTTPException(status_code=404, detail="Assessment not found")
    if doc["status"] != "in_progress":
        raise HTTPException(status_code=409, detail="This assessment has already been completed.")
    await db.quiz_submissions.update_one({"id": doc["id"], "status": "in_progress"}, {"$set": {
        "answers": [a.model_dump() for a in payload.answers], "recommended": payload.recommended,
        "status": "completed", "completed_at": now(), "updated_at": now()}})
    return {"completed": True}


@api.post("/track/visit")
async def track_visit(payload: VisitIn, request: Request):
    ip = client_ip(request)
    limiter.check(f"visit:{pseudonymize(ip)}", 120, 600)
    ua = request.headers.get("user-agent", "")
    geo = await lookup_country(ip)
    await db.visits.insert_one({
        "visitor_id": payload.visitor_id, "path": payload.path, "referrer": (payload.referrer or "")[:300],
        "device": parse_device(ua), "browser": parse_browser(ua), **geo, "created_at": now(),
    })
    return {"tracked": True}


@api.post("/track/heartbeat")
async def track_heartbeat(payload: HeartbeatIn, request: Request):
    limiter.check(f"hb:{pseudonymize(client_ip(request))}", 200, 600)
    await db.heartbeats.update_one({"visitor_id": payload.visitor_id, "path": payload.path},
                                   {"$inc": {"seconds": payload.seconds}, "$set": {"updated_at": now()}}, upsert=True)
    return {"ok": True}


@api.post("/track/brochure")
async def track_brochure(request: Request):
    limiter.check(f"broch:{pseudonymize(client_ip(request))}", 20, 600)
    await db.brochure_downloads.insert_one({"device": parse_device(request.headers.get("user-agent", "")), "created_at": now()})
    return {"ok": True}


app.include_router(api)
app.include_router(admin_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.environ["CORS_ORIGINS"].split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "X-Requested-With"],
)


@app.on_event("startup")
async def startup():
    await db.contacts.create_index("id", unique=True)
    await db.contacts.create_index([("created_at", -1)])
    await db.contacts.create_index("status")
    await db.contacts.create_index([("email", 1), ("msg_hash", 1), ("created_at", -1)])
    await db.quiz_submissions.create_index("id", unique=True)
    await db.quiz_submissions.create_index("client_ref", unique=True, sparse=True)
    await db.quiz_submissions.create_index([("created_at", -1)])
    await db.visits.create_index([("created_at", -1)])
    await db.visits.create_index("visitor_id")
    await db.admin_users.create_index("username", unique=True)
    await db.admin_sessions.create_index("jti", unique=True)
    await db.admin_sessions.create_index("expires_at", expireAfterSeconds=0)
    await db.login_attempts.create_index("identifier", unique=True)
    await db.audit_log.create_index([("created_at", -1)])
    await seed_admin()


@app.on_event("shutdown")
async def shutdown():
    client.close()
