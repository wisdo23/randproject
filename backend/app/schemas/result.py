from datetime import datetime
from typing import Optional, Sequence

from pydantic import BaseModel, field_validator


def _split_comma_string(value: str | None) -> list[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


class ResultCreate(BaseModel):
    draw_id: int
    winning_numbers: Sequence[int] | str
    machine_numbers: Optional[Sequence[int] | str] = None
    share_copy: Optional[str] = None
    share_hashtags: Optional[Sequence[str]] = None
    share_targets: Optional[Sequence[str]] = None

    @field_validator("winning_numbers", "machine_numbers", mode="before")
    @classmethod
    def ensure_sequence(cls, value):
        if value is None:
            return value
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

    @field_validator("share_hashtags", "share_targets", mode="before")
    @classmethod
    def normalize_sequences(cls, value):
        if value is None:
            return value
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


class ResultApprovalRead(BaseModel):
    id: int
    manager_id: int
    decision: str
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ResultGameRead(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class ResultDrawRead(BaseModel):
    id: int
    draw_datetime: datetime
    game_id: int
    game: ResultGameRead

    class Config:
        from_attributes = True


class ResultVerify(BaseModel):
    decision: str
    note: Optional[str] = None


class ResultRead(BaseModel):
    id: int
    draw_id: int
    winning_numbers: str
    machine_numbers: Optional[str] = None
    share_copy: str
    share_hashtags: list[str]
    share_targets: list[str]
    status: str
    verified: bool
    verified_at: Optional[datetime]
    submitted_by_id: Optional[int]
    approvals: list[ResultApprovalRead]
    draw: ResultDrawRead
    created_at: datetime

    @field_validator("share_hashtags", "share_targets", mode="before")
    @classmethod
    def split_fields(cls, value):
        if isinstance(value, (list, tuple)):
            return list(value)
        return _split_comma_string(value)

    class Config:
        from_attributes = True
