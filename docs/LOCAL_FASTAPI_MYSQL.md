# Common Phrase, Common Number, and Common Link Local FastAPI + MySQL

The Demo is the only business-rule source for Common Phrase, Common Number, and Common Link. The local backend is an independent learning environment and does not use the company legacy system, colleague databases, shared development MySQL, CRM, CTI, Redis, production accounts, or production data.

## Architecture

```text
React + TypeScript + Ant Design
        |
        v
FastAPI + SQLAlchemy + Alembic
        |
        v
127.0.0.1:3306 / aicc_demo_local
```

FastAPI + local MySQL is now the default development path. The retained Node + SQLite implementation is legacy rollback code only and is not used by the normal workflow. Vite proxies `/api` to FastAPI at `http://127.0.0.1:8000`.

## Environment

The current machine must have Python 3.11+ and MySQL 8.x. Docker is not required. The backend only accepts a loopback host and database name `aicc_demo_local`.

The repository does not store a password. This machine uses the local MySQL account `aicc_demo_app` through user-level `AICC_MYSQL_*` environment variables; the MySQL root password is only used during local setup when creating the database and account.

## Commands

```powershell
python -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
backend/.venv/Scripts/python.exe backend/scripts/migrate.py
npm run dev
```

The command above starts FastAPI and Vite together:

```powershell
npm run dev
```

Useful checks:

```powershell
npm run backend:test
npm run check:fastapi
npm run db:mysql-schema
```

The migrations create `common_phrase_categories`, `common_phrases`, `common_numbers`, and `common_links`. Common Number owns its Demo fields (ID, Name, Number, Active/Disabled status, Remark, Updated Time, Updated By), trim-plus-lowercase uniqueness for Name and Number, indexes, and seed rows. It does not enforce a phone-number format so IVR short codes remain valid. Common Link owns ID, Website Name, HTTP(S) Website URL, Remark, Updated Time, and Updated By; Website Name and URL are unique after trim-plus-lowercase normalization. Its management page and agent workspace Common Links tab use the same configured source.

## Customer deployment boundary

Vercel remains a static frontend deployment. It does not host this local FastAPI process or MySQL server. Production builds use `VITE_COMMON_PHRASE_MODE=demo`, `VITE_COMMON_NUMBER_MODE=demo`, and `VITE_COMMON_LINK_MODE=demo`, or their production defaults when variables are unset, so customer builds read bundled mock data and never call `127.0.0.1`. Management changes in demo mode are session-only and reset after refresh.
