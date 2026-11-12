"""FastAPI application for the portfolio backend."""

import base64
from datetime import datetime, timedelta
import hashlib
import hmac
import json
import logging
import os
import re
import time
from typing import Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from .chatbot import ChatbotError, generate_reply
from .core.config import settings
from .database import Base, SessionLocal, engine, get_db
from .models import (
    AdminUser,
    Award,
    ChatConversation,
    ChatMessage,
    ContactMessage,
    Education,
    Experience,
    Lead,
    LeadSession,
    PortfolioInfo,
    Project,
    SkillGroup,
    SkillItem,
)
from .schemas import (
    AdminChatReplyRequest,
    AdminLoginRequest,
    AdminLoginResponse,
    AdminUserCreate,
    AdminUserOut,
    AdminUserUpdate,
    AwardOut,
    ChatHistoryResponse,
    ChatMessageOut,
    ChatRequest,
    ChatResponse,
    ChatSessionOut,
    ContactCreate,
    ContactCreatedOut,
    ContactDetailOut,
    ConversationSummaryOut,
    EducationOut,
    ExperienceOut,
    HealthResponse,
    PortfolioInfoOut,
    ProjectOut,
    SkillGroupOut,
    SkillItemOut,
)
from .security import (
    client_ip,
    create_lead_session,
    limiter,
    require_chat_session,
    resolve_token,
)
from .seed import seed_database

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Ravjot Singh Portfolio API",
    description="Portfolio content, contact messages and Gemini-powered chat.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origin_regex=r"https://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Exception handlers -------------------------------------------------

@app.exception_handler(ChatbotError)
async def chatbot_error_handler(request: Request, exc: ChatbotError):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception):
    logger.error("Unhandled error on %s: %s", request.url.path, type(exc).__name__)
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong on the server. Please try again."},
    )


# --- Security & Auth Helpers ------------------------------------------

def hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return f"{salt}${hashed}"


def verify_password(password: str, hashed_value: str) -> bool:
    if not hashed_value or "$" not in hashed_value:
        return False
    salt, hashed = hashed_value.split("$", 1)
    test_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return hmac.compare_digest(hashed, test_hash)


def create_admin_token(user_id: int, role: str, email: str, name: str) -> str:
    payload = {
        "uid": user_id,
        "role": role,
        "email": email,
        "name": name,
        "exp": int(time.time()) + 86400 * 7,
    }
    raw = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    b64 = base64.urlsafe_b64encode(raw).decode("utf-8").rstrip("=")
    sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), b64.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{b64}.{sig}"


def verify_admin_token(token: Optional[str]) -> Optional[dict]:
    if not token:
        return None
    token = token.replace("Bearer ", "").strip()
    if token == settings.SECRET_KEY or token == settings.ADMIN_PASSWORD:
        return {"uid": 0, "role": "master", "name": "Ravjot Singh", "email": "ravjotsg03@gmail.com"}
    parts = token.split(".")
    if len(parts) != 2:
        return None
    b64, sig = parts
    expected = hmac.new(settings.SECRET_KEY.encode("utf-8"), b64.encode("utf-8"), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        return None
    try:
        pad = len(b64) % 4
        if pad:
            b64 += "=" * (4 - pad)
        raw = base64.urlsafe_b64decode(b64.encode("utf-8")).decode("utf-8")
        payload = json.loads(raw)
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None


# --- Startup ------------------------------------------------------------

@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS sender_name VARCHAR;"))
            conn.execute(text("ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS lead_id INTEGER;"))
            conn.execute(
                text(
                    "CREATE INDEX IF NOT EXISTS ix_chat_conversations_lead_id "
                    "ON chat_conversations (lead_id);"
                )
            )
            conn.execute(
                text(
                    "CREATE INDEX IF NOT EXISTS ix_leads_email ON leads (email);"
                )
            )
    except Exception as exc:
        logger.warning("Could not run inline column migration: %s", exc)

    db = SessionLocal()
    try:
        seed_database(db)
        master = db.query(AdminUser).filter(AdminUser.role == "master").first()
        if not master:
            master = AdminUser(
                name="Ravjot Singh",
                email="ravjotsg03@gmail.com",
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                role="master",
                is_active=True,
            )
            db.add(master)
            db.commit()
    finally:
        db.close()
    logger.info("API started. CORS origins: %s", settings.BACKEND_CORS_ORIGINS)


# --- Health -------------------------------------------------------------

@app.get("/health", response_model=HealthResponse, tags=["health"])
@app.get("/api/health", response_model=HealthResponse, tags=["health"])
def health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        database = "connected"
    except Exception:
        database = "error"
    return HealthResponse(
        status="ok",
        database=database,
        gemini_configured=bool(settings.GEMINI_API_KEY),
    )


@app.get("/", tags=["root"])
def root():
    return {
        "name": "Ravjot Singh Portfolio API",
        "version": "1.0.0",
        "docs": "/api/docs",
    }


# --- Portfolio content --------------------------------------------------

@app.get("/api/portfolio", response_model=PortfolioInfoOut, tags=["portfolio"])
def get_portfolio(db: Session = Depends(get_db)):
    info = db.query(PortfolioInfo).first()
    if not info:
        raise HTTPException(status_code=404, detail="Portfolio information not found.")
    return info


@app.get("/api/projects", response_model=list[ProjectOut], tags=["projects"])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).order_by(Project.id.asc()).all()


