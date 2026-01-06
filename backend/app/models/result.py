from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, DateTime, Text

from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .draw import Draw
    from .manager import Manager
    from .result_approval import ResultApproval


class Result(Base, TimestampMixin):
    __tablename__ = "results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    draw_id: Mapped[int] = mapped_column(ForeignKey("draws.id", ondelete="CASCADE"), index=True)

    # Store as comma-separated or JSON string for simplicity; can normalize later
    winning_numbers: Mapped[str] = mapped_column(String(255))
    machine_numbers: Mapped[str | None] = mapped_column(String(255), nullable=True)
    share_copy: Mapped[str] = mapped_column(Text)
    share_hashtags: Mapped[str | None] = mapped_column(Text, nullable=True)
    share_targets: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending_review", index=True)
    verified: Mapped[bool] = mapped_column(default=False)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    submitted_by_id: Mapped[int | None] = mapped_column(ForeignKey("managers.id", ondelete="SET NULL"), nullable=True)

    draw: Mapped["Draw"] = relationship(back_populates="results")
    submitted_by: Mapped[Manager | None] = relationship("Manager", foreign_keys=[submitted_by_id])
    approvals: Mapped[list["ResultApproval"]] = relationship(
        back_populates="result",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
