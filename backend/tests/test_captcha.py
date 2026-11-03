"""Server-side reCAPTCHA v2 verification (Google's siteverify call is mocked - no network)."""
import asyncio
import os

import pytest
from fastapi import HTTPException

os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "nexcare_ci")

import core  # noqa: E402

SECRET = "unit-test-secret-never-real"


class FakeResponse:
    def __init__(self, data):
        self._data = data

    def json(self):
        return self._data


class FakeClient:
    def __init__(self, data, calls, boom=False):
        self.data, self.calls, self.boom = data, calls, boom

    async def __aenter__(self):
        return self

    async def __aexit__(self, *exc):
        return False

    async def post(self, url, data=None):
        self.calls.append((url, data))
        if self.boom:
            raise RuntimeError("network down")
        return FakeResponse(self.data)


@pytest.fixture
def google(monkeypatch):
    """Returns a function that makes siteverify answer with the given JSON (or fail); records every call."""
    calls = []
    monkeypatch.setenv("RECAPTCHA_SECRET_KEY", SECRET)
    monkeypatch.delenv("RECAPTCHA_ALLOWED_HOSTNAMES", raising=False)

    def answer(data=None, boom=False):
        monkeypatch.setattr(core.httpx, "AsyncClient", lambda timeout=None: FakeClient(data, calls, boom))
        return calls

    return answer


def run(token="tok"):
    return asyncio.run(core.verify_captcha(token, "203.0.113.9"))


def rejected(token="tok"):
    with pytest.raises(HTTPException) as e:
        run(token)
    return e.value


def test_valid_token_is_accepted_and_secret_is_sent_only_to_google(google):
    calls = google({"success": True, "hostname": "localhost"})
    run()
    url, payload = calls[0]
    assert url == "https://www.google.com/recaptcha/api/siteverify"
    assert payload["secret"] == SECRET and payload["response"] == "tok"


def test_missing_token_is_rejected_without_calling_google(google):
    calls = google({"success": True})
    e = rejected("")
    assert e.status_code == 400 and "robot" in e.detail
    assert calls == []


def test_failed_token_is_rejected(google):
    google({"success": False, "error-codes": ["invalid-input-response"]})
    e = rejected()
    assert e.status_code == 400 and "Human verification failed" in e.detail


def test_expired_or_reused_token_gets_a_clear_message(google):
    google({"success": False, "error-codes": ["timeout-or-duplicate"]})
    e = rejected()
    assert e.status_code == 400 and "expired" in e.detail


def test_wrong_secret_is_a_server_problem_not_the_visitors(google):
    google({"success": False, "error-codes": ["invalid-input-secret"]})
    assert rejected().status_code == 503


def test_hostname_must_match_when_configured(google, monkeypatch):
    monkeypatch.setenv("RECAPTCHA_ALLOWED_HOSTNAMES", "nexcareconsulting.com, www.nexcareconsulting.com")
    google({"success": True, "hostname": "evil.example"})
    assert rejected().status_code == 400
    google({"success": True, "hostname": "www.nexcareconsulting.com"})
    run()


def test_not_configured_and_network_failure_return_503(google, monkeypatch):
    google(boom=True)
    assert rejected().status_code == 503
    monkeypatch.delenv("RECAPTCHA_SECRET_KEY")
    assert rejected().status_code == 503


def test_secret_never_appears_in_error_responses(google):
    google({"success": False, "error-codes": ["invalid-input-response"]})
    assert SECRET not in rejected().detail
