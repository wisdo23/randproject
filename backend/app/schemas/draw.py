from pydantic import BaseModel, field_validator
from datetime import datetime


class DrawCreate(BaseModel):
    game_id: int
    draw_datetime: datetime
    
    @field_validator('draw_datetime', mode='before')
    @classmethod
    def parse_datetime(cls, v):
        if isinstance(v, str):
            dt = datetime.fromisoformat(v.replace('Z', '+00:00'))
            return dt.replace(tzinfo=None)
        elif isinstance(v, datetime):
            return v.replace(tzinfo=None) if v.tzinfo else v
        return v


class DrawRead(BaseModel):
    id: int
    game_id: int
    draw_datetime: datetime

    class Config:
        from_attributes = True
