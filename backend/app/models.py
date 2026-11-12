"""SQLAlchemy models for the portfolio database."""

from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, Index, Integer, String, Text

from .database import Base


class PortfolioInfo(Base):
    __tablename__ = "portfolio_info"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, default="Ravjot Singh")
    tagline = Column(String, nullable=True)
    role = Column(String, nullable=False)
    location = Column(String, nullable=True)
    email = Column(String, nullable=False)
    availability = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    tagline = Column(String, nullable=True)
    category = Column(String, nullable=True)
    year = Column(String, nullable=True)
    role = Column(String, nullable=True)
    timeline = Column(String, nullable=True)
    overview = Column(Text, nullable=True)
    challenge = Column(Text, nullable=True)
    solution = Column(Text, nullable=True)
    metrics = Column(JSON, nullable=True)
    tags = Column(JSON, nullable=True)
    accent_color = Column(String, nullable=True)
    visual_type = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SkillGroup(Base):
    __tablename__ = "skill_groups"

    id = Column(Integer, primary_key=True)
    idx = Column(String, nullable=True)
    title = Column(String, nullable=False)
    blurb = Column(Text, nullable=True)
    icon_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SkillItem(Base):
    __tablename__ = "skill_items"

    id = Column(Integer, primary_key=True)
    group_id = Column(Integer, nullable=False, index=True)
    name = Column(String, nullable=False)
    level = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Experience(Base):
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True)
    role = Column(String, nullable=False)
    company = Column(String, nullable=False)
    period = Column(String, nullable=False)
    location = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    achievements = Column(JSON, nullable=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True)
    degree = Column(String, nullable=False)
    school = Column(String, nullable=False)
    period = Column(String, nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Award(Base):
    __tablename__ = "awards"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    detail = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    project = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class ChatConversation(Base):
    __tablename__ = "chat_conversations"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, nullable=False, index=True)
    role = Column(String, nullable=False)  # "user" | "assistant" | "support"
    sender_name = Column(String, nullable=True)  # e.g. "Ravjot Singh (Master)", "Support Agent"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (Index("ix_chat_messages_conversation_id", "conversation_id"),)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="support")  # "master" | "support"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

