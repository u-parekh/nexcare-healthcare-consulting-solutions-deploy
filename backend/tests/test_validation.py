import os
import pytest
from pydantic import ValidationError

os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
os.environ.setdefault("DB_NAME", "nexcare_ci")

from validators import ContactIn, clean_name  # noqa: E402
from admin_routes import xl_safe  # noqa: E402

BASE = dict(name="Priya Shah", email="Priya@Example.com", phone="9876543210",
            service="Healthcare Consulting", message="Need help", captcha_token="t")


def test_valid_contact_normalises_email():
    c = ContactIn(**BASE)
    assert c.email == "priya@example.com"


@pytest.mark.parametrize("field,value", [
    ("name", "J0hn"), ("name", "a"), ("name", "John@"), ("phone", "98765"), ("phone", "98765abcde"),
    ("email", "bad"), ("service", "Not a service"), ("message", "   "), ("message", "!!"),
])
def test_invalid_contact(field, value):
    with pytest.raises(ValidationError):
        ContactIn(**{**BASE, field: value})


def test_unicode_names_allowed():
    assert clean_name("  José  D'Souza ") == "José D'Souza"
    assert clean_name("हेत लिंबाचिया")


def test_formula_injection_escaped():
    assert xl_safe("=SUM(A1)") == "'=SUM(A1)"
    assert xl_safe("+91") == "'+91"
    assert xl_safe("hello") == "hello"


def test_confirmation_event_shape(monkeypatch):
    import notifications
    sent = {}
    monkeypatch.setattr(notifications.resend.Events, "send", lambda p: sent.update(p) or {"object": "event"})
    notifications._send_event("Priya <b>", "priya@example.com", "Hi <script>")
    assert sent["event"] == "contact.inquiry"
    assert sent["email"] == "priya@example.com"
    assert sent["payload"] == {"name": "Priya &lt;b&gt;", "email": "priya@example.com", "message": "Hi &lt;script&gt;"}
