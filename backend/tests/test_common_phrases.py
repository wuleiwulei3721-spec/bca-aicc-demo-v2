from datetime import datetime

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db import Base, get_db
from app.main import app
from app.models import CommonPhrase, CommonPhraseCategory


def create_test_session() -> sessionmaker[Session]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def enable_sqlite_foreign_keys(dbapi_connection, _connection_record):
        dbapi_connection.execute("PRAGMA foreign_keys=ON")

    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, expire_on_commit=False)

    with session_factory() as session:
        verification = CommonPhraseCategory(
            category_id="public-verification",
            category_name="Verification",
            category_name_normalized="verification",
            sort_order=1,
        )
        security = CommonPhraseCategory(
            category_id="public-security",
            category_name="Security",
            category_name_normalized="security",
            sort_order=2,
        )
        session.add_all([verification, security])
        seed_time = datetime(2026, 6, 18, 9, 0, 0)
        session.add_all(
            [
                CommonPhrase(
                    category_id="public-verification",
                    phrase_id="public-ab",
                    shortcut_code="ab",
                    shortcut_code_normalized="ab",
                    phrase_text="Verify your registered number.",
                    status="Active",
                    sort_order=1,
                    remark="Verification prompt",
                    created_at=seed_time,
                    created_by="1234-Admin",
                    updated_at=seed_time,
                    updated_by="1234-Admin",
                ),
                CommonPhrase(
                    category_id="public-security",
                    phrase_id="public-ad",
                    shortcut_code="ad",
                    shortcut_code_normalized="ad",
                    phrase_text="Never share your OTP.",
                    status="Active",
                    sort_order=2,
                    remark="Security prompt",
                    created_at=seed_time,
                    created_by="1234-Admin",
                    updated_at=seed_time,
                    updated_by="1234-Admin",
                ),
            ]
        )
        session.commit()

    return session_factory


def test_common_phrase_api_crud_and_active_filter():
    session_factory = create_test_session()

    def override_get_db():
        with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as client:
            initial = client.get("/api/common-phrases")
            assert initial.status_code == 200
            assert len(initial.json()["entries"]) == 2

            created = client.post(
                "/api/common-phrases",
                json={
                    "categoryId": "public-verification",
                    "shortcutCode": "new-code",
                    "phraseText": "A newly created phrase.",
                    "remark": "Created by the API test.",
                    "status": "Active",
                },
            )
            assert created.status_code == 201
            phrase_id = created.json()["data"]["phraseId"]
            assert created.json()["data"]["createdBy"] == "1234-Admin"

            duplicate = client.post(
                "/api/common-phrases",
                json={
                    "categoryId": "public-verification",
                    "shortcutCode": "NEW-CODE",
                    "phraseText": "Duplicate.",
                    "status": "Active",
                },
            )
            assert duplicate.status_code == 409

            disabled = client.patch(
                f"/api/common-phrases/{phrase_id}/status",
                json={"status": "Disabled", "updatedBy": "888888-Agent"},
            )
            assert disabled.status_code == 200
            assert disabled.json()["data"]["status"] == "Disabled"

            active = client.get("/api/common-phrases?status=Active&shortcutCode=new")
            assert active.status_code == 200
            assert active.json()["entries"] == []

            deleted_category = client.delete(
                "/api/common-phrase-categories?id=public-verification"
            )
            assert deleted_category.status_code == 200
            assert client.get("/api/common-phrases").json()["entries"] == [
                {
                    "categoryId": "public-security",
                    "phraseId": "public-ad",
                    "phraseText": "Never share your OTP.",
                    "remark": "Security prompt",
                    "sortOrder": 2,
                    "shortcutCode": "ad",
                    "status": "Active",
                    "createdAt": "2026-06-18T09:00:00",
                    "createdBy": "1234-Admin",
                    "updatedAt": "2026-06-18T09:00:00",
                    "updatedBy": "1234-Admin",
                }
            ]
    finally:
        app.dependency_overrides.clear()
