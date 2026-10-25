from fastapi import APIRouter
from pathlib import Path
import requests

from app.config import (
    PAPERS_DIR,
    REPORT_CACHE_DIR,
    OLLAMA_BASE_URL,
)

router = APIRouter(
    prefix="/stats",
    tags=["Dashboard"],
)


@router.get("/")
def dashboard_stats():
    paper_count = len(list(PAPERS_DIR.glob("*.pdf")))
    report_count = len(list(REPORT_CACHE_DIR.glob("*.json")))

    try:
        response = requests.get(
            f"{OLLAMA_BASE_URL}/api/tags",
            timeout=2,
        )
        ollama = response.status_code == 200
    except:
        ollama = False

    return {
        "papers": paper_count,
        "reports": report_count,
        "ollama": ollama,
    }