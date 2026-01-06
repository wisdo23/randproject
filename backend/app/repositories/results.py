from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from ..models.result import Result
from ..models.draw import Draw


class ResultRepository:
    @staticmethod
    async def list(session: AsyncSession) -> list[Result]:
        res = await session.execute(
            select(Result)
            .options(
                selectinload(Result.approvals),
                selectinload(Result.draw).selectinload(Draw.game),
            )
            .order_by(Result.created_at.desc())
        )
        return res.scalars().all()

    @staticmethod
    async def create(
        *,
        session: AsyncSession,
        draw_id: int,
        winning_numbers: str,
        machine_numbers: str | None,
        share_copy: str,
        share_hashtags: str | None,
        share_targets: str | None,
        submitted_by_id: int | None,
    ) -> Result:
        result = Result(
            draw_id=draw_id,
            winning_numbers=winning_numbers,
            machine_numbers=machine_numbers,
            share_copy=share_copy,
            share_hashtags=share_hashtags,
            share_targets=share_targets,
            submitted_by_id=submitted_by_id,
        )
        session.add(result)
        await session.flush()
        return await ResultRepository.get(session, result.id)

    @staticmethod
    async def get(session: AsyncSession, result_id: int) -> Result | None:
        res = await session.execute(
            select(Result)
            .options(
                selectinload(Result.approvals),
                selectinload(Result.draw).selectinload(Draw.game),
            )
            .where(Result.id == result_id)
        )
        return res.scalars().first()