@app.get("/api/skills", response_model=list[SkillGroupOut], tags=["skills"])
def get_skills(db: Session = Depends(get_db)):
    groups = db.query(SkillGroup).order_by(SkillGroup.id.asc()).all()
    result = []
    for group in groups:
        items = (
            db.query(SkillItem)
            .filter(SkillItem.group_id == group.id)
            .order_by(SkillItem.id.asc())
            .all()
        )
        result.append(
            SkillGroupOut(
                id=group.id,
                idx=group.idx,
                title=group.title,
                blurb=group.blurb,
                icon_name=group.icon_name,
                items=[SkillItemOut.model_validate(item) for item in items],
                created_at=group.created_at,
                updated_at=group.updated_at,
            )
        )
    return result


@app.get("/api/experience", response_model=list[ExperienceOut], tags=["experience"])
def get_experience(db: Session = Depends(get_db)):
    return db.query(Experience).order_by(Experience.id.asc()).all()


@app.get("/api/education", response_model=list[EducationOut], tags=["education"])
def get_education(db: Session = Depends(get_db)):
    return db.query(Education).order_by(Education.id.asc()).all()


@app.get("/api/awards", response_model=list[AwardOut], tags=["awards"])
def get_awards(db: Session = Depends(get_db)):
    return db.query(Award).order_by(Award.id.asc()).all()


# --- Contact / Lead capture ---------------------------------------------

# Real country calling codes, used to verify that the submitted number really
# carries a country code and not just a random string of digits.
COUNTRY_CALLING_CODES = {
    1, 7, 20, 27, 30, 31, 32, 33, 34, 36, 39, 40, 41, 43, 44, 45, 46, 47, 48, 49,
    51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 81, 82, 84, 86,
    90, 91, 92, 93, 94, 95, 98, 212, 213, 216, 218, 220, 233, 234, 254, 255, 256,
    260, 263, 351, 352, 353, 354, 355, 356, 357, 358, 359, 370, 371, 372, 380,
    381, 385, 386, 387, 389, 420, 421, 500, 501, 502, 503, 504, 505, 506, 507,
    509, 590, 591, 592, 593, 595, 597, 598, 599, 670, 672, 673, 674, 675, 676,
    677, 678, 679, 680, 681, 682, 683, 685, 686, 687, 688, 689, 690, 691, 692,
    850, 852, 853, 855, 856, 880, 886, 960, 961, 962, 963, 964, 965, 966, 967,
    968, 970, 971, 972, 973, 974, 975, 976, 977, 992, 993, 994, 995, 996, 998,
}


def normalise_phone(raw: str) -> str:
    """Return an E.164 phone number or raise a 422.

    The number must carry a real country calling code and a plausible
    national length. Spaces, dashes, dots and parentheses are accepted.
    """
    cleaned = re.sub(r"[^\d+]", "", (raw or "").strip())
    if cleaned.startswith("00"):
        cleaned = "+" + cleaned[2:]

    if not re.fullmatch(r"\+[1-9]\d{6,14}", cleaned):
        raise HTTPException(
            status_code=422,
            detail="Please enter a valid phone number including your country code.",
        )

    digits = cleaned[1:]
    national = digits
    calling_code = None
    for length in (3, 2, 1):
        candidate = int(digits[:length])
        if candidate in COUNTRY_CALLING_CODES:
            calling_code = candidate
            national = digits[length:]
            break

    if calling_code is None:
        raise HTTPException(
            status_code=422,
            detail="That country code does not look right. Please check your phone number.",
        )

    if not 4 <= len(national) <= 14:
        raise HTTPException(
            status_code=422,
            detail="Please enter a valid phone number including your country code.",
        )

    if len(set(national)) == 1 or national in {"123456789", "1234567890", "0123456789"}:
        raise HTTPException(
            status_code=422,
            detail="Please enter a valid phone number including your country code.",
        )

    return cleaned


