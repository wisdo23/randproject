from typing import TYPE_CHECKING

from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, ForeignKey, String, Text

from .base import Base, TimestampMixin

if TYPE_CHECKING:
    from .result import Result
    from .manager import Manager

if TYPE_CHECKING:
    from .result import Result
    from .manager import Manager


class ResultApproval(Base, TimestampMixin):
    __tablename__ = "result_approvals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    result_id: Mapped[int] = mapped_column(ForeignKey("results.id", ondelete="CASCADE"), index=True)
    manager_id: Mapped[int] = mapped_column(ForeignKey("managers.id", ondelete="CASCADE"), index=True)
    decision: Mapped[str] = mapped_column(String(20))
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

    result: Mapped["Result"] = relationship("Result", back_populates="approvals")
    manager: Mapped["Manager"] = relationship("Manager")
