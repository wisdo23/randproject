from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.session import get_session
from ..schemas.game import GameCreate, GameRead
from ..services.games import GameService

router = APIRouter(prefix="/games", tags=["games"])


@router.get("/", response_model=list[GameRead])
async def list_games(session: AsyncSession = Depends(get_session)):
    return await GameService.list_games(session)


@router.post("/", response_model=GameRead, status_code=201)
async def create_game(payload: GameCreate, session: AsyncSession = Depends(get_session)):
    return await GameService.create_game(session, payload)
