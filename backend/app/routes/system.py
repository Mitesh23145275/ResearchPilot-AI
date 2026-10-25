import asyncio
import requests

from fastapi import APIRouter
from app.config import OLLAMA_BASE_URL, OLLAMA_MODEL, EMBEDDING_MODEL

router = APIRouter(
    prefix="/system",
    tags=["System"],
)


@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "backend": "running",
    }


@router.get("/config")
async def get_config():
    return {
        "ollama_base_url": OLLAMA_BASE_URL,
        "ollama_model": OLLAMA_MODEL,
        "embedding_model": EMBEDDING_MODEL,
    }


@router.get("/ollama-status")
async def ollama_status():
    def check():
        try:
            response = requests.get(
                f"{OLLAMA_BASE_URL}/api/tags",
                timeout=3,
            )

            if response.status_code == 200:
                data = response.json()

                return {
                    "ollama_running": True,
                    "models": [
                        model["name"]
                        for model in data.get("models", [])
                    ],
                }

        except requests.RequestException:
            pass

        return {
            "ollama_running": False,
            "models": [],
        }

    result = await asyncio.to_thread(check)

    return {
        "url": OLLAMA_BASE_URL,
        **result,
    }

from pydantic import BaseModel
import app.config as config

class ModelUpdate(BaseModel):
    model: str

@router.post("/set-model")
async def set_model(data: ModelUpdate):
    config.OLLAMA_MODEL = data.model

    return {
        "message": "Model updated.",
        "model": data.model,
    }