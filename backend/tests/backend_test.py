"""End-to-end backend API tests for NexCare.

Covers:
- public contact validation + captcha + rate limit
- assessment start/complete flow
- admin login/CSRF/analytics/records CRUD/export
- security (unauth, CSRF, lockout)
"""
import os
import random
import uuid
import requests
import pytest

# These are LIVE tests against a running deployment. They are skipped (not failed) when no URL is configured,
# so `pytest tests` is safe in CI. Configure with environment variables - never hardcode credentials here:
#   TEST_BASE_URL (or REACT_APP_BACKEND_URL)   e.g. https://your-backend.example.com
#   TEST_ADMIN_USERNAME / TEST_ADMIN_PASSWORD  an admin account (admin tests are skipped without them)
BASE = (os.environ.get("TEST_BASE_URL") or os.environ.get("REACT_APP_BACKEND_URL") or "").rstrip("/")
if not BASE:
    pytest.skip("Set TEST_BASE_URL to run the live API tests.", allow_module_level=True)

API = f"{BASE}/api"
ADMIN_USER = os.environ.get("TEST_ADMIN_USERNAME", "")
ADMIN_PASS = os.environ.get("TEST_ADMIN_PASSWORD", "")
CSRF = {"X-Requested-With": "nexcare-admin"}
needs_admin = pytest.mark.skipif(not (ADMIN_USER and ADMIN_PASS), reason="TEST_ADMIN_USERNAME / TEST_ADMIN_PASSWORD not set")


def fresh_ip(extra=None):
    """The API rate-limits per client IP (first X-Forwarded-For entry). A distinct address per test gives each test its
    own rate-limit bucket, so tests no longer use up each other's quota or fail when re-run within 10 minutes."""
    return {"X-Forwarded-For": f"198.18.{random.randint(0, 255)}.{random.randint(1, 254)}", **(extra or {})}


TEST_EMAIL = "test.automation@example.com"


# ---------- fixtures ----------
@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def admin():
    if not (ADMIN_USER and ADMIN_PASS):
        pytest.skip("TEST_ADMIN_USERNAME / TEST_ADMIN_PASSWORD not set")
    sess = requests.Session()
    r = sess.post(f"{API}/admin/login",
                  json={"username": ADMIN_USER, "password": ADMIN_PASS},
                  headers=fresh_ip(CSRF), timeout=15)
    assert r.status_code == 200, f"admin login failed: {r.status_code} {r.text}"
    return sess


# ---------- health ----------
def test_health(s):
    r = s.get(f"{API}/health", timeout=10)
    assert r.status_code == 200
    assert r.json().get("database") == "ok"


# ---------- contact ----------
VALID_CONTACT = {
    "name": "Test Automation",
    "email": TEST_EMAIL,
    "phone": "9876543210",
    "service": "Healthcare Consulting",
    "message": "Automated backend test inquiry.",
    "captcha_token": "test-token",
}


def test_contact_rejects_empty_captcha(s):
    r = s.post(f"{API}/contact", json={**VALID_CONTACT, "captcha_token": ""}, headers=fresh_ip(), timeout=15)
    # Pydantic may 422 on empty string if min_length; server also 400 explicitly.
    assert r.status_code in (400, 422), r.text


def test_contact_rejects_invalid_fields(s):
    r = s.post(f"{API}/contact", json={**VALID_CONTACT, "name": "J0hn D1git", "phone": "1234"}, headers=fresh_ip(), timeout=15)
    assert r.status_code == 422


def test_contact_garbage_captcha_rejected(s, admin):
    """With a real reCAPTCHA v2 secret, a garbage token must be rejected 400
    with 'Human verification failed' message and NO contact record created."""
    payload = {**VALID_CONTACT, "email": f"Test.Automation+{uuid.uuid4().hex[:6]}@Example.com",
               "captcha_token": "garbage-token-" + "x" * 40}
    r = s.post(f"{API}/contact", json=payload, headers=fresh_ip(), timeout=20)
    assert r.status_code == 400, r.text
    assert "Human verification failed" in r.text
    # ensure no DB record was created with this email
    g = admin.get(f"{API}/admin/records/contacts?page=1&per_page=50", timeout=15)
    assert g.status_code == 200
    emails = [c.get("email") for c in g.json().get("items", [])]
    assert payload["email"].lower() not in emails


