from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chat_service import ask_question

router = APIRouter(
    prefix="/chat",
    tags=["RAG Chat"]
)

class ChatRequest(BaseModel):
    question: str
    mode: str = "all"
    document_id: str | None = None

@router.post("/ask")
async def chat(request: ChatRequest):
    return ask_question(
        question=request.question,
        mode=request.mode,
        document_id=request.document_id,
    )