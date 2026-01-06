from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.draw import Draw


class DrawRepository:
    @staticmethod
    async def list(session: AsyncSession) -> list[Draw]:
        res = await session.execute(select(Draw))
        return res.scalars().all()

    @staticmethod
    async def create(session: AsyncSession, game_id: int, draw_datetime) -> Draw:
        draw = Draw(game_id=game_id, draw_datetime=draw_datetime)
        session.add(draw)
        await session.flush()
        await session.refresh(draw)
        return draw
