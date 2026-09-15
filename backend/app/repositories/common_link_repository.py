from datetime import datetime
from uuid import uuid4

from sqlalchemy import Select, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..models import CommonLink
from ..schemas import (
    CommonLinkListResponse,
    CommonLinkResponse,
    CommonLinkWriteInput,
    iso_datetime,
)
from .common_number_repository import DEFAULT_AUDIT_ACTOR


class CommonLinkRepositoryError(Exception):
    def __init__(self, message: str, status_code: int = 400, code: str = "VALIDATION_ERROR"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code


def normalize(value: str) -> str:
    return value.strip().casefold()


def audit_actor(value: str | None) -> str:
    return value.strip() if value and value.strip() else DEFAULT_AUDIT_ACTOR


def entry_response(entry: CommonLink) -> CommonLinkResponse:
    return CommonLinkResponse(
        id=entry.id,
        remark=entry.remark,
        websiteName=entry.website_name,
        websiteUrl=entry.website_url,
        updatedAt=iso_datetime(entry.updated_at),
        updatedBy=entry.updated_by,
    )


def get_entry(session: Session, entry_id: str) -> CommonLink:
    entry = session.get(CommonLink, entry_id.strip())
    if entry is None:
        raise CommonLinkRepositoryError("Common link was not found.", 404, "NOT_FOUND")
    return entry


def ensure_available(
    session: Session, input_data: CommonLinkWriteInput, entry_id: str | None = None
) -> None:
    normalized_name = normalize(input_data.website_name)
    normalized_url = normalize(input_data.website_url)
    name_query = select(CommonLink).where(
        CommonLink.website_name_normalized == normalized_name
    )
    url_query = select(CommonLink).where(
        CommonLink.website_url_normalized == normalized_url
    )
    if entry_id:
        name_query = name_query.where(CommonLink.id != entry_id)
        url_query = url_query.where(CommonLink.id != entry_id)
    if session.scalar(name_query):
        raise CommonLinkRepositoryError("Website Name already exists.", 409, "DUPLICATE_NAME")
    if session.scalar(url_query):
        raise CommonLinkRepositoryError("Website URL already exists.", 409, "DUPLICATE_URL")


def commit(session: Session) -> None:
    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        message = str(error).lower()
        if "website_name" in message:
            raise CommonLinkRepositoryError("Website Name already exists.", 409, "DUPLICATE_NAME") from error
        if "website_url" in message:
            raise CommonLinkRepositoryError("Website URL already exists.", 409, "DUPLICATE_URL") from error
        raise


def list_common_links(
    session: Session,
    website_name: str | None = None,
    website_url: str | None = None,
) -> CommonLinkListResponse:
    query: Select[tuple[CommonLink]] = select(CommonLink)
    if website_name:
        query = query.where(
            func.lower(CommonLink.website_name).contains(normalize(website_name))
        )
    if website_url:
        query = query.where(
            func.lower(CommonLink.website_url).contains(normalize(website_url))
        )
    entries = session.scalars(
        query.order_by(CommonLink.updated_at.desc(), CommonLink.id.asc())
    ).all()
    return CommonLinkListResponse(entries=[entry_response(entry) for entry in entries])


def create_common_link(session: Session, input_data: CommonLinkWriteInput):
    ensure_available(session, input_data)
    now = datetime.now()
    entry = CommonLink(
        id=f"CL-{uuid4()}",
        website_name=input_data.website_name,
        website_name_normalized=normalize(input_data.website_name),
        website_url=input_data.website_url,
        website_url_normalized=normalize(input_data.website_url),
        remark=input_data.remark,
        updated_at=now,
        updated_by=audit_actor(input_data.updated_by),
    )
    session.add(entry)
    commit(session)
    return entry_response(entry)


def update_common_link(session: Session, entry_id: str, input_data: CommonLinkWriteInput):
    entry = get_entry(session, entry_id)
    ensure_available(session, input_data, entry.id)
    entry.website_name = input_data.website_name
    entry.website_name_normalized = normalize(input_data.website_name)
    entry.website_url = input_data.website_url
    entry.website_url_normalized = normalize(input_data.website_url)
    entry.remark = input_data.remark
    entry.updated_at = datetime.now()
    entry.updated_by = audit_actor(input_data.updated_by)
    commit(session)
    return entry_response(entry)


def delete_common_link(session: Session, entry_id: str) -> None:
    session.delete(get_entry(session, entry_id))
    commit(session)
