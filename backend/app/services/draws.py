from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from ..repositories.draws import DrawRepository
from ..models.game import Game
from ..schemas.draw import DrawCreate
from ..models.draw import Draw


class DrawService:
    @staticmethod
    async def list_draws(session: AsyncSession) -> list[Draw]:
        return await DrawRepository.list(session)

    @staticmethod
    async def create_draw(session: AsyncSession, payload: DrawCreate) -> Draw:
        game = await session.get(Game, payload.game_id)
        if not game:
            raise HTTPException(status_code=404, detail="Game not found")
        draw = await DrawRepository.create(session, payload.game_id, payload.draw_datetime)
        await session.commit()
        return draw
