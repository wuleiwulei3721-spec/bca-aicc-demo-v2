from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


class CommonPhraseCategory(Base):
    __tablename__ = "common_phrase_categories"
    __table_args__ = (
        UniqueConstraint("category_name_normalized", name="uq_common_phrase_category_name"),
    )

    category_id: Mapped[str] = mapped_column(String(100), primary_key=True)
    category_name: Mapped[str] = mapped_column(String(200), nullable=False)
    category_name_normalized: Mapped[str] = mapped_column(String(200), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    phrases: Mapped[list["CommonPhrase"]] = relationship(
        back_populates="category",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class CommonPhrase(Base):
    __tablename__ = "common_phrases"
    __table_args__ = (
        UniqueConstraint("shortcut_code_normalized", name="uq_common_phrase_shortcut_code"),
        CheckConstraint(
            "status IN ('Active', 'Disabled')", name="ck_common_phrase_status"
        ),
        Index("ix_common_phrases_category_id", "category_id"),
        Index("ix_common_phrases_status", "status"),
        Index("ix_common_phrases_sort_order", "sort_order"),
    )

    phrase_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    category_id: Mapped[str] = mapped_column(
        String(100),
        ForeignKey("common_phrase_categories.category_id", ondelete="CASCADE"),
        nullable=False,
    )
    shortcut_code: Mapped[str] = mapped_column(String(50), nullable=False)
    shortcut_code_normalized: Mapped[str] = mapped_column(String(50), nullable=False)
    phrase_text: Mapped[str] = mapped_column(String(2000), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    remark: Mapped[str] = mapped_column(String(2000), nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    created_by: Mapped[str] = mapped_column(String(200), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    updated_by: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[CommonPhraseCategory] = relationship(back_populates="phrases")


class CommonNumber(Base):
    __tablename__ = "common_numbers"
    __table_args__ = (
        UniqueConstraint("name_normalized", name="uq_common_number_name"),
        UniqueConstraint("number_normalized", name="uq_common_number_number"),
        CheckConstraint(
            "status IN ('Active', 'Disabled')", name="ck_common_number_status"
        ),
        Index("ix_common_numbers_status", "status"),
    )

    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    name_normalized: Mapped[str] = mapped_column(String(200), nullable=False)
    number: Mapped[str] = mapped_column(String(200), nullable=False)
    number_normalized: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    remark: Mapped[str] = mapped_column(String(2000), nullable=False, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    updated_by: Mapped[str] = mapped_column(String(200), nullable=False)


class CommonLink(Base):
    __tablename__ = "common_links"
    __table_args__ = (
        UniqueConstraint("website_name_normalized", name="uq_common_link_website_name"),
        UniqueConstraint("website_url_normalized", name="uq_common_link_website_url"),
        Index("ix_common_links_updated_at", "updated_at"),
    )

    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    website_name: Mapped[str] = mapped_column(String(200), nullable=False)
    website_name_normalized: Mapped[str] = mapped_column(String(200), nullable=False)
    website_url: Mapped[str] = mapped_column(String(200), nullable=False)
    website_url_normalized: Mapped[str] = mapped_column(String(200), nullable=False)
    remark: Mapped[str] = mapped_column(String(2000), nullable=False, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    updated_by: Mapped[str] = mapped_column(String(200), nullable=False)
