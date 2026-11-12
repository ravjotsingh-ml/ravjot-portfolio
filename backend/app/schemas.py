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


# --- Contact / Leads ---

class ContactCreate(BaseModel):
    """Lead captured before the visitor can use the AI assistant."""

    full_name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., pattern=EMAIL_PATTERN, max_length=200)
    phone_number: str = Field(..., min_length=6, max_length=32)
    message: Optional[str] = Field(default=None, max_length=5000)

    # Honeypot: real browsers never fill this hidden field.
    website: Optional[str] = Field(default=None, max_length=200)


class ContactCreatedOut(BaseModel):
    """Returned after a successful submission. Never echoes PII back."""

    lead_id: int
    full_name: str
    session_token: str
    expires_at: datetime
    chatbot_unlocked: bool = True
    duplicate: bool = False
    message: str


class ChatSessionOut(BaseModel):
    valid: bool
    lead_id: Optional[int] = None
    full_name: Optional[str] = None
    expires_at: Optional[datetime] = None
    conversation_id: Optional[int] = None


class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    project: Optional[str] = None
    read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ContactDetailOut(BaseModel):
    id: int
    name: str
    email: str
    phone_number: Optional[str] = None
    project: Optional[str] = None
    message: Optional[str] = None
    read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ConversationSummaryOut(BaseModel):
    id: int
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    message_count: int = 0
    preview: Optional[str] = None

    model_config = {"from_attributes": True}


# --- Admin Auth & Team ---

class AdminLoginRequest(BaseModel):
    password: str = Field(..., min_length=1)
    email: Optional[str] = None


class AdminLoginResponse(BaseModel):
    authenticated: bool
    token: str
    user: str
    role: str = "master"  # "master" | "support"
    email: Optional[str] = None


class AdminUserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminUserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=120)
    password: str = Field(..., min_length=4, max_length=100)
    role: Optional[str] = "support"  # "master" | "support"


class AdminUserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class AdminChatReplyRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)
    sender_name: Optional[str] = None


# --- Chat ---

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_id: Optional[int] = None


class ChatMessageOut(BaseModel):
    id: int
    conversation_id: int
    role: str
    sender_name: Optional[str] = None
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
