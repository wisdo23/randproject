# Rand Lottery Results Management System

Presented to: Rand Lottery Limited

Bedriften Consulting — Project Description

## Project Overview

The Rand Lottery Social Media Post Feature is a secure, mobile-first web application purpose-built for Rand Lottery administrators. It streamlines the capture of official draw results, enforces accuracy with double verification, and automatically generates branded visual cards that can be published to official social channels with a single action. The system delivers consistent branding, rapid turnaround, and a full historical audit trail across games and draws.

## Key Objectives

- Ensure accuracy through enforced double-verification of draw results
- Maintain consistent Rand branding (logo, palette, layout) across every published card
- Enable fast, error-free distribution to multiple social platforms from one interface
- Provide an auditable history of all results, approvals, and published assets
- Prioritize administrator-only access, security hardening, and performance

## Core Capabilities

### Game and Draw Management
- Create and manage the catalog of lottery games
- Schedule draws with precise date and time controls

### Result Capture and Verification
- Capture winning numbers and machine numbers for each draw
- Enforce confirmation via dual entry or approval workflow before publication

### Branded Result Card Generation
- Produce social-ready artwork featuring Rand branding, draw context, and highlighted numbers
- Optimize output for visibility across major social feeds

### One-Click Social Publishing
- Post approved cards directly to Facebook, X (Twitter), Instagram, Snapchat, WhatsApp Status, and Telegram
- Support downloadable assets for offline use where required

### Results History and Audit
- Browse past draws with rich filtering by game, date range, and verification status
- Maintain a transparent audit trail across submissions, approvals, and posts

### Design and Technical Standards
- Mobile-first responsive interface with intuitive controls
- Secure authentication for administrators only
- High-performance architecture with reliable third-party integrations

## Deliverable Summary

A fully functional, secure web application enabling Rand Lottery to manage draws, verify results, generate branded cards, and publish instantly to all supported social platforms within a 22-day delivery window (Dec 2025 – Jan 2026). The platform ensures timely, accurate, and visually consistent announcements that enhance transparency and player engagement.

## Project Structure

```
Rand Lottery/
├── frontend/                 # React + TypeScript frontend
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components (Dashboard, GamesPage, etc.)
│   │   ├── lib/             # Utilities (api client, helpers)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript type definitions
│   │   ├── data/            # Mock data
│   │   ├── main.tsx         # Entry point
│   │   ├── App.tsx          # Root component
│   │   ├── index.css        # Global styles
│   │   └── App.css          # App styles
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration (with /api proxy)
│   ├── tsconfig.json        # TypeScript config
│   ├── tailwind.config.ts   # Tailwind CSS config
│   └── index.html           # HTML entry point
│
├── backend/                 # FastAPI + PostgreSQL backend
│   ├── app/
│   │   ├── api/             # HTTP routers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── schemas/         # Pydantic validation schemas
│   │   ├── core/            # Configuration
│   │   ├── db/              # Database setup
│   │   ├── main.py          # FastAPI app
│   │   └── seed_games.py    # Database seeding script
│   ├── docker-compose.yml   # Container orchestration
│   ├── Dockerfile           # FastAPI container image
│   ├── pyproject.toml       # Python dependencies
│   ├── .env                 # Environment variables
│   └── README.md            # Backend setup guide
│
└── README.md               # This file
```

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Lucide Icons** - Icon library

### Backend
- **FastAPI** - Python web framework
- **Python 3.12** - Runtime
- **PostgreSQL 16** - Database
- **SQLAlchemy 2.0+** - ORM
- **Pydantic v2** - Data validation
- **uvicorn** - ASGI server
- **Docker & Docker Compose** - Containerization

## Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Docker & Docker Compose (for backend)
- Or Python 3.12 + PostgreSQL 16 (for local backend)

### Running Both Services

#### Option 1: Using Docker (Recommended)

```bash
# Start backend (postgres + FastAPI)
cd backend
docker compose up -d

# In a new terminal, start frontend dev server
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:8080`
API docs will be at `http://localhost:8000/docs`

