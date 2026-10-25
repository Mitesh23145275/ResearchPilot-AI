from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ollama_service import generate_text

router = APIRouter(prefix="/ai", tags=["AI"])


class PromptRequest(BaseModel):
    prompt: str


@router.post("/generate")
async def generate(request: PromptRequest):
    try:
        result = generate_text(request.prompt)
        return {"response": result}
    except Exception as e:
        return {"error": str(e)}