from sqlalchemy.ext.asyncio import AsyncSession

from ..models.result_approval import ResultApproval


class ResultApprovalRepository:
    @staticmethod
    async def create(
        *,
        session: AsyncSession,
        result_id: int,
        manager_id: int,
        decision: str,
        note: str | None,
    ) -> ResultApproval:
        approval = ResultApproval(
            result_id=result_id,
            manager_id=manager_id,
            decision=decision,
            note=note,
        )
        session.add(approval)
        await session.flush()
        await session.refresh(approval)
        return approval
