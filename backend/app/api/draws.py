from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.session import get_session
from ..schemas.draw import DrawCreate, DrawRead
from ..services.draws import DrawService

router = APIRouter(prefix="/draws", tags=["draws"])


@router.get("/", response_model=list[DrawRead])
async def list_draws(session: AsyncSession = Depends(get_session)):
    return await DrawService.list_draws(session)


@router.post("/", response_model=DrawRead, status_code=201)
async def create_draw(payload: DrawCreate, session: AsyncSession = Depends(get_session)):
    return await DrawService.create_draw(session, payload)
