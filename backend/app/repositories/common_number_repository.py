from datetime import datetime
from uuid import uuid4

from sqlalchemy import Select, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..models import CommonNumber
from ..schemas import (
    CommonNumberListResponse,
    CommonNumberResponse,
    CommonNumberWriteInput,
    CommonPhraseStatus,
    iso_datetime,
)


DEFAULT_AUDIT_ACTOR = "1234-Admin"


class CommonNumberRepositoryError(Exception):
    def __init__(self, message: str, status_code: int = 400, code: str = "VALIDATION_ERROR"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code


def normalize(value: str) -> str:
    return value.strip().casefold()


def audit_actor(value: str | None) -> str:
    return value.strip() if value and value.strip() else DEFAULT_AUDIT_ACTOR


def entry_response(entry: CommonNumber) -> CommonNumberResponse:
    return CommonNumberResponse(
        id=entry.id,
        name=entry.name,
        number=entry.number,
        remark=entry.remark,
        status=entry.status,
        updatedAt=iso_datetime(entry.updated_at),
        updatedBy=entry.updated_by,
    )


def get_entry(session: Session, entry_id: str) -> CommonNumber:
    entry = session.get(CommonNumber, entry_id.strip())
    if entry is None:
        raise CommonNumberRepositoryError("Common number was not found.", 404, "NOT_FOUND")
    return entry


def ensure_available(
    session: Session, input_data: CommonNumberWriteInput, entry_id: str | None = None
) -> None:
    normalized_name = normalize(input_data.name)
    normalized_number = normalize(input_data.number)
    name_query = select(CommonNumber).where(CommonNumber.name_normalized == normalized_name)
    number_query = select(CommonNumber).where(CommonNumber.number_normalized == normalized_number)
    if entry_id:
        name_query = name_query.where(CommonNumber.id != entry_id)
        number_query = number_query.where(CommonNumber.id != entry_id)
    if session.scalar(name_query):
        raise CommonNumberRepositoryError("Name already exists.", 409, "DUPLICATE_NAME")
    if session.scalar(number_query):
        raise CommonNumberRepositoryError("Number already exists.", 409, "DUPLICATE_NUMBER")


def commit(session: Session) -> None:
    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        message = str(error).lower()
        if "name" in message:
            raise CommonNumberRepositoryError("Name already exists.", 409, "DUPLICATE_NAME") from error
        if "number" in message:
            raise CommonNumberRepositoryError("Number already exists.", 409, "DUPLICATE_NUMBER") from error
        raise


def list_common_numbers(
    session: Session,
    name: str | None = None,
    number: str | None = None,
    status: CommonPhraseStatus | None = None,
) -> CommonNumberListResponse:
    query: Select[tuple[CommonNumber]] = select(CommonNumber)
    if name:
        query = query.where(func.lower(CommonNumber.name).contains(normalize(name)))
    if number:
        query = query.where(func.lower(CommonNumber.number).contains(normalize(number)))
    if status:
        query = query.where(CommonNumber.status == status.value)
    entries = session.scalars(query.order_by(CommonNumber.updated_at.desc(), CommonNumber.id.asc())).all()
    return CommonNumberListResponse(entries=[entry_response(entry) for entry in entries])


def create_common_number(session: Session, input_data: CommonNumberWriteInput):
    ensure_available(session, input_data)
    now = datetime.now()
    entry = CommonNumber(
        id=f"CN-{uuid4()}",
        name=input_data.name,
        name_normalized=normalize(input_data.name),
        number=input_data.number,
        number_normalized=normalize(input_data.number),
        remark=input_data.remark,
        status=input_data.status.value,
        updated_at=now,
        updated_by=audit_actor(input_data.updated_by),
    )
    session.add(entry)
    commit(session)
    return entry_response(entry)


def update_common_number(session: Session, entry_id: str, input_data: CommonNumberWriteInput):
    entry = get_entry(session, entry_id)
    ensure_available(session, input_data, entry.id)
    entry.name = input_data.name
    entry.name_normalized = normalize(input_data.name)
    entry.number = input_data.number
    entry.number_normalized = normalize(input_data.number)
    entry.remark = input_data.remark
    entry.status = input_data.status.value
    entry.updated_at = datetime.now()
    entry.updated_by = audit_actor(input_data.updated_by)
    commit(session)
    return entry_response(entry)


def delete_common_number(session: Session, entry_id: str) -> None:
    session.delete(get_entry(session, entry_id))
    commit(session)
