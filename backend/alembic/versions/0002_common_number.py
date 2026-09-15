"""create Common Number table and seed Demo data

Revision ID: 0002_common_number
Revises: 0001_common_phrase
"""

from datetime import datetime

import sqlalchemy as sa
from alembic import op


revision = "0002_common_number"
down_revision = "0001_common_phrase"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "common_numbers",
        sa.Column("id", sa.String(length=120), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("name_normalized", sa.String(length=200), nullable=False),
        sa.Column("number", sa.String(length=200), nullable=False),
        sa.Column("number_normalized", sa.String(length=200), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.CheckConstraint("status IN ('Active', 'Disabled')", name="ck_common_number_status"),
        sa.Column("remark", sa.String(length=2000), nullable=False, server_default=""),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("updated_by", sa.String(length=200), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name_normalized", name="uq_common_number_name"),
        sa.UniqueConstraint("number_normalized", name="uq_common_number_number"),
    )
    op.create_index("ix_common_numbers_status", "common_numbers", ["status"])

    common_numbers = sa.table(
        "common_numbers",
        sa.column("id", sa.String), sa.column("name", sa.String),
        sa.column("name_normalized", sa.String), sa.column("number", sa.String),
        sa.column("number_normalized", sa.String), sa.column("status", sa.String),
        sa.column("remark", sa.String), sa.column("updated_at", sa.DateTime),
        sa.column("updated_by", sa.String),
    )
    seed_time = datetime(2026, 6, 18, 9, 0, 0)
    op.bulk_insert(common_numbers, [
        {"id": "CN001", "name": "VIP Hotline", "name_normalized": "vip hotline", "number": "1500888", "number_normalized": "1500888", "status": "Active", "remark": "Transfer customer to the VIP exclusive service IVR.", "updated_at": seed_time, "updated_by": "1234-Admin"},
        {"id": "CN002", "name": "Lost Card IVR", "name_normalized": "lost card ivr", "number": "1500911", "number_normalized": "1500911", "status": "Active", "remark": "Transfer customer to card loss reporting and emergency blocking.", "updated_at": seed_time, "updated_by": "1234-Admin"},
        {"id": "CN003", "name": "Credit Card Service IVR", "name_normalized": "credit card service ivr", "number": "1500668", "number_normalized": "1500668", "status": "Active", "remark": "Transfer customer to credit card service self-service menu.", "updated_at": seed_time, "updated_by": "1234-Admin"},
        {"id": "CN004", "name": "Branch Appointment IVR", "name_normalized": "branch appointment ivr", "number": "1500776", "number_normalized": "1500776", "status": "Disabled", "remark": "Inactive demo entry for transfer list filtering.", "updated_at": seed_time, "updated_by": "1234-Admin"},
    ])


def downgrade() -> None:
    op.drop_index("ix_common_numbers_status", table_name="common_numbers")
    op.drop_table("common_numbers")
