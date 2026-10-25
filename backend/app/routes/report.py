from fastapi import APIRouter
from pydantic import BaseModel

from app.agents import writer_agent, critique_agent
from app.services.cache_service import (
    make_cache_key,
    load_cache,
    save_cache,
)
from app.config import REPORT_CACHE_DIR
from app.websocket.events import send_event

router = APIRouter(
    prefix="/report",
    tags=["Report Generation"],
)


class ReportRequest(BaseModel):
    topic: str
    research: str


@router.post("/generate")
async def generate_report(request: ReportRequest):

    key = make_cache_key(request.research)

    cached = load_cache(REPORT_CACHE_DIR, key)

    if cached:
        cached["cached"] = True
        return cached

    await send_event("Writer", "running")

    draft = writer_agent(request.topic, request.research)

    await send_event("Writer", "completed")

    await send_event("Critique", "running")

    critique = critique_agent(draft)

    await send_event("Critique", "completed")

    result = {
        "topic": request.topic,
        "draft": draft,
        "critique": critique,
        "cached": False,
    }

    save_cache(
        REPORT_CACHE_DIR,
        key,
        result,
    )

    return result


@router.get("/history")
async def report_history():
    """Retrieve list of all generated reports from cache."""
    reports = []
    if REPORT_CACHE_DIR.exists():
        for file in sorted(REPORT_CACHE_DIR.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True):
            try:
                import json
                with open(file, encoding="utf-8") as f:
                    data = json.load(f)
                    reports.append({
                        "id": file.stem,
                        "topic": data.get("topic", "Untitled Topic"),
                        "draft": data.get("draft", ""),
                        "critique": data.get("critique", ""),
                        "created_at": file.stat().st_mtime,
                    })
            except Exception:
                continue
    return reports