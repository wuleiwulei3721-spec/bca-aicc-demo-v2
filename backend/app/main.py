from fastapi import Depends, FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .api import router
from .db import get_db
from .repositories.common_phrase_repository import CommonPhraseRepositoryError
from .repositories.common_number_repository import CommonNumberRepositoryError
from .repositories.common_link_repository import CommonLinkRepositoryError
from .settings import settings


app = FastAPI(
    title="BANK 1 AICC Common Phrase API",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
)
app.include_router(router, prefix="/api")


def error_response(code: str, message: str, status_code: int):
    return JSONResponse(
        status_code=status_code,
        content={"error": {"code": code, "message": message}},
    )


@app.exception_handler(CommonPhraseRepositoryError)
async def repository_error_handler(
    _request: Request, error: CommonPhraseRepositoryError
):
    return error_response(error.code, error.message, error.status_code)


@app.exception_handler(CommonNumberRepositoryError)
async def common_number_repository_error_handler(
    _request: Request, error: CommonNumberRepositoryError
):
    return error_response(error.code, error.message, error.status_code)


@app.exception_handler(CommonLinkRepositoryError)
async def common_link_repository_error_handler(
    _request: Request, error: CommonLinkRepositoryError
):
    return error_response(error.code, error.message, error.status_code)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_request: Request, error: RequestValidationError):
    first_error = error.errors()[0] if error.errors() else {}
    message = str(first_error.get("msg", "Request validation failed."))
    return error_response("VALIDATION_ERROR", message, 422)


@app.exception_handler(IntegrityError)
async def integrity_error_handler(_request: Request, _error: IntegrityError):
    return error_response("CONFLICT", "The Common Phrase value already exists.", 409)


@app.get("/api/health")
def health(database: Session = Depends(get_db)):
    database.execute(text("SELECT 1"))
    return {
        "status": "ok",
        "database": settings.mysql_database,
        "backend": "fastapi",
    }
