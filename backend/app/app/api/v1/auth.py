from fastapi import APIRouter, HTTPException, status
from ...schemas.auth import LoginRequest, RegisterRequest, TokenResponse, OTPRequest, OTPVerifyRequest
from ...core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest):
    user_id = f"user_{req.name.lower().replace(' ', '_')}"
    token = create_access_token(data={"sub": user_id, "email": req.email or "", "name": req.name})
    return TokenResponse(access_token=token, user_id=user_id, name=req.name)


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    if req.provider == "google" and req.firebase_token:
        user_id, name = "google_user", "Ananya"
    elif req.provider == "email" and req.email:
        user_id, name = f"user_{req.email.split('@')[0]}", "Ananya"
    elif req.provider == "phone" and req.phone and req.otp:
        user_id, name = f"user_{req.phone[-4:]}", "Ananya"
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    token = create_access_token(data={"sub": user_id, "email": req.email or "", "name": name})
    return TokenResponse(access_token=token, user_id=user_id, name=name)


@router.post("/send-otp")
async def send_otp(req: OTPRequest):
    return {"message": "OTP sent", "phone": req.phone}


@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(req: OTPVerifyRequest):
    if req.otp == "123456":
        user_id = f"user_{req.phone[-4:]}"
        token = create_access_token(data={"sub": user_id, "phone": req.phone, "name": "Ananya"})
        return TokenResponse(access_token=token, user_id=user_id, name="Ananya")
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")
