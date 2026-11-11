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


def seed_database(db: Session) -> None:
    """Insert default portfolio data when tables are empty."""
    created = False

    if db.query(PortfolioInfo).count() == 0:
        db.add(
            PortfolioInfo(
                name="Ravjot Singh",
                tagline="Designing and building digital products that feel effortless.",
                role="Front-end Engineer & Interface Designer",
                location="Toronto, Canada",
                email="hello@ravjotsingh.dev",
                availability="Available for new projects",
            )
        )
        created = True

    if db.query(Project).count() == 0:
        projects = [
            {
                "title": "Northwind Analytics",
                "tagline": "Product analytics, made legible.",
                "category": "SaaS",
                "year": "2026",
                "role": "Lead designer & front-end engineer",
                "timeline": "14 weeks",
                "overview": "Northwind's data platform was powerful but impenetrable. I led the redesign of their core analytics workspace — from information architecture and design system through to a highly performant React front end.",
                "challenge": "Customers were exporting CSVs to make sense of their own dashboards. The interface surfaced every metric at once, creating noise instead of insight.",
                "solution": "We rebuilt the experience around progressive disclosure: a focused overview, composable saved views, and a query language that non-analysts can actually use. A new charting layer renders 50k+ points without dropping a frame.",
                "metrics": [
                    {"value": "31%", "label": "faster time-to-insight"},
                    {"value": "2.4×", "label": "dashboard adoption"},
                    {"value": "98", "label": "Lighthouse performance"},
                ],
                "tags": ["React", "TypeScript", "D3.js", "Tailwind CSS"],
                "accent_color": "#d9ff43",
                "visual_type": "analytics",
            },
            {
                "title": "Atlas Research",
                "tagline": "An AI copilot for deep research.",
                "category": "SaaS",
                "year": "2025",
                "role": "Product designer & front-end lead",
                "timeline": "10 weeks",
                "overview": "Atlas asked a hard question: how do you make an AI research tool that people actually trust? I designed and built the reading and synthesis experience, with citations woven into every answer.",
                "challenge": "Early users loved the answers but didn't trust them. Hallucinations eroded confidence and long responses felt like a black box.",
                "solution": "Every claim links back to a highlighted source passage. A side-by-side reading mode lets researchers verify in context, while streaming responses and optimistic UI keep the tool feeling instant.",
                "metrics": [
                    {"value": "63%", "label": "weekly retention lift"},
                    {"value": "4.8/5", "label": "trust score"},
                    {"value": "<120ms", "label": "interaction latency"},
                ],
                "tags": ["Next.js", "TypeScript", "OpenAI", "Streaming"],
                "accent_color": "#7c9cff",
                "visual_type": "ai",
            },
            {
                "title": "Lumen Banking",
                "tagline": "Money, finally in focus.",
                "category": "Mobile",
                "year": "2025",
                "role": "Product designer & design systems",
                "timeline": "22 weeks",
                "overview": "Lumen is a challenger bank for freelancers. I owned the end-to-end product design and built the React Native component library that powers their iOS and Android apps.",
                "challenge": "Freelancers juggle irregular income, taxes, and multiple accounts. Existing banking apps added anxiety instead of removing it.",
                "solution": "A single “safe to spend” number, automatic tax set-asides, and a transaction feed that groups spending by project. Motion and haptics make every state change feel tangible without slowing things down.",
                "metrics": [
                    {"value": "+38%", "label": "activation rate"},
                    {"value": "4.9★", "label": "App Store rating"},
                    {"value": "−27%", "label": "support tickets"},
                ],
                "tags": ["React Native", "TypeScript", "Figma", "Reanimated"],
                "accent_color": "#c4a7ff",
                "visual_type": "finance",
            },
            {
                "title": "Tideline",
                "tagline": "Slow travel, beautifully planned.",
                "category": "Mobile",
                "year": "2024",
                "role": "Design partner & front-end developer",
                "timeline": "12 weeks",
                "overview": "Tideline is a bootstrapped travel app with a contrarian thesis: fewer notifications, fewer lists, more presence. I partnered with the founders from naming through launch.",
                "challenge": "Travel apps compete on features, overwhelming users with itineraries, maps, and bookings. Tideline needed to feel like a deep breath.",
                "solution": "An editorial, photo-led home feed, one-tap day plans, and offline-first saves. The interface uses generous whitespace and a restrained palette so the destinations remain the hero.",
                "metrics": [
                    {"value": "18k", "label": "first-month installs"},
                    {"value": "4.7★", "label": "average rating"},
                    {"value": "92%", "label": "day-7 retention"},
                ],
                "tags": ["React Native", "Expo", "Supabase", "Reanimated"],
                "accent_color": "#6fe3c1",
                "visual_type": "travel",
            },
            {
                "title": "Forma Studio",
                "tagline": "Space for architecture to breathe.",
                "category": "Websites",
                "year": "2024",
                "role": "Design & development",
                "timeline": "8 weeks",
                "overview": "Forma needed a digital home as considered as their buildings. The result is a minimal, typographically driven site with a custom project viewer and a lightweight CMS.",
                "challenge": "Architecture photography is heavy. The previous site loaded 12MB of unoptimised images and buried projects behind a confusing grid.",
                "solution": "Responsive AVIF/WebP art direction, blur-up placeholders, and a gallery that respects the images. Animations are limited to opacity and transform so scrolling stays glassy on mobile.",
                "metrics": [
                    {"value": "0.7s", "label": "largest contentful paint"},
                    {"value": "100", "label": "Lighthouse performance"},
                    {"value": "+54%", "label": "enquiries"},
                ],
                "tags": ["React", "Vite", "GSAP", "Sanity"],
                "accent_color": "#ffb178",
                "visual_type": "studio",
            },
            {
                "title": "Mono Design System",
                "tagline": "One language, forty products.",
                "category": "Systems",
                "year": "2023",
                "role": "Founder & maintainer",
                "timeline": "Ongoing",
                "overview": "Mono is an open-source design system I created and maintain. It now powers a suite of enterprise products and is used by more than 40 engineers every week.",
                "challenge": "Twelve teams were shipping twelve different buttons. Inconsistent accessibility, duplicate work, and a brand that drifted with every release.",
                "solution": "A three-tier token architecture, headless accessible primitives, and documentation that lives inside Storybook. Adoption was driven by codemods and a dedicated office-hours ritual, not mandates.",
                "metrics": [
                    {"value": "40+", "label": "weekly users"},
                    {"value": "−60%", "label": "UI build time"},
                    {"value": "WCAG", "label": "2.2 AA compliant"},
                ],
                "tags": ["React", "TypeScript", "Storybook", "Radix UI"],
                "accent_color": "#ff9ecf",
                "visual_type": "system",
            },
        ]
        for item in projects:
            db.add(Project(**item))
        created = True

    if db.query(SkillGroup).count() == 0:
        groups = [
            {
                "idx": "01",
                "title": "Front-end engineering",
                "blurb": "Production-grade interfaces, built to last.",
                "icon_name": "code",
                "items": ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript", "HTML & CSS", "Vite", "React Query"],
            },
            {
                "idx": "02",
                "title": "Interface & product design",
                "blurb": "From first sketch to polished system.",
                "icon_name": "palette",
                "items": ["Figma", "Design systems", "Interaction design", "Prototyping", "Motion design", "Accessibility"],
            },
            {
                "idx": "03",
                "title": "Tooling & craft",
                "blurb": "The unglamorous work that keeps things sharp.",
                "icon_name": "layers",
                "items": ["Git & GitHub", "Storybook", "Vitest", "Vercel", "CI / CD", "Web performance", "SEO", "Analytics"],
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
                "role": "Senior Front-end Engineer",
                "company": "Northwind Labs",
                "period": "2023 — Present",
                "location": "Toronto · Remote",
                "summary": "Lead front-end for Northwind's analytics platform, working alongside product and design to raise the bar on craft and performance.",
                "achievements": [
                    "Rebuilt the core workspace in React and TypeScript, cutting interaction latency by 47% and lifting dashboard adoption 2.4×.",
                    "Introduced a token-driven design system adopted by four product squads, reducing UI build time by roughly 60%.",
                    "Mentored three engineers and established the team's accessibility and performance review process.",
                ],
                "tags": ["React", "TypeScript", "Design systems", "Performance"],
            },
            {
                "role": "Front-end Engineer & Designer",
                "company": "Studio Nomad",
                "period": "2021 — 2023",
                "location": "Remote",
                "summary": "A six-person studio building brand-led digital experiences for architecture, fashion, and culture clients.",
                "achievements": [
                    "Designed and shipped 14 award-considered marketing sites, averaging 98+ Lighthouse scores.",
                    "Created the studio's reusable motion and page-transition toolkit, cutting project setup from days to hours.",
                    "Partnered directly with clients on strategy, art direction, and front-end delivery.",
                ],
                "tags": ["Next.js", "GSAP", "Sanity", "Art direction"],
            },
            {
                "role": "UI Designer & Developer",
                "company": "Independent",
                "period": "2019 — 2021",
                "location": "Toronto",
                "summary": "Freelance designer-developer helping early-stage startups turn rough ideas into shippable product interfaces.",
                "achievements": [
                    "Launched MVPs for seven pre-seed startups across fintech, health, and creator tools.",
                    "Built a reputation for fast, opinionated design paired with clean, maintainable code.",
                    "Ran discovery workshops and usability tests that shaped product roadmaps.",
                ],
                "tags": ["React", "Figma", "Product design", "Prototyping"],
            },
        ]
        for item in jobs:
            db.add(Experience(**item))
        created = True

    if db.query(Education).count() == 0:
        db.add(
            Education(
                degree="B.Des, Interaction Design",
                school="OCAD University",
                period="2015 — 2019",
                note="Graduated with honours. Thesis on accessible interface motion.",
            )
        )
        created = True

    if db.query(Award).count() == 0:
        db.add(Award(title="Awwwards Honourable Mention", detail="Forma Studio · 2024"))
        db.add(Award(title="CSS Design Awards — Best UI", detail="Tideline · 2024"))
        db.add(Award(title="Northwind Craft Award", detail="Design systems · 2025"))
        created = True

    if created:
        db.commit()
        logger.info("Portfolio database seeded with default content.")
