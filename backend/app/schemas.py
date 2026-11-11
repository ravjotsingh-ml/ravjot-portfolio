"""Pydantic request/response schemas."""

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field

EMAIL_PATTERN = r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"


# --- Portfolio ---

class PortfolioInfoOut(BaseModel):
    id: int
    name: str
    tagline: Optional[str] = None
    role: str
    location: Optional[str] = None
    email: str
    availability: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# --- Projects ---

class ProjectOut(BaseModel):
    id: int
    title: str
    tagline: Optional[str] = None
    category: Optional[str] = None
    year: Optional[str] = None
    role: Optional[str] = None
    timeline: Optional[str] = None
    overview: Optional[str] = None
    challenge: Optional[str] = None
    solution: Optional[str] = None
    metrics: Optional[list[dict[str, Any]]] = None
    tags: Optional[list[str]] = None
    accent_color: Optional[str] = None
    visual_type: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# --- Skills ---

class SkillItemOut(BaseModel):
    id: int
    group_id: int
    name: str
    level: Optional[str] = None

    model_config = {"from_attributes": True}


class SkillGroupOut(BaseModel):
    id: int
    idx: Optional[str] = None
    title: str
    blurb: Optional[str] = None
    icon_name: Optional[str] = None
    items: list[SkillItemOut] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# --- Experience / Education / Awards ---

class ExperienceOut(BaseModel):
    id: int
    role: str
    company: str
    period: str
    location: Optional[str] = None
    summary: Optional[str] = None
    achievements: Optional[list[str]] = None
    tags: Optional[list[str]] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class EducationOut(BaseModel):
    id: int
    degree: str
    school: str
    period: Optional[str] = None
    note: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class AwardOut(BaseModel):
    id: int
    title: str
    detail: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Contact ---

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., pattern=EMAIL_PATTERN, max_length=200)
    project: Optional[str] = Field(default=None, max_length=120)
    message: str = Field(..., min_length=10, max_length=5000)


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    project: Optional[str] = None
    read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Chat ---

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: Optional[int] = None


class ChatMessageOut(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatResponse(BaseModel):
    conversation_id: int
    message: ChatMessageOut


class ChatHistoryResponse(BaseModel):
    conversation_id: int
    messages: list[ChatMessageOut]


# --- Misc ---

class HealthResponse(BaseModel):
    status: str
    database: str
    gemini_configured: bool
