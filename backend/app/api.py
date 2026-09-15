from fastapi import APIRouter, Body, Depends, Query
from sqlalchemy.orm import Session

from .db import get_db
from .repositories.common_phrase_repository import (
    create_category,
    create_phrase,
    delete_category,
    delete_phrase,
    list_phrases,
    move_phrases,
    rename_category,
    update_phrase,
    update_status,
)
from .repositories.common_number_repository import (
    create_common_number,
    delete_common_number,
    list_common_numbers,
    update_common_number,
)
from .repositories.common_link_repository import (
    create_common_link,
    delete_common_link,
    list_common_links,
    update_common_link,
)
from .schemas import (
    CommonLinkListResponse,
    CommonLinkWriteInput,
    CommonNumberListResponse,
    CommonNumberWriteInput,
    CommonPhraseCategoryWriteInput,
    CommonPhraseListResponse,
    CommonPhraseMoveInput,
    CommonPhraseStatus,
    CommonPhraseStatusInput,
    CommonPhraseWriteInput,
)


router = APIRouter()


@router.get("/common-phrases", response_model=CommonPhraseListResponse)
def get_common_phrases(
    category_id: str | None = Query(default=None, alias="categoryId"),
    shortcut_code: str | None = Query(default=None, alias="shortcutCode"),
    phrase_text: str | None = Query(default=None, alias="phraseText"),
    status: CommonPhraseStatus | None = None,
    database: Session = Depends(get_db),
):
    return list_phrases(database, category_id, shortcut_code, phrase_text, status)


@router.post("/common-phrase-categories", response_model=dict, status_code=201)
def post_category(
    input_data: CommonPhraseCategoryWriteInput, database: Session = Depends(get_db)
):
    return {"data": create_category(database, input_data)}


@router.patch("/common-phrase-categories", response_model=dict)
def patch_category(
    id: str = Query(min_length=1),
    input_data: CommonPhraseCategoryWriteInput = Body(...),
    database: Session = Depends(get_db),
):
    return {"data": rename_category(database, id, input_data)}


@router.delete("/common-phrase-categories", response_model=dict)
def remove_category(id: str = Query(min_length=1), database: Session = Depends(get_db)):
    delete_category(database, id)
    return {"data": None}


@router.post("/common-phrases", response_model=dict, status_code=201)
def post_phrase(
    input_data: CommonPhraseWriteInput, database: Session = Depends(get_db)
):
    return {"data": create_phrase(database, input_data)}


@router.patch("/common-phrases/{phrase_id}", response_model=dict)
def patch_phrase(
    phrase_id: str,
    input_data: CommonPhraseWriteInput,
    database: Session = Depends(get_db),
):
    return {"data": update_phrase(database, phrase_id, input_data)}


@router.patch("/common-phrases/{phrase_id}/status", response_model=dict)
def patch_phrase_status(
    phrase_id: str,
    input_data: CommonPhraseStatusInput,
    database: Session = Depends(get_db),
):
    return {
        "data": update_status(
            database, phrase_id, input_data.status, input_data.updated_by
        )
    }


@router.delete("/common-phrases/{phrase_id}", response_model=dict)
def remove_phrase(phrase_id: str, database: Session = Depends(get_db)):
    delete_phrase(database, phrase_id)
    return {"data": None}


@router.post("/common-phrases/move", response_model=dict)
def post_move(
    input_data: CommonPhraseMoveInput, database: Session = Depends(get_db)
):
    move_phrases(database, input_data)
    return {"data": None}


@router.get("/common-numbers", response_model=CommonNumberListResponse)
def get_common_numbers(
    name: str | None = None,
    number: str | None = None,
    status: CommonPhraseStatus | None = None,
    database: Session = Depends(get_db),
):
    return list_common_numbers(database, name, number, status)


@router.post("/common-numbers", response_model=dict, status_code=201)
def post_common_number(
    input_data: CommonNumberWriteInput, database: Session = Depends(get_db)
):
    return {"data": create_common_number(database, input_data)}


@router.patch("/common-numbers/{entry_id}", response_model=dict)
def patch_common_number(
    entry_id: str,
    input_data: CommonNumberWriteInput,
    database: Session = Depends(get_db),
):
    return {"data": update_common_number(database, entry_id, input_data)}


@router.delete("/common-numbers/{entry_id}", response_model=dict)
def remove_common_number(entry_id: str, database: Session = Depends(get_db)):
    delete_common_number(database, entry_id)
    return {"data": None}


@router.get("/common-links", response_model=CommonLinkListResponse)
def get_common_links(
    website_name: str | None = Query(default=None, alias="websiteName"),
    website_url: str | None = Query(default=None, alias="websiteUrl"),
    database: Session = Depends(get_db),
):
    return list_common_links(database, website_name, website_url)


@router.post("/common-links", response_model=dict, status_code=201)
def post_common_link(
    input_data: CommonLinkWriteInput, database: Session = Depends(get_db)
):
    return {"data": create_common_link(database, input_data)}


@router.patch("/common-links/{entry_id}", response_model=dict)
def patch_common_link(
    entry_id: str,
    input_data: CommonLinkWriteInput,
    database: Session = Depends(get_db),
):
    return {"data": update_common_link(database, entry_id, input_data)}


@router.delete("/common-links/{entry_id}", response_model=dict)
def remove_common_link(entry_id: str, database: Session = Depends(get_db)):
    delete_common_link(database, entry_id)
    return {"data": None}
