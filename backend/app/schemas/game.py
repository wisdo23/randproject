from pydantic import BaseModel
from typing import Optional


class GameCreate(BaseModel):
    name: str
    description: Optional[str] = None


class GameRead(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True
