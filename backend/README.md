# Rand Lottery API

FastAPI backend for managing games, draws, and results, designed with a clean architecture style (routers → services → repositories → models) and Postgres persistence.

## Quick Start

### Prerequisites
- Docker + Docker Compose

### Run (Docker)
```bash
cd backend
docker compose up --build
```
Then open http://localhost:8000/docs for Swagger UI.

### Local (no Docker)
```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\\Scripts\\Activate.ps1
pip install fastapi "uvicorn[standard]" pydantic pydantic-settings "SQLAlchemy>=2" asyncpg alembic "psycopg[binary]" python-multipart httpx
copy .env.example .env
# Update DATABASE_URL to your local Postgres
uvicorn app.main:app --reload --port 8000
```

## Project Structure
- app/
  - api/           (HTTP routers only)
  - services/      (application/use-case logic)
  - repositories/  (data access; no business logic)
  - models/        (ORM models)
  - schemas/       (Pydantic DTOs)
  - core/          (config)
  - db/            (session/engine)

## Notes
- Tables auto-create on startup in development.
- Add Alembic migrations for production deployments.
- CORS is configured for Vite dev at port 8080/5173.

## Google Sign-In Configuration

The `/auth/google` endpoint verifies Google Identity Services ID tokens. To enable it:

1. In the [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an OAuth 2.0 **Web application** client ID.
  - Authorized JavaScript origins: include your frontend URLs (e.g. `http://localhost:8080`, `http://localhost:5173`).
  - Authorized redirect URIs: you can leave blank when using Google Identity Services one-tap / button (no redirect).
2. Copy the generated Client ID and set it in `backend/.env`:

  ```env
  GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
  ```

3. Mirror the same value in the frontend `.env` (see frontend section below) and restart both services so the new env vars load.
4. Rebuild the backend container if needed to ensure the `google-auth` dependency is installed (`docker compose up --build`).

When `GOOGLE_CLIENT_ID` is empty the endpoint will return HTTP 500 to indicate Google login is disabled.
