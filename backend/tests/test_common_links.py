from datetime import datetime

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db import Base, get_db
from app.main import app
from app.models import CommonLink


def test_common_link_api_crud_and_query_filters():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, expire_on_commit=False)
    with session_factory() as session:
        session.add(CommonLink(
            id="CL001", website_name="BANK 1 Official Website",
            website_name_normalized="bank 1 official website",
            website_url="https://www.bank1.example",
            website_url_normalized="https://www.bank1.example", remark="Seed entry",
            updated_at=datetime(2026, 6, 18, 9, 10, 0), updated_by="1234-Admin",
        ))
        session.commit()

    def override_get_db():
        with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    try:
        with TestClient(app) as client:
            assert len(client.get("/api/common-links?websiteName=Official").json()["entries"]) == 1
            created = client.post("/api/common-links", json={
                "websiteName": "BANK 1 Help Center",
                "websiteUrl": "https://help.bank1.example",
                "remark": "Customer support reference.",
            })
            assert created.status_code == 201
            entry_id = created.json()["data"]["id"]
            assert created.json()["data"]["updatedBy"] == "1234-Admin"

            duplicate_name = client.post("/api/common-links", json={"websiteName": " bank 1 help center ", "websiteUrl": "https://another.bank1.example"})
            assert duplicate_name.status_code == 409
            duplicate_url = client.post("/api/common-links", json={"websiteName": "Another", "websiteUrl": " HTTPS://HELP.BANK1.EXAMPLE "})
            assert duplicate_url.status_code == 409
            invalid_url = client.post("/api/common-links", json={"websiteName": "Invalid", "websiteUrl": "ftp://bank1.example"})
            assert invalid_url.status_code == 422

            updated = client.patch(f"/api/common-links/{entry_id}", json={
                "websiteName": "BANK 1 Help Center",
                "websiteUrl": "https://help.bank1.example",
                "remark": "Updated reference.",
                "updatedBy": "888888-Agent",
            })
            assert updated.status_code == 200
            assert updated.json()["data"]["updatedBy"] == "888888-Agent"
            assert len(client.get("/api/common-links?websiteUrl=help.bank1").json()["entries"]) == 1

            assert client.delete(f"/api/common-links/{entry_id}").status_code == 200
    finally:
        app.dependency_overrides.clear()