def _lead_to_detail(lead: Lead) -> ContactDetailOut:
    return ContactDetailOut(
        id=lead.id,
        name=lead.full_name,
        email=lead.email,
        phone_number=lead.phone_number,
        project=None,
        message=lead.message,
        read=bool(lead.read),
        created_at=lead.created_at,
    )


def _latest_conversation_id(db: Session, lead_id: int) -> Optional[int]:
    conversation = (
        db.query(ChatConversation)
        .filter(ChatConversation.lead_id == lead_id)
        .order_by(ChatConversation.id.desc())
        .first()
    )
    return conversation.id if conversation else None


@app.post(
    "/api/contact",
    response_model=ContactCreatedOut,
    status_code=201,
    tags=["contact"],
)
def create_contact(payload: ContactCreate, request: Request, db: Session = Depends(get_db)):
    """Save a lead and issue the token that unlocks the AI assistant.

    Validation happens here, not in the browser. Duplicate submissions from the
    same email inside the configured window reuse the existing lead instead of
    creating a second row, and every attempt is rate limited by IP and email.
    """
    # 1. Honeypot — hidden in the UI, so any value means an automated bot.
    if (payload.website or "").strip():
        raise HTTPException(status_code=400, detail="Submission rejected.")

    ip = client_ip(request)
    allowed, retry_after = limiter.check(
        f"contact:ip:{ip}",
        settings.CONTACT_IP_RATE_LIMIT,
        settings.CONTACT_RATE_WINDOW_SECONDS,
    )
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Too many submissions from this device. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )

    email = payload.email.strip().lower()
    allowed, retry_after = limiter.check(
        f"contact:email:{email}",
        settings.CONTACT_RATE_LIMIT,
        settings.CONTACT_RATE_WINDOW_SECONDS,
    )
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="Too many submissions for this email address. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )

    full_name = " ".join(payload.full_name.split())
    phone_number = normalise_phone(payload.phone_number)
    message = (payload.message or "").strip() or None

    # 2. Deduplicate recent submissions without revealing whether an address is
    #    already on file. The visitor still gets a working chat session.
    duplicate_since = datetime.utcnow() - timedelta(
        hours=max(1, settings.DUPLICATE_LEAD_WINDOW_HOURS)
    )
    lead = (
        db.query(Lead)
        .filter(Lead.email == email, Lead.created_at >= duplicate_since)
        .order_by(Lead.created_at.desc())
        .first()
    )
    duplicate = lead is not None

    if not duplicate:
        lead = Lead(
            full_name=full_name,
            email=email,
            phone_number=phone_number,
            message=message,
        )
        db.add(lead)
        try:
            # The lead and its session are written in a single transaction so
            # the visitor gets their token in one round trip.
            db.flush()
            token, session = create_lead_session(db, lead, commit=False)
            db.commit()
        except Exception:
            db.rollback()
            logger.exception("Failed to store lead")
            raise HTTPException(
                status_code=500,
                detail="Could not save your details. Please try again.",
            )
        db.refresh(lead)
        db.refresh(session)
        logger.info("New lead captured: id=%s", lead.id)
    else:
        # Keep the latest name/message useful for follow-up, but never create
        # a duplicate row for the same enquiry.
        changed = False
        if full_name and lead.full_name != full_name:
            lead.full_name = full_name
            changed = True
        if message and lead.message != message:
            lead.message = message
            changed = True
        if changed:
            db.commit()

        token, session = create_lead_session(db, lead)

    # Owner notifications and analytics run in the background so the response
    # is not delayed by SMTP or third-party calls.
    try:
        from .tasks import dispatch_lead_notification

        dispatched = dispatch_lead_notification(lead.id)
        logger.info("Lead %s queued for background processing: %s", lead.id, dispatched)
    except Exception:  # noqa: BLE001 - Celery is optional
        logger.warning("Background processing unavailable for lead %s", lead.id)

    return ContactCreatedOut(
        lead_id=lead.id,
        full_name=lead.full_name,
        session_token=token,
        expires_at=session.expires_at,
        chatbot_unlocked=True,
        duplicate=duplicate,
        message=(
            "We already had your details on file, so we've unlocked the assistant "
            "for you again."
            if duplicate
            else "Thanks for reaching out! Your details are saved."
        ),
    )


