"""FastAPI application for the portfolio backend."""

import logging

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from .chatbot import ChatbotError, generate_reply
from .core.config import settings
from .database import Base, SessionLocal, engine, get_db
from .models import (
    Award,
    ChatConversation,
    ChatMessage,
    ContactMessage,
    Education,
    Experience,
    PortfolioInfo,
    Project,
    SkillGroup,
    SkillItem,
)
from .schemas import (
    AwardOut,
    ChatHistoryResponse,
    ChatMessageOut,
    ChatRequest,
    ChatResponse,
    ContactCreate,
    ContactOut,
    EducationOut,
    ExperienceOut,
    HealthResponse,
    PortfolioInfoOut,
    ProjectOut,
    SkillGroupOut,
    SkillItemOut,
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


# --- Startup ------------------------------------------------------------

@app.on_event("startup")
def startup() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    logger.info("API started. CORS origins: %s", settings.BACKEND_CORS_ORIGINS)


# --- Health -------------------------------------------------------------

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


# --- Contact ------------------------------------------------------------

@app.post("/api/contact", response_model=ContactOut, status_code=201, tags=["contact"])
def create_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    message = ContactMessage(
        name=payload.name,
        email=payload.email,
        project=payload.project or "",
        message=payload.message,
    )
    db.add(message)
    try:
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Failed to store contact message")
        raise HTTPException(
            status_code=500,
            detail="Could not save your message. Please try again.",
        )
    db.refresh(message)
    return message


# --- Chat ---------------------------------------------------------------

@app.post("/api/chat", response_model=ChatResponse, tags=["chat"])
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    message = payload.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    conversation_id = payload.conversation_id
    if conversation_id:
        conversation = db.get(ChatConversation, conversation_id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found.")
    else:
        conversation = ChatConversation(title=message[:60])
        db.add(conversation)
        db.flush()
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
def chat_history(conversation_id: int, db: Session = Depends(get_db)):
    conversation = db.get(ChatConversation, conversation_id)
    if not conversation:
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
def start_chat(db: Session = Depends(get_db)):
    """Create an empty conversation and return its id."""
    conversation = ChatConversation(title="New conversation")
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return {"conversation_id": conversation.id, "title": conversation.title}
