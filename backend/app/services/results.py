from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from ..repositories.results import ResultRepository
from ..repositories.result_approvals import ResultApprovalRepository
from ..models.draw import Draw
from ..models.game import Game
from ..models.result import Result
from ..models.manager import Manager
from ..schemas.result import ResultCreate, ResultVerify


class ResultService:
    @staticmethod
    async def list_results(session: AsyncSession) -> list[Result]:
        return await ResultRepository.list(session)

    @staticmethod
    async def create_result(session: AsyncSession, payload: ResultCreate, manager: Manager) -> Result:
        draw = await session.get(Draw, payload.draw_id)
        if not draw:
            raise HTTPException(status_code=404, detail="Draw not found")
        winning_list = ResultService._as_list(payload.winning_numbers)
        machine_list = ResultService._as_list(payload.machine_numbers)
        if not winning_list:
            raise HTTPException(status_code=400, detail="At least one winning number is required")
        if any(not item.isdigit() for item in winning_list):
            raise HTTPException(status_code=400, detail="Winning numbers must be digits")
        if any(not item.isdigit() for item in machine_list):
            raise HTTPException(status_code=400, detail="Machine numbers must be digits")
        all_numbers = winning_list + machine_list
        if len(set(all_numbers)) != len(all_numbers):
            raise HTTPException(status_code=400, detail="Each winning and machine number must be unique across both lists.")

        game = await session.get(Game, draw.game_id)
        share_copy = payload.share_copy or ResultService._build_share_copy(
            game=game,
            draw_datetime=draw.draw_datetime,
            winning_numbers=winning_list,
            machine_numbers=machine_list,
        )
        default_targets = ["facebook", "instagram", "twitter", "whatsapp", "telegram"]
        share_hashtags = ResultService._as_comma_string(payload.share_hashtags) or "RandLottery"
        share_targets = ResultService._as_comma_string(payload.share_targets) or ",".join(default_targets)

        result = await ResultRepository.create(
            session=session,
            draw_id=payload.draw_id,
            winning_numbers=ResultService._numbers_to_string(winning_list),
            machine_numbers=ResultService._numbers_to_string(machine_list) or None,
            share_copy=share_copy,
            share_hashtags=share_hashtags,
            share_targets=share_targets,
            submitted_by_id=manager.id if manager else None,
        )
        await session.commit()
        return await ResultRepository.get(session, result.id)

    @staticmethod
    async def verify_result(session: AsyncSession, result_id: int, payload: ResultVerify, manager: Manager) -> Result:
        result = await ResultRepository.get(session, result_id)
        if not result:
            raise HTTPException(status_code=404, detail="Result not found")
        decision = payload.decision.lower()
        if decision not in {"approved", "rejected"}:
            raise HTTPException(status_code=400, detail="Decision must be 'approved' or 'rejected'")

        await ResultApprovalRepository.create(
            session=session,
            result_id=result_id,
            manager_id=manager.id,
            decision=decision,
            note=payload.note,
        )

        if decision == "approved":
            result.verified = True
            result.status = "approved"
            result.verified_at = datetime.utcnow()
        else:
            result.verified = False
            result.status = "changes_requested"
            result.verified_at = None
        await session.commit()
        return await ResultRepository.get(session, result.id)

    @staticmethod
    def _numbers_to_string(values: list[str | int]) -> str:
        return ",".join(str(item) for item in values)

    @staticmethod
    def _as_list(values):
        if values is None:
            return []
        if isinstance(values, str):
            values = [values]
        return [str(item).strip() for item in values if str(item).strip()]

    @staticmethod
    def _as_comma_string(values) -> str | None:
        items = ResultService._as_list(values)
        return ",".join(items) or None

    @staticmethod
    def _build_share_copy(*, game: Game | None, draw_datetime, winning_numbers: list[str], machine_numbers: list[str]) -> str:
        game_name = game.name if game else "Rand Lottery"
        draw_date = draw_datetime.strftime("%Y-%m-%d") if isinstance(draw_datetime, datetime) else str(draw_datetime)
        draw_time = draw_datetime.strftime("%H:%M") if isinstance(draw_datetime, datetime) else ""
        lines = [
            f"Rand Lottery {game_name} Results",
            f"Draw: {draw_date} {draw_time}".strip(),
            f"Winning Numbers: {', '.join(winning_numbers)}",
        ]
        if machine_numbers:
            lines.append(f"Machine Numbers: {', '.join(machine_numbers)}")
        return "\n".join(lines)