#### Option 2: Local Development

**Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r pyproject.toml

# Set up PostgreSQL (ensure running)
# Update .env with your database credentials

# Run migrations (if using Alembic)
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Games
- `GET /api/games` - List all games
- `POST /api/games` - Create new game

### Draws
- `GET /api/draws` - List all draws
- `POST /api/draws` - Create new draw for a game

### Results
- `GET /api/results` - List all results
- `POST /api/results` - Create new result
- `PATCH /api/results/{id}/verify` - Mark result as verified

**API Documentation:** Visit `http://localhost:8000/docs` for interactive Swagger UI

## Scope

- Create and manage games and their draws
- Capture and double-verify draw results (winning numbers and machine numbers)
- Generate branded result cards featuring Rand logo, game context, and highlighted numbers
- Post approved results directly to Facebook, X (Twitter), Instagram, Snapchat, WhatsApp Status, and Telegram
- Provide results history with advanced filtering and auditing
- Deliver a clean, responsive, mobile-first UI with secure and performant services

## Deliverables

1. Fully designed and developed secure web application to manage lottery games and draw schedules
2. Capture and double-verify lottery results
3. Generate branded result cards
4. Publish approved results directly to Rand Lottery’s social media channels

## Implementation Plan

| Phase | Activity                                  | Delivery Date     | Duration |
|------:|-------------------------------------------|-------------------|----------|
| 1     | Requirement Gathering                      | 19 Dec 2025       | 2 Days   |
| 2     | Website Design and Wireframing             | 23 Dec 2025       | 1 Day    |
| 3     | Website Development                        | 29 Dec 2025       | 4 Days   |
| 4     | 1st Development Review Meeting             | 30 Dec 2025       | 6 Days   |
| 5     | Payment and Notification Integration       | 05 Jan 2026       | 1 Day    |
| 6     | 2nd Development Review Meeting             | 06 Jan 2026       | 6 Days   |
| 7     | Testing                                    | 08 Jan 2026       | 1 Day    |
| 8     | Final Demo & Approval                      | 09 Jan 2026       | 2 Days   |
|       | Total Duration (Calendar Days)             |                   | 22 Days  |

Days means Calendar Days (Monday – Sunday).

## Games Catalog

### National Games

- Shutoff Time (10:00am): VAG MONDAY, VAG TUESDAY, VAG WEDNESDAY, VAG THURSDAY, VAG FRIDAY, VAG SATURDAY
- Shutoff Time (1:30pm): MONDAY NOONRUSH, TUESDAY NOONRUSH, WEDNESDAY NOONRUSH, THURSDAY NOONRUSH, FRIDAY NOONRUSH, SATURDAY NOONRUSH
- Shutoff Time (7:15pm): MONDAY SPECIAL, LUCKY TUESDAY, MID-WEEK, FORTUNE THURSDAY, FRIDAY BONANZA, NATIONAL, ASEDA

### Rand Lottery Games

- Shutoff Time (6:50am): BINGO4, GOLDEN SOUVENIR, CASH4LIFE, ENDOWMENT LOTTO, SIKA KESE, SAMEDI SOIR, STAR LOTTO

These are seeded via `backend/app/seed_games.py` and available from `GET /api/games`.

## Result Cards & Social Posting

- The frontend generates branded result cards using Tailwind and assets in `frontend/src/assets/` (e.g., `rand-logo.png`).
- Cards include Rand logo, game name, draw date/time, winning numbers, and machine numbers.
- Users can download cards as images and use one-click share buttons for:
   - Facebook, X (Twitter), Instagram, Telegram, WhatsApp Status, Snapchat
- For platform-native posting via official accounts, configure server-side OAuth/Access Tokens and use platform APIs. The current build supports client-side share intents and downloadable cards; server-side posting can be enabled by adding token-backed endpoints.

## Features

