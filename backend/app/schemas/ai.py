from pydantic import BaseModel
from typing import Optional, List


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    response: str
    suggestions: List[str] = []
    language: str = "en"