@app.get("/api/lead/session", response_model=ChatSessionOut, tags=["contact"])
def get_lead_session(
    x_chat_token: Optional[str] = Header(default=None, alias="X-Chat-Token"),
    authorization: Optional[str] = Header(default=None),
    db: Session = Depends(get_db),
):
    """Validate a stored chat token on page load.

    This is the only proof the frontend trusts. If the token is missing,
    expired or revoked, the chatbot stays locked. An invalid token is reported
    as ``valid: false`` rather than an error, so a stale session never leaves
    a console error behind on the visitor's page.
    """
    token = x_chat_token
    if not token and authorization and authorization.lower().startswith("bearer "):
        token = authorization[7:]

    session = resolve_token(db, token)
    if not session:
        return ChatSessionOut(valid=False)

    lead = db.get(Lead, session.lead_id)
    if not lead:
        return ChatSessionOut(valid=False)

    return ChatSessionOut(
        valid=True,
        lead_id=lead.id,
        full_name=lead.full_name,
        expires_at=session.expires_at,
        conversation_id=_latest_conversation_id(db, lead.id),
    )


# --- Chat ---------------------------------------------------------------

def _conversation_for_lead(db: Session, lead_id: int) -> ChatConversation:
    """Reuse the newest empty conversation, otherwise create a fresh one."""
    conversation = (
        db.query(ChatConversation)
        .filter(ChatConversation.lead_id == lead_id)
        .order_by(ChatConversation.id.desc())
        .first()
    )
    if conversation:
        has_messages = (
            db.query(ChatMessage.id)
            .filter(ChatMessage.conversation_id == conversation.id)
            .first()
        )
        if not has_messages:
            return conversation

    conversation = ChatConversation(title="New conversation", lead_id=lead_id)
    db.add(conversation)
    db.flush()
    return conversation


@app.post("/api/chat", response_model=ChatResponse, tags=["chat"])
def chat(
    payload: ChatRequest,
    session_data: tuple[LeadSession, Lead] = Depends(require_chat_session),
    db: Session = Depends(get_db),
):
    """Send a message to the portfolio assistant.

    Requires the token issued by ``POST /api/contact`` and only ever touches
    conversations owned by that lead.
    """
    session, lead = session_data

    allowed, retry_after = limiter.check(
        f"chat:session:{session.id}",
        settings.CONVERSATION_RATE_LIMIT,
        settings.CONVERSATION_RATE_WINDOW_SECONDS,
    )
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="You're sending messages a little too quickly. Please wait a moment.",
            headers={"Retry-After": str(retry_after)},
        )

    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    conversation_id = payload.conversation_id
    if conversation_id:
        conversation = db.get(ChatConversation, conversation_id)
        if not conversation or conversation.lead_id != lead.id:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found.",
            )
    else:
        conversation = _conversation_for_lead(db, lead.id)
        conversation_id = conversation.id

    user_message = ChatMessage(
        conversation_id=conversation_id,
        role="user",
        content=message,
    )
    db.add(user_message)
    db.flush()

    history = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.conversation_id == conversation_id,
            ChatMessage.id < user_message.id,
        )
        .order_by(ChatMessage.id.asc())
        .all()
    )
    history_payload = [
        {"role": item.role, "content": item.content} for item in history[-12:]
    ]

    conversation.updated_at = datetime.utcnow()
    db.commit()

    try:
        reply = generate_reply(message, history_payload, db)
    except ChatbotError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)

    assistant_message = ChatMessage(
        conversation_id=conversation_id,
        role="assistant",
        content=reply,
    )
    db.add(assistant_message)
    conversation.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(assistant_message)

    return ChatResponse(
        conversation_id=conversation_id,
        message=ChatMessageOut.model_validate(assistant_message),
    )


