from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class LogCycleRequest(BaseModel):
    date: datetime
    flow: Optional[str] = None
    mood: Optional[str] = None
    symptoms: List[str] = []
    pain_level: Optional[int] = None
    energy_level: Optional[int] = None
    sleep_hours: Optional[float] = None
    water_intake: Optional[int] = None
    weight: Optional[float] = None
    exercise_minutes: Optional[int] = None
    notes: Optional[str] = None


class CycleResponse(BaseModel):
    current_day: int
    cycle_length: int
    phase: str
    next_period: Optional[datetime] = None
    health_score: Optional[float] = None
