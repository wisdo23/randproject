from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..models.manager import Manager


class ManagerRepository:
    @staticmethod
    async def get_by_email(session: AsyncSession, email: str) -> Manager | None:
        res = await session.execute(select(Manager).where(Manager.email == email))
        return res.scalars().first()

    @staticmethod
    async def create(session: AsyncSession, email: str, hashed_password: str, phone: str | None = None) -> Manager:
        manager = Manager(email=email, hashed_password=hashed_password, phone=phone)
        session.add(manager)
        await session.flush()
        await session.refresh(manager)
        return manager

    @staticmethod
    async def get(session: AsyncSession, manager_id: int) -> Manager | None:
        return await session.get(Manager, manager_id)

    @staticmethod
    async def list_active(session: AsyncSession) -> list[Manager]:
        res = await session.execute(select(Manager).where(Manager.is_active.is_(True)))
        return list(res.scalars().all())
