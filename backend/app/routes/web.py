from fastapi import APIRouter
from pydantic import BaseModel

from app.services.web_search_service import web_search

router = APIRouter(
    prefix="/web",
    tags=["Web Research"]
)


class WebRequest(BaseModel):
    topic: str


@router.post("/search")
async def search(request: WebRequest):
    return {
        "summary": web_search(request.topic)
    }