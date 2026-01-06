from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import games, draws, results, social, auth
from .models import Base
from .db.session import engine
from .services.draw_notifier import start_notifier_task
import asyncio

app = FastAPI(title=settings.app_name)

# Parse CORS origins
cors_origins = settings.get_cors_origins()
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    # For quick start in dev only: create tables if not exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    # start background notifier
    loop = asyncio.get_event_loop()
    start_notifier_task(loop)


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(games.router, prefix="/api")
app.include_router(draws.router, prefix="/api")
app.include_router(results.router, prefix="/api")
app.include_router(social.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
