from fastapi import APIRouter
import asyncio

from app.services.rag_service import build_knowledge_base

router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge Base"],
)


@router.post("/build")
async def build():
    """
    Build the ChromaDB knowledge base without blocking FastAPI.
    """
    return await asyncio.to_thread(build_knowledge_base)