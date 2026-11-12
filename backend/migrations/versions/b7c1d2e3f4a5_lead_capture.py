"""lead capture and chat session access

Revision ID: b7c1d2e3f4a5
Revises: 85107ac394a3
Create Date: 2026-11-12 15:10:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = "b7c1d2e3f4a5"
down_revision: Union[str, Sequence[str], None] = "85107ac394a3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _tables() -> set[str]:
    return set(inspect(op.get_bind()).get_table_names())


def upgrade() -> None:
    """Create the lead store and the token-bound chat session store."""
    existing = _tables()

    if "leads" not in existing:
        op.create_table(
            "leads",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("full_name", sa.String(), nullable=False),
            sa.Column("email", sa.String(), nullable=False),
            sa.Column("phone_number", sa.String(), nullable=False, server_default=""),
            sa.Column("message", sa.Text(), nullable=True),
            sa.Column("read", sa.Boolean(), nullable=True, server_default=sa.false()),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_leads_email", "leads", ["email"], unique=False)
        op.create_index("ix_leads_created_at", "leads", ["created_at"], unique=False)

    if "lead_sessions" not in existing:
        op.create_table(
            "lead_sessions",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("lead_id", sa.Integer(), nullable=False),
            sa.Column("token_hash", sa.String(), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("last_seen_at", sa.DateTime(), nullable=True),
            sa.Column("expires_at", sa.DateTime(), nullable=False),
            sa.Column("revoked", sa.Boolean(), nullable=True, server_default=sa.false()),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("token_hash"),
        )
        op.create_index("ix_lead_sessions_lead_id", "lead_sessions", ["lead_id"], unique=False)
        op.create_index(
            "ix_lead_sessions_token_hash", "lead_sessions", ["token_hash"], unique=True
        )

    columns = {col["name"] for col in inspect(op.get_bind()).get_columns("chat_conversations")}
    if "lead_id" not in columns:
        op.add_column("chat_conversations", sa.Column("lead_id", sa.Integer(), nullable=True))
        op.create_index(
            "ix_chat_conversations_lead_id",
            "chat_conversations",
            ["lead_id"],
            unique=False,
        )

    # Preserve older contact enquiries in the new lead table so the admin panel
    # does not lose history when switching to the lead model.
    if "contact_messages" in existing:
        op.execute(
            """
            INSERT INTO leads (full_name, email, phone_number, message, read, created_at)
            SELECT name, LOWER(email), '', message, COALESCE(read, FALSE), created_at
            FROM contact_messages cm
            WHERE NOT EXISTS (
                SELECT 1 FROM leads l
                WHERE l.email = LOWER(cm.email)
                  AND l.created_at = cm.created_at
            );
            """
        )


def downgrade() -> None:
    """Remove lead capture tables and the conversation link."""
    columns = {col["name"] for col in inspect(op.get_bind()).get_columns("chat_conversations")}
    if "lead_id" in columns:
        op.drop_index("ix_chat_conversations_lead_id", table_name="chat_conversations")
        op.drop_column("chat_conversations", "lead_id")

    existing = _tables()
    if "lead_sessions" in existing:
        op.drop_index("ix_lead_sessions_token_hash", table_name="lead_sessions")
        op.drop_index("ix_lead_sessions_lead_id", table_name="lead_sessions")
        op.drop_table("lead_sessions")

    if "leads" in existing:
        op.drop_index("ix_leads_created_at", table_name="leads")
        op.drop_index("ix_leads_email", table_name="leads")
        op.drop_table("leads")
