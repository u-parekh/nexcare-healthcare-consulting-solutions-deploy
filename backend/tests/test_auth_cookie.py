import os

os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "nexcare_ci")

from auth import cookie_samesite  # noqa: E402


def test_samesite_defaults_to_strict(monkeypatch):
    monkeypatch.delenv("ADMIN_COOKIE_SAMESITE", raising=False)
    assert cookie_samesite() == "strict"


def test_samesite_none_for_cross_site_api(monkeypatch):
    monkeypatch.setenv("ADMIN_COOKIE_SAMESITE", " None ")
    assert cookie_samesite() == "none"


def test_samesite_rejects_garbage(monkeypatch):
    monkeypatch.setenv("ADMIN_COOKIE_SAMESITE", "whatever")
    assert cookie_samesite() == "strict"
