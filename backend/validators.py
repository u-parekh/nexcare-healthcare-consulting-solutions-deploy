import re
import unicodedata
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

SERVICE_OPTIONS = [
    "Medical Record Digitization & MRD Services",
    "Surgical & Biomedical Equipment and Outsourced Pharmacy Services",
    "Hospital Website Development & Digital Planning Services",
    "Healthcare Consulting",
    "Hospital Planning & Design",
    "Server & Data Planning",
    "Maintenance & IT Services",
    "Software & HMS Guidance",
    "Feasibility & Business Analytics",
    "Quality Assurance",
    "Other / General inquiry",
]

SERVICE_SLUGS = {
    "mrd-digitization", "surgical-biomedical-pharmacy", "hospital-website-digital",
    "healthcare-consulting", "hospital-planning-design", "server-data-planning", "maintenance-it",
    "software-hms-guidance", "feasibility-business-analytics", "quality-assurance",
}

CONTACT_STATUSES = {"new", "in_progress", "replied", "closed", "spam"}
ASSESSMENT_STATUSES = {"in_progress", "completed", "contacted", "closed"}
PHONE_RE = re.compile(r"^\d{10}$")


def clean_name(v: str) -> str:
    v = re.sub(r"\s+", " ", (v or "").strip())
    if not 2 <= len(v) <= 80:
        raise ValueError("Name must be between 2 and 80 characters.")
    for ch in v:
        cat = unicodedata.category(ch)
        if not (cat.startswith("L") or cat.startswith("M") or ch in " .'-"):
            raise ValueError("Name can contain letters, spaces, apostrophes, hyphens and dots only.")
    if not any(unicodedata.category(c).startswith("L") for c in v):
        raise ValueError("Please enter a valid name.")
    return v


def clean_phone(v: str) -> str:
    v = (v or "").strip()
    if not PHONE_RE.match(v):
        raise ValueError("Phone number must be exactly 10 digits.")
    return v


def clean_message(v: str) -> str:
    v = (v or "").strip()
    if len(v) > 2000:
        raise ValueError("Message must be 2000 characters or fewer.")
    if sum(1 for c in v if c.isalnum()) < 3:
        raise ValueError("Message must contain at least 3 meaningful characters.")
    return v


class PersonFields(BaseModel):
    name: str = Field(..., max_length=200)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    captcha_token: str = Field(..., max_length=4000)

    @field_validator("name")
    @classmethod
    def _name(cls, v):
        return clean_name(v)

    @field_validator("email", mode="before")
    @classmethod
    def _email(cls, v):
        v = str(v or "").strip().lower()
        if len(v) > 254:
            raise ValueError("Email is too long.")
        return v

    @field_validator("phone")
    @classmethod
    def _phone(cls, v):
        return clean_phone(v)


class ContactIn(PersonFields):
    service: str
    message: str = Field(..., max_length=4000)
    website: Optional[str] = Field(default="", max_length=200)  # honeypot

    @field_validator("service")
    @classmethod
    def _service(cls, v):
        if v not in SERVICE_OPTIONS:
            raise ValueError("Please select a valid service.")
        return v

    @field_validator("message")
    @classmethod
    def _message(cls, v):
        return clean_message(v)


class AnswerItem(BaseModel):
    question: str = Field(..., min_length=1, max_length=200)
    answer: str = Field(..., min_length=1, max_length=120)


class AssessmentStart(PersonFields):
    client_ref: str = Field(..., min_length=8, max_length=64, pattern=r"^[A-Za-z0-9-]+$")
    answers: List[AnswerItem] = Field(..., min_length=5, max_length=5)
    website: Optional[str] = Field(default="", max_length=200)


class AssessmentComplete(BaseModel):
    token: str = Field(..., min_length=20, max_length=200)
    answers: List[AnswerItem] = Field(..., min_length=10, max_length=10)
    recommended: List[str] = Field(default_factory=list, max_length=3)

    @field_validator("recommended")
    @classmethod
    def _rec(cls, v):
        if any(s not in SERVICE_SLUGS for s in v):
            raise ValueError("Invalid recommendation.")
        return v


class RecordUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = Field(default=None, max_length=2000)


class LoginIn(BaseModel):
    username: str = Field(..., min_length=1, max_length=64)
    password: str = Field(..., min_length=1, max_length=128)


class VisitIn(BaseModel):
    visitor_id: str = Field(..., min_length=8, max_length=64, pattern=r"^[A-Za-z0-9-]+$")
    path: str = Field(..., min_length=1, max_length=200)
    referrer: Optional[str] = Field(default="", max_length=300)


class HeartbeatIn(BaseModel):
    visitor_id: str = Field(..., min_length=8, max_length=64, pattern=r"^[A-Za-z0-9-]+$")
    path: str = Field(..., min_length=1, max_length=200)
    seconds: int = Field(..., ge=1, le=600)
