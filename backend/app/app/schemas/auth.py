from pydantic import BaseModel
from typing import Optional


class LoginRequest(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    phone: Optional[str] = None
    otp: Optional[str] = None
    firebase_token: Optional[str] = None
    provider: str = "email"


class RegisterRequest(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    language: str = "en"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str


class OTPRequest(BaseModel):
    phone: str


class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str
