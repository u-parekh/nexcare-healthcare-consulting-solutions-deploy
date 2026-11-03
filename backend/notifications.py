import os
import json
import hmac
import html
import time
import asyncio
import hashlib

try:
    import httpx  # type: ignore[import-not-found]
except ImportError:  # pragma: no cover
    httpx = None

try:
    import resend  # type: ignore[import-not-found]
except ImportError:  # pragma: no cover
    resend = None

from core import logger

COMPANY_EMAIL = "info@nexcareconsulting.com"
COMPANY_PHONE = "+91 9664662760"


def _wrap(title: str, body: str) -> str:
    return f"""<!doctype html><html><body style="margin:0;background:#F0F5F1;font-family:Arial,Helvetica,sans-serif;color:#0A0F14;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #E2E8F0;">
<tr><td style="background:linear-gradient(90deg,#0E4A8A,#3FB549);background-color:#0E4A8A;padding:22px 28px;color:#fff;">
<div style="font-size:22px;font-weight:800;letter-spacing:1px;">NEXCARE</div>
<div style="font-size:12px;opacity:.9;">Healthcare Consulting Solutions</div></td></tr>
<tr><td style="padding:28px;"><h1 style="font-size:20px;margin:0 0 16px;color:#0E4A8A;">{title}</h1>{body}</td></tr>
<tr><td style="padding:18px 28px;background:#F8FAF9;border-top:1px solid #E2E8F0;font-size:12px;color:#4A5568;line-height:1.6;">
NEXCARE Healthcare Consulting<br/>Email: <a href="mailto:{COMPANY_EMAIL}" style="color:#0E4A8A;">{COMPANY_EMAIL}</a> &nbsp;|&nbsp; Phone: {COMPANY_PHONE}
</td></tr></table></td></tr></table></body></html>"""


def notification_html(c: dict) -> str:
    rows = "".join(
        f'<tr><td style="padding:6px 0;width:110px;color:#4A5568;font-size:14px;">{k}</td><td style="font-size:14px;font-weight:600;">{html.escape(str(v))}</td></tr>'
        for k, v in (("Name", c["name"]), ("Email", c["email"]), ("Phone", c["phone"]), ("Service", c["service"]), ("Reference", c["id"]))
    )
    body = f"""<table style="width:100%;">{rows}</table>
<div style="margin-top:16px;padding:16px;background:#F0F5F1;border-left:3px solid #3FB549;font-size:14px;line-height:1.6;white-space:pre-wrap;">{html.escape(c['message'])}</div>"""
    return _wrap("New website inquiry", body)


async def send_email(to: str, subject: str, html_body: str, idem_key: str, reply_to: str = None) -> dict:
    key = os.environ.get("RESEND_API_KEY")
    sender = os.environ.get("RESEND_FROM_EMAIL")
    if not key or not sender or not to:
        return {"status": "not_configured"}
    resend.api_key = key
    params = {"from": sender, "to": [to], "subject": subject, "html": html_body}
    if reply_to:
        params["reply_to"] = [reply_to]
    try:
        res = await asyncio.wait_for(asyncio.to_thread(resend.Emails.send, params, {"idempotency_key": idem_key}), timeout=15)
        return {"status": "sent", "provider_id": res.get("id") if isinstance(res, dict) else None}
    except Exception as e:
        logger.error("email send failed key=%s err=%s", idem_key, type(e).__name__)
        return {"status": "failed", "error": type(e).__name__}


async def trigger_n8n(event: str, data: dict) -> dict:
    url = os.environ.get("N8N_WEBHOOK_URL")
    secret = os.environ.get("N8N_WEBHOOK_SECRET")
    if not url or not secret:
        return {"status": "not_configured"}
    body = json.dumps({"event": event, "data": data}, default=str, separators=(",", ":"))
    ts = str(int(time.time()))
    sig = hmac.new(secret.encode(), f"{ts}.{body}".encode(), hashlib.sha256).hexdigest()
    headers = {"Content-Type": "application/json", "X-NexCare-Timestamp": ts, "X-NexCare-Signature": f"sha256={sig}"}
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=8.0) as c:
                r = await c.post(url, content=body, headers=headers)
            if r.status_code < 300:
                return {"status": "sent"}
            logger.warning("n8n webhook status=%s attempt=%s", r.status_code, attempt + 1)
        except Exception as e:
            logger.warning("n8n webhook error=%s attempt=%s", type(e).__name__, attempt + 1)
        await asyncio.sleep(0.5 * (2 ** attempt))
    return {"status": "failed"}


CONFIRMATION_EVENT = "contact.inquiry"
DONE = {"sent", "event_accepted"}


def _send_event(name: str, email: str, message: str):
    # Template renders {{{triple-brace}}} variables unescaped, so visitor text is HTML-escaped here.
    return resend.Events.send({
        "event": CONFIRMATION_EVENT,
        "email": email,
        "payload": {"name": html.escape(name), "email": html.escape(email), "message": html.escape(message)},
    })


async def trigger_confirmation(name: str, email: str, message: str) -> dict:
    """Emits the Resend event that drives the visitor confirmation automation."""
    key = os.environ.get("RESEND_API_KEY")
    if not key:
        return {"status": "not_configured"}
    resend.api_key = key
    for attempt in range(2):
        try:
            await asyncio.wait_for(asyncio.to_thread(_send_event, name, email, message), timeout=15)
            return {"status": "event_accepted", "event": CONFIRMATION_EVENT}
        except Exception as e:
            logger.error("resend event failed attempt=%s err=%s", attempt + 1, type(e).__name__)
            await asyncio.sleep(1)
    return {"status": "failed", "event": CONFIRMATION_EVENT}


async def _skip(prev: dict, key: str):
    return prev[key]


async def deliver_contact(c: dict, previous: dict = None) -> dict:
    """Runs each delivery channel once; on retry, channels that already succeeded are skipped."""
    prev = previous or {}
    done = lambda k: (prev.get(k) or {}).get("status") in DONE  # noqa: E731
    notify_to = os.environ.get("CONTACT_NOTIFICATION_EMAIL")
    ack, notify, n8n = await asyncio.gather(
        _skip(prev, "acknowledgement") if done("acknowledgement") else trigger_confirmation(c["name"], c["email"], c["message"]),
        _skip(prev, "notification") if done("notification") else send_email(
            notify_to, f"New inquiry: {c['name']} — {c['service']}", notification_html(c), f"contact/{c['id']}/notify", reply_to=c["email"]),
        _skip(prev, "n8n") if done("n8n") else trigger_n8n(
            "contact.created", {k: c[k] for k in ("id", "name", "email", "phone", "service", "message", "created_at")}),
    )
    return {"acknowledgement": ack, "notification": notify, "n8n": n8n}
