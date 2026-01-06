from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey, Boolean
from datetime import datetime
from .base import Base, TimestampMixin
from typing import List


class Draw(Base, TimestampMixin):
    __tablename__ = "draws"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    game_id: Mapped[int] = mapped_column(ForeignKey("games.id", ondelete="CASCADE"), index=True)
    draw_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=False))
    notified: Mapped[bool] = mapped_column(Boolean, default=False)

    game: Mapped["Game"] = relationship(back_populates="draws")
    results: Mapped[List["Result"]] = relationship(
        back_populates="draw", cascade="all, delete-orphan", lazy="selectin"
    )
