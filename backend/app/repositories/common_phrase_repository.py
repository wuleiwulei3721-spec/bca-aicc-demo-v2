from datetime import datetime
from uuid import uuid4

from sqlalchemy import Select, func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..models import CommonPhrase, CommonPhraseCategory
from ..schemas import (
    CommonPhraseCategoryResponse,
    CommonPhraseCategoryWriteInput,
    CommonPhraseListResponse,
    CommonPhraseMoveInput,
    CommonPhraseResponse,
    CommonPhraseStatus,
    CommonPhraseWriteInput,
    iso_datetime,
)


DEFAULT_AUDIT_ACTOR = "1234-Admin"


class CommonPhraseRepositoryError(Exception):
    def __init__(self, message: str, status_code: int = 400, code: str = "VALIDATION_ERROR"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code


def normalize(value: str) -> str:
    return value.strip().casefold()


def audit_actor(value: str | None) -> str:
    return value.strip() if value and value.strip() else DEFAULT_AUDIT_ACTOR


def new_id(prefix: str) -> str:
    return f"{prefix}-{uuid4()}"


def category_response(category: CommonPhraseCategory) -> CommonPhraseCategoryResponse:
    return CommonPhraseCategoryResponse(
        categoryId=category.category_id,
        categoryName=category.category_name,
        sortOrder=category.sort_order,
    )


def phrase_response(phrase: CommonPhrase) -> CommonPhraseResponse:
    return CommonPhraseResponse(
        categoryId=phrase.category_id,
        phraseId=phrase.phrase_id,
        phraseText=phrase.phrase_text,
        remark=phrase.remark,
        sortOrder=phrase.sort_order,
        shortcutCode=phrase.shortcut_code,
        status=phrase.status,
        createdAt=iso_datetime(phrase.created_at),
        createdBy=phrase.created_by,
        updatedAt=iso_datetime(phrase.updated_at),
        updatedBy=phrase.updated_by,
    )


def get_category(session: Session, category_id: str) -> CommonPhraseCategory:
    category = session.get(CommonPhraseCategory, category_id)

    if category is None:
        raise CommonPhraseRepositoryError("Category was not found.", 404, "NOT_FOUND")

    return category


def get_phrase(session: Session, phrase_id: str) -> CommonPhrase:
    phrase = session.get(CommonPhrase, phrase_id)

    if phrase is None:
        raise CommonPhraseRepositoryError("Common phrase was not found.", 404, "NOT_FOUND")

    return phrase


def commit(session: Session) -> None:
    try:
        session.commit()
    except IntegrityError as error:
        session.rollback()
        message = str(error).lower()

        if "shortcut" in message:
            raise CommonPhraseRepositoryError(
                "Shortcut Code already exists.", 409, "DUPLICATE_SHORTCUT_CODE"
            ) from error

        if "category" in message:
            raise CommonPhraseRepositoryError(
                "Category Name already exists.", 409, "DUPLICATE_CATEGORY_NAME"
            ) from error

        raise


def list_phrases(
    session: Session,
    category_id: str | None = None,
    shortcut_code: str | None = None,
    phrase_text: str | None = None,
    status: CommonPhraseStatus | None = None,
) -> CommonPhraseListResponse:
    phrase_query: Select[tuple[CommonPhrase]] = select(CommonPhrase)

    if category_id:
        phrase_query = phrase_query.where(CommonPhrase.category_id == category_id.strip())
    if shortcut_code:
        phrase_query = phrase_query.where(
            func.lower(CommonPhrase.shortcut_code).contains(normalize(shortcut_code))
        )
    if phrase_text:
        phrase_query = phrase_query.where(
            func.lower(CommonPhrase.phrase_text).contains(normalize(phrase_text))
        )
    if status:
        phrase_query = phrase_query.where(CommonPhrase.status == status.value)

    phrases = session.scalars(
        phrase_query.order_by(CommonPhrase.sort_order.asc(), CommonPhrase.created_at.asc())
    ).all()
    categories = session.scalars(
        select(CommonPhraseCategory).order_by(
            CommonPhraseCategory.sort_order.asc(), CommonPhraseCategory.category_id.asc()
        )
    ).all()
    counts = session.execute(
        select(CommonPhrase.category_id, func.count(CommonPhrase.phrase_id)).group_by(
            CommonPhrase.category_id
        )
    ).all()

    return CommonPhraseListResponse(
        categories=[category_response(category) for category in categories],
        categoryCounts={category_id: count for category_id, count in counts},
        entries=[phrase_response(phrase) for phrase in phrases],
    )


def create_category(session: Session, input_data: CommonPhraseCategoryWriteInput):
    normalized_name = normalize(input_data.category_name)
    duplicate = session.scalar(
        select(CommonPhraseCategory).where(
            CommonPhraseCategory.category_name_normalized == normalized_name
        )
    )

    if duplicate:
        raise CommonPhraseRepositoryError(
            "Category Name already exists.", 409, "DUPLICATE_CATEGORY_NAME"
        )

    next_order = session.scalar(
        select(func.coalesce(func.max(CommonPhraseCategory.sort_order), 0) + 1)
    )
    category = CommonPhraseCategory(
        category_id=new_id("public-category"),
        category_name=input_data.category_name,
        category_name_normalized=normalized_name,
        sort_order=int(next_order or 1),
    )
    session.add(category)
    commit(session)
    return category_response(category)


def rename_category(
    session: Session, category_id: str, input_data: CommonPhraseCategoryWriteInput
):
    category = get_category(session, category_id.strip())
    normalized_name = normalize(input_data.category_name)
    duplicate = session.scalar(
        select(CommonPhraseCategory).where(
            CommonPhraseCategory.category_name_normalized == normalized_name,
            CommonPhraseCategory.category_id != category.category_id,
        )
    )

    if duplicate:
        raise CommonPhraseRepositoryError(
            "Category Name already exists.", 409, "DUPLICATE_CATEGORY_NAME"
        )

    category.category_name = input_data.category_name
    category.category_name_normalized = normalized_name
    commit(session)
    return category_response(category)


def delete_category(session: Session, category_id: str) -> None:
    category = get_category(session, category_id.strip())
    session.delete(category)
    commit(session)


def validate_phrase_input(session: Session, input_data: CommonPhraseWriteInput) -> None:
    get_category(session, input_data.category_id)
    duplicate = session.scalar(
        select(CommonPhrase).where(
            CommonPhrase.shortcut_code_normalized == normalize(input_data.shortcut_code)
        )
    )

    if duplicate:
        raise CommonPhraseRepositoryError(
            "Shortcut Code already exists.", 409, "DUPLICATE_SHORTCUT_CODE"
        )


def create_phrase(session: Session, input_data: CommonPhraseWriteInput):
    validate_phrase_input(session, input_data)
    now = datetime.now()
    next_order = session.scalar(select(func.coalesce(func.max(CommonPhrase.sort_order), 0) + 1))
    phrase = CommonPhrase(
        category_id=input_data.category_id,
        phrase_id=new_id("public-phrase"),
        phrase_text=input_data.phrase_text,
        remark=input_data.remark,
        sort_order=input_data.sort_order if input_data.sort_order is not None else int(next_order or 1),
        shortcut_code=input_data.shortcut_code,
        shortcut_code_normalized=normalize(input_data.shortcut_code),
        status=input_data.status.value,
        created_at=now,
        created_by=audit_actor(input_data.updated_by),
        updated_at=now,
        updated_by=audit_actor(input_data.updated_by),
    )
    session.add(phrase)
    commit(session)
    return phrase_response(phrase)


def update_phrase(session: Session, phrase_id: str, input_data: CommonPhraseWriteInput):
    phrase = get_phrase(session, phrase_id.strip())
    get_category(session, input_data.category_id)
    duplicate = session.scalar(
        select(CommonPhrase).where(
            CommonPhrase.shortcut_code_normalized == normalize(input_data.shortcut_code),
            CommonPhrase.phrase_id != phrase.phrase_id,
        )
    )

    if duplicate:
        raise CommonPhraseRepositoryError(
            "Shortcut Code already exists.", 409, "DUPLICATE_SHORTCUT_CODE"
        )

    phrase.category_id = input_data.category_id
    phrase.phrase_text = input_data.phrase_text
    phrase.remark = input_data.remark
    if input_data.sort_order is not None:
        phrase.sort_order = input_data.sort_order
    phrase.shortcut_code = input_data.shortcut_code
    phrase.shortcut_code_normalized = normalize(input_data.shortcut_code)
    phrase.status = input_data.status.value
    phrase.updated_at = datetime.now()
    phrase.updated_by = audit_actor(input_data.updated_by)
    commit(session)
    return phrase_response(phrase)


def update_status(
    session: Session,
    phrase_id: str,
    status: CommonPhraseStatus,
    updated_by: str | None,
):
    phrase = get_phrase(session, phrase_id.strip())
    phrase.status = status.value
    phrase.updated_at = datetime.now()
    phrase.updated_by = audit_actor(updated_by)
    commit(session)
    return phrase_response(phrase)


def delete_phrase(session: Session, phrase_id: str) -> None:
    phrase = get_phrase(session, phrase_id.strip())
    session.delete(phrase)
    commit(session)


def move_phrases(session: Session, input_data: CommonPhraseMoveInput) -> None:
    get_category(session, input_data.category_id)
    phrase_ids = list(dict.fromkeys(phrase_id.strip() for phrase_id in input_data.phrase_ids if phrase_id.strip()))

    if not phrase_ids:
        raise CommonPhraseRepositoryError("At least one phrase is required.")

    phrases = [get_phrase(session, phrase_id) for phrase_id in phrase_ids]
    now = datetime.now()
    actor = audit_actor(input_data.updated_by)

    for phrase in phrases:
        phrase.category_id = input_data.category_id
        phrase.updated_at = now
        phrase.updated_by = actor

    commit(session)
