from fastapi import APIRouter, Depends
from ...schemas.ai import ChatRequest, ChatResponse
from ...services.ai_service import ai_service
from ...core.security import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, user: dict = Depends(get_current_user)):
    result = await ai_service.chat(user["user_id"], req.message, req.language, req.context)
    return ChatResponse(**result)


@router.post("/reset-chat")
async def reset(user: dict = Depends(get_current_user)):
    ai_service.reset(user["user_id"])
    return {"message": "Chat cleared"}


@router.get("/suggested-questions")
async def suggestions(user: dict = Depends(get_current_user)):
    return {"questions": [
        "Why is my period late?", "PCOS symptoms?", "Best period foods?",
        "Manage cramps naturally?", "Hormonal balance tips", "Period hygiene tips",
        "Stress and cycles?", "Exercise during periods?",
    ]}
