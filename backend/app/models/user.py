from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    uid: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    language: str = "en"
    cycle_length: int = 28
    period_length: int = 5
    last_period_date: Optional[datetime] = None
    health_conditions: List[str] = []
    blood_group: Optional[str] = None
    emergency_contacts: List[dict] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CycleLog(BaseModel):
    uid: str
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
