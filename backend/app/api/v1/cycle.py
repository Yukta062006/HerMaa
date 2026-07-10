from datetime import datetime
from fastapi import APIRouter, Depends
from ...schemas.cycle import LogCycleRequest, CycleResponse
from ...services.cycle_service import CycleService
from ...core.security import get_current_user

router = APIRouter(prefix="/cycle", tags=["Cycle Tracking"])
_logs = {}


@router.get("/status", response_model=CycleResponse)
async def get_status(user: dict = Depends(get_current_user)):
    last_period = datetime(2026, 6, 26)
    status = CycleService.calculate_phase(last_period, 28)
    return CycleResponse(current_day=status["current_day"], cycle_length=28, phase=status["phase"], next_period=datetime.fromisoformat(status["next_period"]), health_score=78.0)


@router.post("/log")
async def log_data(req: LogCycleRequest, user: dict = Depends(get_current_user)):
    uid = user["user_id"]
    _logs.setdefault(uid, []).append(req.dict())
    return {"message": "Logged successfully", "date": req.date.isoformat()}


@router.get("/predictions")
async def predictions(user: dict = Depends(get_current_user)):
    return {"predictions": [{"next_period_start": "2026-07-24", "next_period_end": "2026-07-29", "ovulation_date": "2026-08-07", "confidence": 0.87}]}


@router.get("/health-score")
async def health_score(user: dict = Depends(get_current_user)):
    return {"overall": 78, "regularity": 92, "symptom_management": 75, "lifestyle": 68}


@router.get("/insights")
async def insights(user: dict = Depends(get_current_user)):
    return {"insights": [
        {"type": "cycle_regularity", "title": "Your cycle is very regular", "description": "Last 6 cycles within 1-2 days of average. 🌸", "score": 92},
        {"type": "symptom_pattern", "title": "Cramping pattern", "description": "You get cramps on days 1-3. Try yoga and heat therapy."},
        {"type": "recommendation", "title": "Hydration", "description": "Increase water during luteal phase to reduce bloating."},
    ]}
