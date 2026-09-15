"""create Common Link table and seed Demo data

Revision ID: 0003_common_link
Revises: 0002_common_number
"""

from datetime import datetime

import sqlalchemy as sa
from alembic import op


revision = "0003_common_link"
down_revision = "0002_common_number"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "common_links",
        sa.Column("id", sa.String(length=120), nullable=False),
        sa.Column("website_name", sa.String(length=200), nullable=False),
        sa.Column("website_name_normalized", sa.String(length=200), nullable=False),
        sa.Column("website_url", sa.String(length=200), nullable=False),
        sa.Column("website_url_normalized", sa.String(length=200), nullable=False),
        sa.Column("remark", sa.String(length=2000), nullable=False, server_default=""),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("updated_by", sa.String(length=200), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("website_name_normalized", name="uq_common_link_website_name"),
        sa.UniqueConstraint("website_url_normalized", name="uq_common_link_website_url"),
    )
    op.create_index("ix_common_links_updated_at", "common_links", ["updated_at"])

    common_links = sa.table(
        "common_links",
        sa.column("id", sa.String), sa.column("website_name", sa.String),
        sa.column("website_name_normalized", sa.String), sa.column("website_url", sa.String),
        sa.column("website_url_normalized", sa.String), sa.column("remark", sa.String),
        sa.column("updated_at", sa.DateTime), sa.column("updated_by", sa.String),
    )
    seed_time = datetime(2026, 6, 18, 9, 10, 0)
    op.bulk_insert(common_links, [
        {"id": "CL001", "website_name": "BANK 1 Official Website", "website_name_normalized": "bank 1 official website", "website_url": "https://www.bank1.example", "website_url_normalized": "https://www.bank1.example", "remark": "Official BANK 1 homepage for general customer reference.", "updated_at": seed_time, "updated_by": "1234-Admin"},
        {"id": "CL002", "website_name": "BANK 1 Help Center", "website_name_normalized": "bank 1 help center", "website_url": "https://help.bank1.example", "website_url_normalized": "https://help.bank1.example", "remark": "Customer support and product FAQ reference.", "updated_at": datetime(2026, 6, 18, 9, 12, 0), "updated_by": "1234-Admin"},
        {"id": "CL003", "website_name": "Security Awareness Center", "website_name_normalized": "security awareness center", "website_url": "https://security.bank1.example", "website_url_normalized": "https://security.bank1.example", "remark": "Security education page for fraud prevention guidance.", "updated_at": datetime(2026, 6, 18, 9, 15, 0), "updated_by": "1234-Admin"},
    ])


def downgrade() -> None:
    op.drop_index("ix_common_links_updated_at", table_name="common_links")
    op.drop_table("common_links")