- **Games Management** - Add and manage lottery games
- **Draw Management** - Schedule and track lottery draws
- **Results Verification** - Double-verification workflow for results
- **Branded Card Generation** - Produce social-ready artwork from verified results
- **Results History** - Browse past results with filtering
- **Social Share** - One-click share to common platforms; download card image
- **Clean Architecture** - Services → Repositories → Models pattern
- **Type-Safe** - Full TypeScript frontend and Pydantic validation backend
- **Docker Ready** - Production-ready containerization
- **Responsive UI** - Mobile-friendly interface with Tailwind CSS

## Database Schema

**Games**
- `id` (UUID, primary key)
- `name` (string, unique)
- `description` (string)
- `created_at`, `updated_at` (timestamps)

**Draws**
- `id` (UUID, primary key)
- `game_id` (FK → Games)
- `draw_datetime` (datetime)
- `created_at`, `updated_at` (timestamps)

**Results**
- `id` (UUID, primary key)
- `draw_id` (FK → Draws)
- `winning_numbers` (array of integers)
- `machine_numbers` (array of integers)
- `verified` (boolean)
- `created_at`, `updated_at` (timestamps)

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run lint     # Check code quality
npm run preview  # Preview production build
```

### Backend Development
```bash
cd backend
# With Docker
docker compose up -d
docker compose logs -f api

# Local
python -m app.seed_games      # Seed database with games
uvicorn app.main:app --reload
```

## Environment Variables

### Frontend
No configuration needed - API proxy is configured in `vite.config.ts` to forward `/api` calls to backend.

### Backend (backend/.env)
```env
# Database
DATABASE_URL=postgresql+asyncpg://rand:randpass@postgres:5432/rand_lottery
POSTGRES_USER=rand
POSTGRES_PASSWORD=randpass
POSTGRES_DB=rand_lottery

# CORS (comma-separated or JSON array)
CORS_ORIGINS=http://localhost:5173,http://localhost:8080,http://localhost:4173
```

### Google Sign-In

The app supports Google one-tap / button login for managers. Configure it by:

1. Creating a **Web application** OAuth client in Google Cloud Console and adding your frontend origins (e.g. `http://localhost:8080`, `http://localhost:5173`).
2. Setting the client ID in both env files:
   - `backend/.env`: `GOOGLE_CLIENT_ID=...`
   - `frontend/.env`: `VITE_GOOGLE_CLIENT_ID=...`
3. Restarting the backend container (`docker compose restart api`) and the frontend dev server so the new values load.

If either variable is missing the Google button stays hidden and the backend endpoint is disabled.

## Deployment

### Render Deployment (Recommended)

1. **Create two services on Render:**
   - Frontend: Deploy `frontend/` folder as Static Site
   - Backend: Deploy `backend/` folder as Web Service with PostgreSQL

2. **Frontend:**
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Environment: Node

3. **Backend:**
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port 8080`
   - Add PostgreSQL addon
   - Set environment variables with database credentials

4. **Update Frontend API URL:**
   Update `src/lib/api.ts` to point to production backend URL

## Common Issues

### CORS Errors
- Ensure backend `CORS_ORIGINS` includes your frontend URL
- Check that API proxy in `vite.config.ts` is configured correctly

### Database Connection
- Verify PostgreSQL is running
- Check `DATABASE_URL` format and credentials
- Ensure database exists: `createdb rand_lottery`

### Port Conflicts
- Frontend default: 8080 (change in `frontend/vite.config.ts`)
- Backend default: 8000 (change uvicorn command)
- Database default: 5432 (change in `docker-compose.yml`)

## Next Steps

- [ ] Add authentication (JWT)
- [ ] Add social media sharing endpoints
   - Server-side posting with OAuth tokens for official accounts
- [ ] Implement pagination for results
- [ ] Add caching layer (Redis)
- [ ] Database migrations with Alembic
- [ ] Email notifications for draws
- [ ] Admin dashboard
- [ ] Result export (CSV/PDF)

## Contributing

1. Create a feature branch
2. Make changes (both frontend and backend as needed)
3. Test thoroughly
4. Submit pull request

## License

Proprietary - Rand Lottery Limited

## Support

For issues or questions, contact the development team at Bedriften Consulting.
