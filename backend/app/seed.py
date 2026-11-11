"""Seed the database with the portfolio's canonical content."""

import logging

from sqlalchemy.orm import Session

from .models import (
    Award,
    Education,
    Experience,
    PortfolioInfo,
    Project,
    SkillGroup,
    SkillItem,
)

logger = logging.getLogger(__name__)


def seed_database(db: Session, force: bool = False) -> None:
    """Insert default portfolio data when tables are empty or force is True."""
    if force:
        db.query(SkillItem).delete()
        db.query(SkillGroup).delete()
        db.query(Project).delete()
        db.query(Experience).delete()
        db.query(Education).delete()
        db.query(Award).delete()
        db.query(PortfolioInfo).delete()
        db.commit()

    created = False

    if db.query(PortfolioInfo).count() == 0:
        db.add(
            PortfolioInfo(
                name="Ravjot Singh",
                tagline="Computer Science Engineering graduate skilled in Python, FastAPI, Django, REST APIs, and PostgreSQL. Experienced in Agentic AI, Machine Learning, and Computer Vision.",
                role="AI & Full-Stack Engineer",
                location="Punjab, India",
                email="ravjotsg03@gmail.com",
                availability="Available for full-time roles & projects",
            )
        )
        created = True

    if db.query(Project).count() == 0:
        projects = [
            {
                "title": "Scholar Sync",
                "tagline": "Academic platform for marks, assignments & records.",
                "category": "Full-Stack",
                "year": "2026",
                "role": "Full-Stack Developer",
                "timeline": "Academic Capstone",
                "overview": "Scholar Sync is a comprehensive academic portal built to streamline student and faculty workflows. It provides real-time access to marks, assignment submissions, and academic announcements.",
                "challenge": "Academic institutions often struggle with fragmented portals for student marks, assignment submissions, and faculty announcements, leading to sync issues and poor student experience.",
                "solution": "Architected a scalable full-stack web application with role-based access control (RBAC), high-throughput FastAPI REST endpoints, and a responsive React frontend backed by structured PostgreSQL relational schemas.",
                "metrics": [
                    {"value": "FastAPI", "label": "REST backend"},
                    {"value": "PostgreSQL", "label": "Relational database"},
                    {"value": "100% RBAC", "label": "Role-based access"},
                ],
                "tags": ["Python", "FastAPI", "PostgreSQL", "React", "Tailwind CSS", "JavaScript"],
                "accent_color": "#6fe3c1",
                "visual_type": "system",
            },
            {
                "title": "Cracked Screen Detection",
                "tagline": "Intelligent video inspection & screen condition analysis.",
                "category": "Computer Vision",
                "year": "2026",
                "role": "Computer Vision & AI Developer",
                "timeline": "8 weeks",
                "overview": "An automated inspection pipeline designed for mobile devices. It processes smartphone condition videos, eliminates blur, identifies phone orientation, and detects screen fractures.",
                "challenge": "Raw inspection videos contain hundreds of repetitive, blurry, or misoriented frames, making manual assessment tedious and automated classification prone to false positives.",
                "solution": "Implemented computer vision algorithms in OpenCV for blur filtering, orientation detection, and side identification to extract clear keyframes. Integrated Hugging Face zero-shot models and multimodal LLM analysis to accurately identify and log cracked screen evidence.",
                "metrics": [
                    {"value": "OpenCV", "label": "Blur filtering & keyframe selection"},
                    {"value": "Zero-shot", "label": "Hugging Face vision models"},
                    {"value": "LLM Vision", "label": "Automated crack identification"},
                ],
                "tags": ["Python", "FastAPI", "React", "OpenCV", "Tesseract OCR", "Hugging Face"],
                "accent_color": "#7c9cff",
                "visual_type": "ai",
            },
            {
                "title": "BeanTheory Coffee E-Commerce",
                "tagline": "Specialty coffee storefront with Gemini AI chatbot.",
                "category": "E-Commerce",
                "year": "2026",
                "role": "Full-Stack Python Developer",
                "timeline": "6-month Industrial Project",
                "overview": "BeanTheory is an artisanal coffee e-commerce platform offering an interactive shopping experience. It features full catalog browsing, cart and checkout flows, automated PDF invoice generation, and a Gemini-powered AI chatbot.",
                "challenge": "Creating an engaging shopping experience that provides instant conversational assistance while managing transactional consistency and automated customer notifications.",
                "solution": "Developed a comprehensive Django application backed by PostgreSQL. Embedded an interactive Google Gemini AI chatbot for real-time recommendations, combined with automated PDF invoice generation and email confirmations upon order completion.",
                "metrics": [
                    {"value": "Gemini AI", "label": "Conversational assistant"},
                    {"value": "Django + SQL", "label": "Robust transactional backend"},
                    {"value": "Automated", "label": "PDF invoices & emails"},
                ],
                "tags": ["Python", "Django", "PostgreSQL", "Gemini AI", "HTML & CSS", "Bootstrap"],
                "accent_color": "#ffb178",
                "visual_type": "finance",
            },
        ]
        for item in projects:
            db.add(Project(**item))
        created = True

    if db.query(SkillGroup).count() == 0:
        groups = [
            {
                "idx": "01",
                "title": "Agentic AI, ML & Computer Vision",
                "blurb": "Autonomous agents, multimodal intelligence, and vision pipelines.",
                "icon_name": "sparkles",
                "items": [
                    "LangChain",
                    "LangGraph",
                    "LLMs",
                    "Swiggy MCP",
                    "Gemini AI",
                    "Hugging Face",
                    "OpenCV",
                    "Tesseract OCR",
                    "Machine Learning",
                ],
            },
            {
                "idx": "02",
                "title": "Backend & Databases",
                "blurb": "High-throughput APIs, schemas, and vector stores.",
                "icon_name": "code",
                "items": [
                    "Python",
                    "FastAPI",
                    "Django",
                    "Django REST Framework",
                    "REST APIs",
                    "PostgreSQL",
                    "pgvector",
                    "ChromaDB",
                    "SQLite3",
                ],
            },
            {
                "idx": "03",
                "title": "Frontend & Developer Tools",
                "blurb": "Modern web UIs, data tools, and testing utilities.",
                "icon_name": "layers",
                "items": [
                    "React",
                    "Tailwind CSS",
                    "JavaScript",
                    "HTML & CSS",
                    "Git & GitHub",
                    "VS Code",
                    "pgAdmin",
                    "Playwright",
                    "SerpAPI",
                    "Streamlit",
                    "NumPy & Pandas",
                ],
            },
        ]
        for group in groups:
            items = group.pop("items")
            record = SkillGroup(**group)
            db.add(record)
            db.flush()
            for name in items:
                db.add(SkillItem(group_id=record.id, name=name))
        created = True

    if db.query(Experience).count() == 0:
        jobs = [
            {
                "role": "Trainee — Machine Learning | Agentic AI",
                "company": "Seasia Group of Companies",
                "period": "Jun 2026 — Present",
                "location": "Mohali, Punjab · Hybrid",
                "summary": "Building agentic AI food recommendation systems and automated computer vision inspection pipelines.",
                "achievements": [
                    "Developing an Agentic AI food recommendation system using Swiggy MCP, LangChain, and LangGraph to identify suitable food combinations based on user prompts.",
                    "Working with ChromaDB and PostgreSQL with pgvector for vector storage and retrieval to support context-aware food matching.",
                    "Developing a cracked phone detection system using Python, FastAPI, OpenCV, and Tesseract OCR to process inspection videos and select clear, representative frames.",
                    "Integrating Hugging Face zero-shot models and LLM-based visual analysis to assess phone condition and detect screen cracks.",
                ],
                "tags": ["Agentic AI", "LangChain", "LangGraph", "Swiggy MCP", "ChromaDB", "pgvector", "OpenCV", "FastAPI"],
            },
            {
                "role": "Industrial Trainee — Data Science, Python, Machine Learning & AI",
                "company": "CS Soft Solutions (India) Pvt. Ltd.",
                "period": "Dec 2025 — May 2026",
                "location": "Mohali, Punjab",
                "summary": "Completed a 6-month intensive industrial training in Python, Data Science, Machine Learning, and AI application development.",
                "achievements": [
                    "Completed six months of industrial training in Python, Data Science, Machine Learning, and Artificial Intelligence.",
                    "Developed BeanTheory, a coffee e-commerce application using Django and PostgreSQL, with authentication and product management.",
                    "Integrated a Gemini AI chatbot, automated PDF invoices, and email delivery.",
                ],
                "tags": ["Python", "Django", "PostgreSQL", "Machine Learning", "Gemini AI", "Data Science"],
            },
        ]
        for item in jobs:
            db.add(Experience(**item))
        created = True

    if db.query(Education).count() == 0:
        db.add(
            Education(
                degree="B.Tech. in Computer Science and Engineering",
                school="Guru Nanak Dev University, Jalandhar, Punjab",
                period="2022 — 2026",
                note="CGPA: 7.91 · Focused on Software Engineering, Machine Learning, and Full-Stack Development.",
            )
        )
        db.add(
            Education(
                degree="Class XII (Non-Medical)",
                school="Kamla Nehru Public School, Phagwara, Punjab",
                period="2021 — 2022",
                note="Score: 75.2%",
            )
        )
        db.add(
            Education(
                degree="Class X",
                school="Kamla Nehru Public School, Phagwara, Punjab",
                period="2019 — 2020",
                note="Score: 82.4%",
            )
        )
        created = True

    if db.query(Award).count() == 0:
        db.add(
            Award(
                title="First Prize — Web Mania",
                detail="Inter-College Competition · March 2025",
            )
        )
        db.add(
            Award(
                title="Third Prize — Technical Competition",
                detail="Inter-College TechFest · 2025",
            )
        )
        db.add(
            Award(
                title="Third Prize — Inter-College Event",
                detail="Technical Symposium · 2025",
            )
        )
        db.add(
            Award(
                title="Participant & Finalist",
                detail="Technical Innovation Competition · December 2025",
            )
        )
        created = True

    if created:
        db.commit()
        logger.info("Portfolio database seeded with updated resume content.")
