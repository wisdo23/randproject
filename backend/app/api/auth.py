import logging
import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from google.oauth2 import id_token
from google.auth.transport import requests

from ..db.session import get_session
from ..schemas.auth import ManagerCreate, ManagerLogin, Token, GoogleAuthRequest
from ..services.auth import AuthService
from ..repositories.managers import ManagerRepository
from ..core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])
logger = logging.getLogger(__name__)


@router.post("/signup", response_model=Token)
async def signup(payload: ManagerCreate, session: AsyncSession = Depends(get_session)):
    existing = await ManagerRepository.get_by_email(session, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = AuthService.get_password_hash(payload.password)
    manager = await ManagerRepository.create(session, payload.email, hashed, payload.phone)
    await session.commit()
    token = AuthService.create_access_token({"sub": str(manager.id), "email": manager.email, "picture": None})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=Token)
async def login(payload: ManagerLogin, session: AsyncSession = Depends(get_session)):
    manager = await AuthService.authenticate_manager(session, payload.email, payload.password)
    token = AuthService.create_access_token({"sub": str(manager.id), "email": manager.email, "picture": None})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/google", response_model=Token)
async def google_auth(payload: GoogleAuthRequest, session: AsyncSession = Depends(get_session)):
    if not settings.google_client_id:
        raise HTTPException(status_code=500, detail="Google login not configured")
    try:
        id_info = id_token.verify_oauth2_token(
            payload.id_token,
            requests.Request(),
            settings.google_client_id,
            clock_skew_in_seconds=60,
        )
    except ValueError as exc:
        logger.warning("Google token validation failed: %s", exc)
        raise HTTPException(status_code=401, detail="Invalid Google token") from exc

    email = id_info.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account missing email")
    if not id_info.get("email_verified", False):
        raise HTTPException(status_code=403, detail="Google email not verified")

    manager = await ManagerRepository.get_by_email(session, email)
    if not manager:
        random_secret = secrets.token_urlsafe(32)
        hashed = AuthService.get_password_hash(random_secret)
        manager = await ManagerRepository.create(session, email, hashed)
        await session.commit()

    token_payload = {
        "sub": str(manager.id),
        "email": manager.email,
        "picture": id_info.get("picture"),
    }
    token = AuthService.create_access_token(token_payload)
    return {"access_token": token, "token_type": "bearer"}
