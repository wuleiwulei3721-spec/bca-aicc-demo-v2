from datetime import datetime
from enum import StrEnum
from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CommonPhraseStatus(StrEnum):
    ACTIVE = "Active"
    DISABLED = "Disabled"


class CommonPhraseCategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    category_id: str = Field(alias="categoryId")
    category_name: str = Field(alias="categoryName")
    sort_order: int = Field(alias="sortOrder")


class CommonPhraseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    category_id: str = Field(alias="categoryId")
    phrase_id: str = Field(alias="phraseId")
    phrase_text: str = Field(alias="phraseText")
    remark: str
    sort_order: int = Field(alias="sortOrder")
    shortcut_code: str = Field(alias="shortcutCode")
    status: CommonPhraseStatus
    created_at: str = Field(alias="createdAt")
    created_by: str = Field(alias="createdBy")
    updated_at: str = Field(alias="updatedAt")
    updated_by: str = Field(alias="updatedBy")


class CommonPhraseListResponse(BaseModel):
    categories: list[CommonPhraseCategoryResponse]
    category_counts: dict[str, int] = Field(alias="categoryCounts")
    entries: list[CommonPhraseResponse]


class CommonPhraseWriteInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    category_id: str = Field(alias="categoryId", min_length=1, max_length=100)
    phrase_text: str = Field(alias="phraseText", min_length=1, max_length=2000)
    remark: str = Field(default="", max_length=2000)
    sort_order: int | None = Field(default=None, alias="sortOrder", ge=0)
    shortcut_code: str = Field(alias="shortcutCode", min_length=1, max_length=50)
    status: CommonPhraseStatus
    updated_by: str | None = Field(default=None, alias="updatedBy", max_length=200)

    @field_validator("category_id", "phrase_text", "shortcut_code")
    @classmethod
    def require_non_empty(cls, value: str) -> str:
        if not value:
            raise ValueError("value is required")
        return value


class CommonPhraseCategoryWriteInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    category_name: str = Field(alias="categoryName", min_length=1, max_length=200)


class CommonPhraseMoveInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    category_id: str = Field(alias="categoryId", min_length=1, max_length=100)
    phrase_ids: list[str] = Field(alias="phraseIds", min_length=1)
    updated_by: str | None = Field(default=None, alias="updatedBy", max_length=200)


class CommonPhraseStatusInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    status: CommonPhraseStatus
    updated_by: str | None = Field(default=None, alias="updatedBy", max_length=200)


class CommonPhraseErrorResponse(BaseModel):
    code: str
    message: str


class CommonNumberResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    name: str
    number: str
    remark: str
    status: CommonPhraseStatus
    updated_at: str = Field(alias="updatedAt")
    updated_by: str = Field(alias="updatedBy")


class CommonNumberListResponse(BaseModel):
    entries: list[CommonNumberResponse]


class CommonNumberWriteInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=200)
    number: str = Field(min_length=1, max_length=200)
    remark: str = Field(default="", max_length=2000)
    status: CommonPhraseStatus
    updated_by: str | None = Field(default=None, alias="updatedBy", max_length=200)

    @field_validator("name", "number")
    @classmethod
    def require_non_empty(cls, value: str) -> str:
        if not value:
            raise ValueError("value is required")
        return value


class CommonLinkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    remark: str
    website_name: str = Field(alias="websiteName")
    website_url: str = Field(alias="websiteUrl")
    updated_at: str = Field(alias="updatedAt")
    updated_by: str = Field(alias="updatedBy")


class CommonLinkListResponse(BaseModel):
    entries: list[CommonLinkResponse]


class CommonLinkWriteInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True, str_strip_whitespace=True)

    website_name: str = Field(alias="websiteName", min_length=1, max_length=200)
    website_url: str = Field(alias="websiteUrl", min_length=1, max_length=200)
    remark: str = Field(default="", max_length=2000)
    updated_by: str | None = Field(default=None, alias="updatedBy", max_length=200)

    @field_validator("website_name", "website_url")
    @classmethod
    def require_non_empty(cls, value: str) -> str:
        if not value:
            raise ValueError("value is required")
        return value

    @field_validator("website_url")
    @classmethod
    def require_http_url(cls, value: str) -> str:
        parsed = urlparse(value)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("Website URL must start with http:// or https://.")
        return value


def iso_datetime(value: datetime) -> str:
    return value.isoformat(timespec="seconds")
