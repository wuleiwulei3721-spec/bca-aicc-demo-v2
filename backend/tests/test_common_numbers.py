from datetime import datetime

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.db import Base, get_db
from app.main import app
from app.models import CommonNumber


def test_common_number_api_crud_and_active_filter():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, expire_on_commit=False)
    with session_factory() as session:
        session.add(CommonNumber(
            id="CN001", name="VIP Hotline", name_normalized="vip hotline",
            number="1500888", number_normalized="1500888", status="Active",
            remark="Seed entry", updated_at=datetime(2026, 6, 18, 9, 0, 0), updated_by="1234-Admin",
        ))
        session.commit()

    def override_get_db():
        with session_factory() as session:
            yield session

    app.dependency_overrides[get_db] = override_get_db
    try:
        with TestClient(app) as client:
            assert len(client.get("/api/common-numbers").json()["entries"]) == 1
            created = client.post("/api/common-numbers", json={
                "name": "Service Short Code", "number": "ivr*88", "status": "Active", "remark": "No phone format required.",
            })
            assert created.status_code == 201
            entry_id = created.json()["data"]["id"]
            assert created.json()["data"]["updatedBy"] == "1234-Admin"

            duplicate_name = client.post("/api/common-numbers", json={"name": " service short code ", "number": "another", "status": "Active"})
            assert duplicate_name.status_code == 409
            duplicate_number = client.post("/api/common-numbers", json={"name": "another", "number": " IVR*88 ", "status": "Active"})
            assert duplicate_number.status_code == 409

            disabled = client.patch(f"/api/common-numbers/{entry_id}", json={"name": "Service Short Code", "number": "ivr*88", "status": "Disabled", "updatedBy": "888888-Agent"})
            assert disabled.status_code == 200
            assert disabled.json()["data"]["status"] == "Disabled"
            assert client.get("/api/common-numbers?status=Active").json()["entries"] == [
                client.get("/api/common-numbers?name=VIP").json()["entries"][0]
            ]

            assert client.delete(f"/api/common-numbers/{entry_id}").status_code == 200
    finally:
        app.dependency_overrides.clear()
