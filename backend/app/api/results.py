from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.session import get_session
from ..schemas.result import ResultCreate, ResultVerify, ResultRead
from ..services.results import ResultService
from ..services.auth import get_current_manager, get_current_manager_optional

router = APIRouter(prefix="/results", tags=["results"])


@router.get("/", response_model=list[ResultRead])
async def list_results(session: AsyncSession = Depends(get_session)):
    return await ResultService.list_results(session)


@router.post("/", response_model=ResultRead, status_code=201)
async def create_result(
    payload: ResultCreate,
    session: AsyncSession = Depends(get_session),
    current_manager=Depends(get_current_manager_optional),
):
    return await ResultService.create_result(session, payload, current_manager)


@router.patch("/{result_id}/verify", response_model=ResultRead)
async def verify_result(
    result_id: int,
    payload: ResultVerify,
    session: AsyncSession = Depends(get_session),
    current_manager=Depends(get_current_manager),
):
    return await ResultService.verify_result(session, result_id, payload, current_manager)
