from datetime import datetime, timedelta
from typing import Optional

from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from ..db.session import get_session
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..repositories.managers import ManagerRepository
from ..models.manager import Manager

pwd_ctx = CryptContext(schemes=["pbkdf2_sha256", "bcrypt_sha256", "bcrypt"], deprecated="auto")


class AuthService:
    @staticmethod
    def verify_password(plain: str, hashed: str) -> bool:
        try:
            return pwd_ctx.verify(plain, hashed)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Password invalid") from exc

    @staticmethod
    def get_password_hash(password: str) -> str:
        try:
            return pwd_ctx.hash(password)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="Password too long") from exc

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.jwt_expire_minutes))
        to_encode.update({"exp": expire})
        encoded = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
        return encoded

    @staticmethod
    async def authenticate_manager(session: AsyncSession, email: str, password: str) -> Manager:
        manager = await ManagerRepository.get_by_email(session, email)
        if not manager:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not AuthService.verify_password(password, manager.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return manager


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
optional_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_manager(token: str = Depends(oauth2_scheme), session: AsyncSession = Depends(get_session)) -> Manager:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        manager_id = int(payload.get("sub"))
    except (JWTError, Exception):
        raise credentials_exception
    manager = await ManagerRepository.get(session, manager_id)
    if not manager:
        raise credentials_exception
    return manager


async def get_current_manager_optional(
    token: str | None = Depends(optional_oauth2_scheme),
    session: AsyncSession = Depends(get_session),
) -> Manager | None:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        manager_id = int(payload.get("sub"))
    except (JWTError, Exception):
        return None
    return await ManagerRepository.get(session, manager_id)