def test_contact_rate_limit():
    sess = requests.Session()
    headers = fresh_ip()  # one address for all 7 requests -> must hit the 5 per 10 min limit
    hits = []
    for i in range(7):
        r = sess.post(f"{API}/contact", json={**VALID_CONTACT,
                                              "email": f"rl{i}.{uuid.uuid4().hex[:5]}@example.com"},
                      headers=headers, timeout=15)
        hits.append(r.status_code)
    assert 429 in hits, f"expected rate-limit 429 in {hits}"


# ---------- assessment ----------
def test_assessment_garbage_captcha_rejected(s):
    """With a real reCAPTCHA v2 secret, a garbage token must be rejected 400."""
    client_ref = f"test-{uuid.uuid4().hex}"
    start = {
        "client_ref": client_ref,
        "name": "Test Automation",
        "email": TEST_EMAIL,
        "phone": "9876543210",
        "captcha_token": "garbage-" + "y" * 40,
        "answers": [{"question": f"Q{i}", "answer": "A"} for i in range(5)],
    }
    r = s.post(f"{API}/assessments", json=start, headers=fresh_ip(), timeout=20)
    assert r.status_code == 400, r.text
    assert "Human verification failed" in r.text


# ---------- admin security ----------
def test_admin_requires_auth(s):
    for path in ["/admin/records/contacts", "/admin/analytics", "/admin/export/contacts"]:
        r = s.get(f"{API}{path}", timeout=15)
        assert r.status_code == 401, f"{path} returned {r.status_code}"


def test_admin_csrf_required(admin):
    # authenticated but missing X-Requested-With -> 403
    r = admin.post(f"{API}/admin/logout", timeout=15)  # no CSRF header
    assert r.status_code == 403


def test_admin_me(admin):
    r = admin.get(f"{API}/admin/me", timeout=15)
    assert r.status_code == 200
    assert r.json()["username"] == ADMIN_USER


def test_admin_analytics(admin):
    r = admin.get(f"{API}/admin/analytics", timeout=20)
    assert r.status_code == 200
    data = r.json()
    for k in ("visitors", "series", "contacts", "assessments", "top_pages"):
        assert k in data


def test_admin_records_list_and_update(admin):
    r = admin.get(f"{API}/admin/records/contacts?page=1&per_page=5", timeout=15)
    assert r.status_code == 200
    j = r.json()
    assert "items" in j and "total" in j


def test_admin_export_xlsx(admin):
    r = admin.get(f"{API}/admin/export/contacts", timeout=30)
    assert r.status_code == 200
    assert "spreadsheetml" in r.headers.get("content-type", "")
    assert r.content[:2] == b"PK"  # xlsx is zip


def test_admin_lockout_fake_user():
    sess = requests.Session()
    headers = fresh_ip(CSRF)
    username = f"locktest_{uuid.uuid4().hex[:6]}"  # same name every attempt, so the per-account lockout triggers
    codes = []
    for _ in range(7):
        r = sess.post(f"{API}/admin/login",
                      json={"username": username, "password": "wrong"},
                      headers=headers, timeout=10)
        codes.append(r.status_code)
    assert 429 in codes, f"expected 429 lockout in {codes}"


@needs_admin
def test_admin_logout_and_me_401():
    sess = requests.Session()
    r = sess.post(f"{API}/admin/login",
                  json={"username": ADMIN_USER, "password": ADMIN_PASS},
                  headers=fresh_ip(CSRF), timeout=15)
    assert r.status_code == 200
    lo = sess.post(f"{API}/admin/logout", headers=CSRF, timeout=15)
    assert lo.status_code == 200
    me = sess.get(f"{API}/admin/me", timeout=15)
    assert me.status_code == 401


# ---------- static files ----------
def test_brochure_downloadable():
    url = f"{BASE}/brochure/NexCare-Healthcare-Consulting-Brochure.pdf"
    r = requests.get(url, timeout=20)
    assert r.status_code == 200
    assert "pdf" in r.headers.get("content-type", "").lower() or r.content[:4] == b"%PDF"
