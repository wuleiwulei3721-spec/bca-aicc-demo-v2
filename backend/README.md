# Common Phrase FastAPI backend

This backend is an independent local learning environment for the Common Phrase module.
It uses FastAPI, SQLAlchemy, Alembic, and a MySQL database named `aicc_demo_local`.
It does not connect to company servers, shared development databases, CTI, CRM, Redis, or production data.

## Prerequisites

- Python 3.11 or later
- MySQL 8.x running on `127.0.0.1:3306`

Docker is not required. The database bootstrap creates only `aicc_demo_local` on the local MySQL instance.

## Setup

From the repository root:

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
backend/.venv/Scripts/python.exe backend/scripts/migrate.py
```

The local connection is configured through user-level `AICC_MYSQL_*` environment variables. The current setup uses a least-privilege demo account on the local server:

- host: `127.0.0.1`
- port: `3306`
- user: `aicc_demo_app`
- password: stored only in the local user environment; never commit it
- database: `aicc_demo_local`

Set `AICC_MYSQL_USER`, `AICC_MYSQL_PASSWORD`, or the other `AICC_MYSQL_*` variables when the local MySQL installation uses different credentials. The migration bootstrap needs permission to create `aicc_demo_local`; after that, the application account only needs access to that database. `AICC_DATABASE_URL` is also supported, but it is rejected unless it points to the loopback host and database `aicc_demo_local`.

## Run

Run the FastAPI backend directly:

```powershell
backend/.venv/Scripts/python.exe backend/run.py
```

It applies pending Alembic migrations, then listens on `http://127.0.0.1:8000`.
FastAPI's local documentation is available at `http://127.0.0.1:8000/docs`.

Run the React frontend with FastAPI + local MySQL by default:

```powershell
npm run dev
```

The local frontend uses `http://127.0.0.1:8000` through the Vite `/api` proxy. The retained Node + SQLite implementation is legacy rollback code and is not part of the normal development workflow.

For a customer/static build, use the mock-data switch:

```powershell
$env:VITE_COMMON_PHRASE_MODE = 'demo'
npm run build
```

If a legacy rollback is explicitly required, it remains available with:

```powershell
$env:VITE_COMMON_PHRASE_BACKEND = 'node'
npm run dev
```

## Model ownership

The Demo defines the business model. The first migration creates:

- `common_phrase_categories`: category name and persistent sort order.
- `common_phrases`: shortcut code (50), phrase text (2000), category, Active/Disabled status, persistent sort order, remark, and create/update audit fields.

The migration seed mirrors the current frontend Demo data. Future schema changes should be added as new Alembic revisions rather than editing an applied revision.