@app.get(
    "/api/chat/history/{conversation_id}",
    response_model=ChatHistoryResponse,
    tags=["chat"],
)
def chat_history(
    conversation_id: int,
    session_data: tuple[LeadSession, Lead] = Depends(require_chat_session),
    db: Session = Depends(get_db),
):
    """Return messages for a conversation the caller owns.

    A visitor can never read another visitor's conversation, even by guessing
    sequential conversation ids.
    """
    _, lead = session_data

    conversation = db.get(ChatConversation, conversation_id)
    if not conversation or conversation.lead_id != lead.id:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.id.asc())
        .all()
    )
    return ChatHistoryResponse(
        conversation_id=conversation_id,
        messages=[ChatMessageOut.model_validate(item) for item in messages],
    )


@app.post("/api/chat/start", tags=["chat"])
def start_chat(
    session_data: tuple[LeadSession, Lead] = Depends(require_chat_session),
    db: Session = Depends(get_db),
):
    """Create (or reuse) an empty conversation bound to the current lead."""
    _, lead = session_data
    conversation = _conversation_for_lead(db, lead.id)
    db.commit()
    db.refresh(conversation)
    return {"conversation_id": conversation.id, "title": conversation.title}


# --- Admin Endpoints ----------------------------------------------------

@app.post("/api/admin/login", response_model=AdminLoginResponse, tags=["admin"])
def admin_login(payload: AdminLoginRequest, db: Session = Depends(get_db)):
    pwd = payload.password.strip()

    # 1. Master password instant bypass (when no email is provided)
    if pwd == settings.ADMIN_PASSWORD and not payload.email:
        token = create_admin_token(0, "master", "ravjotsg03@gmail.com", "Ravjot Singh")
        return AdminLoginResponse(
            authenticated=True,
            token=token,
            user="Ravjot Singh",
            role="master",
            email="ravjotsg03@gmail.com",
        )

    # 2. Email + password authentication (for Support Team or Master Admin)
    if payload.email:
        email = payload.email.strip().lower()
        user = db.query(AdminUser).filter(AdminUser.email == email).first()

        # Check default master fallback
        if not user and email == "ravjotsg03@gmail.com" and pwd == settings.ADMIN_PASSWORD:
            token = create_admin_token(0, "master", "ravjotsg03@gmail.com", "Ravjot Singh")
            return AdminLoginResponse(
                authenticated=True,
                token=token,
                user="Ravjot Singh",
                role="master",
                email="ravjotsg03@gmail.com",
            )

        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        if not user.is_active:
            raise HTTPException(
                status_code=403,
                detail="Your account has been deactivated. Please contact the master administrator.",
            )

        password_matches = (
            verify_password(pwd, user.password_hash)
            or (user.role == "master" and pwd == settings.ADMIN_PASSWORD)
        )
        if not password_matches:
            raise HTTPException(status_code=401, detail="Invalid email or password.")

        token = create_admin_token(user.id, user.role, user.email, user.name)
        return AdminLoginResponse(
            authenticated=True,
            token=token,
            user=user.name,
            role=user.role,
            email=user.email,
        )

    raise HTTPException(status_code=401, detail="Incorrect admin credentials.")


@app.get("/api/admin/contacts", response_model=list[ContactDetailOut], tags=["admin"])
def list_admin_contacts(db: Session = Depends(get_db)):
    """List all captured leads ordered newest first (admin UI)."""
    leads = db.query(Lead).order_by(Lead.created_at.desc()).all()
    return [_lead_to_detail(lead) for lead in leads]


