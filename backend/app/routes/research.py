from fastapi import APIRouter
from pydantic import BaseModel

from app.services.research_service import run_parallel_research
from app.services.cache_service import (
    make_cache_key,
    save_cache,
    load_cache,
)
from app.config import RESEARCH_CACHE_DIR
from app.websocket.events import send_event

router = APIRouter(
    prefix="/research",
    tags=["Multi-Agent Research"],
)


class ResearchRequest(BaseModel):
    topic: str


@router.post("/")
async def run_research(request: ResearchRequest):
    topic = request.topic.strip()

    # Normalize topic for caching
    normalized_topic = " ".join(topic.lower().split())

    key = make_cache_key(normalized_topic)

    cached = load_cache(RESEARCH_CACHE_DIR, key)

    if cached:
        cached["cached"] = True
        return cached

    # Supervisor (instant)
    await send_event("Supervisor", "running")

    plan = f"""Research Plan

Topic: {topic}

Research Objectives:
• Understand the topic
• Review recent developments
• Identify technical concepts
• Explore industry applications
• Summarize key findings

Suggested Sections:
• Web Research
• Literature Review
• Technical Analysis
• Industry Applications
"""

    await send_event("Supervisor", "completed")

    # Research Agents
    await send_event("Research Agents", "running")

    research = await run_parallel_research(topic)

    await send_event("Research Agents", "completed")

    combined = f"""
# Web Research

{research["web"]}

---

# Literature Review

{research["literature"]}

---

# Technical Analysis

{research["technical"]}

---

# Industry Applications

{research["industry"]}

---

# PDF Research

{research["rag"]}
"""

    result = {
        "topic": topic,
        "plan": plan,
        "web": research["web"],
        "literature": research["literature"],
        "technical": research["technical"],
        "industry": research["industry"],
        "rag": research["rag"],
        "research": combined,
        "draft": "",
        "critique": "",
        "cached": False,
    }

    save_cache(
        RESEARCH_CACHE_DIR,
        key,
        result,
    )

    await send_event("Research", "completed")

    return result