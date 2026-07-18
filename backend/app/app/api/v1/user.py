from fastapi import APIRouter, Depends
from ...core.security import get_current_user

router = APIRouter(prefix="/user", tags=["User Profile"])


@router.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    return {
        "uid": user["user_id"], "name": "Ananya Sharma", "email": "ananya@email.com",
        "phone": "+91 98XXX XXXXX", "age": 20, "language": "en", "cycle_length": 28,
        "blood_group": "B+", "health_conditions": ["PCOS (mild)"], "allergies": [],
        "emergency_contacts": [
            {"name": "Mom", "phone": "+91 98XXX XXXXX", "relation": "Mother"},
            {"name": "Sister", "phone": "+91 97XXX XXXXX", "relation": "Sister"},
        ],
    }


@router.put("/profile")
async def update_profile(data: dict, user: dict = Depends(get_current_user)):
    return {"message": "Profile updated"}


@router.put("/language")
async def update_language(language: str, user: dict = Depends(get_current_user)):
    return {"message": f"Language set to {language}"}