@app.patch("/api/admin/contacts/{contact_id}/read", response_model=ContactDetailOut, tags=["admin"])
def toggle_contact_read(contact_id: int, db: Session = Depends(get_db)):
    contact = db.get(Lead, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Lead not found.")
    contact.read = not contact.read
    db.commit()
    db.refresh(contact)
    return _lead_to_detail(contact)


@app.delete("/api/admin/contacts/{contact_id}", tags=["admin"])
def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.get(Lead, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Lead not found.")
    db.query(LeadSession).filter(LeadSession.lead_id == contact_id).delete()
    db.delete(contact)
    db.commit()
    return {"status": "deleted", "id": contact_id}


@app.get("/api/admin/conversations", response_model=list[ConversationSummaryOut], tags=["admin"])
def list_admin_conversations(db: Session = Depends(get_db)):
    """List all conversations that have at least one message."""
    conversations = (
        db.query(ChatConversation)
        .order_by(ChatConversation.updated_at.desc(), ChatConversation.id.desc())
        .all()
    )
    result = []
    for conv in conversations:
        messages = (
            db.query(ChatMessage)
            .filter(ChatMessage.conversation_id == conv.id)
            .order_by(ChatMessage.id.asc())
            .all()
        )
        if not messages:
            continue
        first_user_msg = next((m.content for m in messages if m.role == "user"), None)
        title = first_user_msg[:50] + ("..." if len(first_user_msg) > 50 else "") if first_user_msg else f"Chat #{conv.id}"
        result.append(
            ConversationSummaryOut(
                id=conv.id,
                title=title,
                created_at=conv.created_at,
                updated_at=conv.updated_at or conv.created_at,
                message_count=len(messages),
                preview=first_user_msg or (messages[-1].content[:60] if messages else ""),
            )
        )
    return result


@app.get("/api/admin/conversations/{conversation_id}", response_model=list[ChatMessageOut], tags=["admin"])
def get_admin_conversation_messages(conversation_id: int, db: Session = Depends(get_db)):
    """Fetch all messages for an individual conversation thread."""
    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.id.asc())
        .all()
    )
    return messages


@app.post("/api/admin/conversations/{conversation_id}/reply", response_model=ChatMessageOut, tags=["admin"])
def reply_to_conversation(
    conversation_id: int,
    payload: AdminChatReplyRequest,
    db: Session = Depends(get_db),
):
    """Admin or support agent reply directly into a user conversation."""
    conv = db.get(ChatConversation, conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    sender = payload.sender_name or "Support Team"
    reply_msg = ChatMessage(
        conversation_id=conversation_id,
        role="assistant",
        sender_name=sender,
        content=payload.content.strip(),
    )
    db.add(reply_msg)
    conv.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(reply_msg)
    return reply_msg


@app.delete("/api/admin/conversations/{conversation_id}", tags=["admin"])
def delete_conversation(conversation_id: int, db: Session = Depends(get_db)):
    conv = db.get(ChatConversation, conversation_id)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    db.query(ChatMessage).filter(ChatMessage.conversation_id == conversation_id).delete()
    db.delete(conv)
    db.commit()
    return {"status": "deleted", "id": conversation_id}


# --- Team Management (Master Admin) -------------------------------------

@app.get("/api/admin/team", response_model=list[AdminUserOut], tags=["admin"])
def list_team_members(db: Session = Depends(get_db)):
    """List all team members (Master and Support admins)."""
    return db.query(AdminUser).order_by(AdminUser.created_at.desc()).all()


@app.post("/api/admin/team", response_model=AdminUserOut, status_code=201, tags=["admin"])
def create_team_member(payload: AdminUserCreate, db: Session = Depends(get_db)):
    """Master Admin adds a new support agent or admin."""
    email = payload.email.strip().lower()
    existing = db.query(AdminUser).filter(AdminUser.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An admin with this email already exists.")

    new_user = AdminUser(
        name=payload.name.strip(),
        email=email,
        password_hash=hash_password(payload.password.strip()),
        role=payload.role or "support",
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.patch("/api/admin/team/{user_id}", response_model=AdminUserOut, tags=["admin"])
def update_team_member(user_id: int, payload: AdminUserUpdate, db: Session = Depends(get_db)):
    """Update team member details, role, status, or password."""
    user = db.get(AdminUser, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Team member not found.")

    if payload.name is not None:
        user.name = payload.name.strip()
    if payload.email is not None:
        user.email = payload.email.strip().lower()
    if payload.role is not None:
        user.role = payload.role
    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.password:
        user.password_hash = hash_password(payload.password.strip())

    db.commit()
    db.refresh(user)
    return user


@app.delete("/api/admin/team/{user_id}", tags=["admin"])
def delete_team_member(user_id: int, db: Session = Depends(get_db)):
    """Delete a support team member (cannot delete master admin)."""
    user = db.get(AdminUser, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Team member not found.")
    if user.role == "master":
        raise HTTPException(status_code=400, detail="Cannot delete master admin account.")

    db.delete(user)
    db.commit()
    return {"status": "deleted", "id": user_id}


