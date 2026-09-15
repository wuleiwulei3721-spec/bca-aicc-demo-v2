"""create Common Phrase tables and seed Demo data

Revision ID: 0001_common_phrase
Revises:
"""

from datetime import datetime

import sqlalchemy as sa
from alembic import op


revision = "0001_common_phrase"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "common_phrase_categories",
        sa.Column("category_id", sa.String(length=100), nullable=False),
        sa.Column("category_name", sa.String(length=200), nullable=False),
        sa.Column("category_name_normalized", sa.String(length=200), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.PrimaryKeyConstraint("category_id"),
        sa.UniqueConstraint(
            "category_name_normalized", name="uq_common_phrase_category_name"
        ),
    )
    op.create_table(
        "common_phrases",
        sa.Column("phrase_id", sa.String(length=120), nullable=False),
        sa.Column("category_id", sa.String(length=100), nullable=False),
        sa.Column("shortcut_code", sa.String(length=50), nullable=False),
        sa.Column("shortcut_code_normalized", sa.String(length=50), nullable=False),
        sa.Column("phrase_text", sa.String(length=2000), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.CheckConstraint(
            "status IN ('Active', 'Disabled')", name="ck_common_phrase_status"
        ),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("remark", sa.String(length=2000), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("created_by", sa.String(length=200), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("updated_by", sa.String(length=200), nullable=False),
        sa.ForeignKeyConstraint(
            ["category_id"],
            ["common_phrase_categories.category_id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("phrase_id"),
        sa.UniqueConstraint(
            "shortcut_code_normalized", name="uq_common_phrase_shortcut_code"
        ),
    )
    op.create_index(
        "ix_common_phrases_category_id", "common_phrases", ["category_id"]
    )
    op.create_index("ix_common_phrases_status", "common_phrases", ["status"])
    op.create_index("ix_common_phrases_sort_order", "common_phrases", ["sort_order"])

    categories = sa.table(
        "common_phrase_categories",
        sa.column("category_id", sa.String),
        sa.column("category_name", sa.String),
        sa.column("category_name_normalized", sa.String),
        sa.column("sort_order", sa.Integer),
    )
    phrases = sa.table(
        "common_phrases",
        sa.column("phrase_id", sa.String),
        sa.column("category_id", sa.String),
        sa.column("shortcut_code", sa.String),
        sa.column("shortcut_code_normalized", sa.String),
        sa.column("phrase_text", sa.String),
        sa.column("status", sa.String),
        sa.column("sort_order", sa.Integer),
        sa.column("remark", sa.String),
        sa.column("created_at", sa.DateTime),
        sa.column("created_by", sa.String),
        sa.column("updated_at", sa.DateTime),
        sa.column("updated_by", sa.String),
    )
    seed_time = datetime(2026, 6, 18, 9, 0, 0)
    op.bulk_insert(
        categories,
        [
            {
                "category_id": "public-verification",
                "category_name": "Verification",
                "category_name_normalized": "verification",
                "sort_order": 1,
            },
            {
                "category_id": "public-security",
                "category_name": "Security",
                "category_name_normalized": "security",
                "sort_order": 2,
            },
        ],
    )
    op.bulk_insert(
        phrases,
        [
            {
                "phrase_id": "public-ab",
                "category_id": "public-verification",
                "shortcut_code": "ab",
                "shortcut_code_normalized": "ab",
                "phrase_text": "For verification, please confirm your registered mobile number and date of birth.",
                "status": "Active",
                "sort_order": 1,
                "remark": "Use before collecting verification answers.",
                "created_at": seed_time,
                "created_by": "1234-Admin",
                "updated_at": seed_time,
                "updated_by": "1234-Admin",
            },
            {
                "phrase_id": "public-ad",
                "category_id": "public-security",
                "shortcut_code": "ad",
                "shortcut_code_normalized": "ad",
                "phrase_text": "For your security, never share OTP, PIN, CVV, password, or full card number in this chat.",
                "status": "Active",
                "sort_order": 2,
                "remark": "Security reminder for chat conversations.",
                "created_at": seed_time,
                "created_by": "1234-Admin",
                "updated_at": seed_time,
                "updated_by": "1234-Admin",
            },
            {
                "phrase_id": "public-af",
                "category_id": "public-security",
                "shortcut_code": "af",
                "shortcut_code_normalized": "af",
                "phrase_text": "I can help with one more request before we close this conversation.",
                "status": "Active",
                "sort_order": 3,
                "remark": "Conversation closing prompt.",
                "created_at": seed_time,
                "created_by": "1234-Admin",
                "updated_at": seed_time,
                "updated_by": "1234-Admin",
            },
        ],
    )


def downgrade() -> None:
    op.drop_index("ix_common_phrases_sort_order", table_name="common_phrases")
    op.drop_index("ix_common_phrases_status", table_name="common_phrases")
    op.drop_index("ix_common_phrases_category_id", table_name="common_phrases")
    op.drop_table("common_phrases")
    op.drop_table("common_phrase_categories")
