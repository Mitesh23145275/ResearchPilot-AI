from typing import TypedDict
from langgraph.graph import StateGraph, END
import asyncio
from app.websocket.events import send_event

from app.agents import (
    supervisor_agent,
    web_agent,
    literature_agent,
    technical_agent,
    industry_agent,
    writer_agent,
    critique_agent,
)
from app.services.chat_service import ask_question


class ResearchState(TypedDict):
    topic: str
    plan: str
    web: str
    literature: str
    technical: str
    industry: str
    rag: str
    research: str
    draft: str
    critique: str


def emit_event_sync(agent: str, status: str):
    """Safely send WebSocket events whether an event loop is running or not."""
    try:
        loop = asyncio.get_running_loop()
        if loop.is_running():
            asyncio.create_task(send_event(agent, status))
            return
    except RuntimeError:
        pass

    try:
        asyncio.run(send_event(agent, status))
    except Exception:
        pass


# ----------------------
# Nodes
# ----------------------

def supervisor_node(state):
    emit_event_sync("Supervisor", "running")
    plan = supervisor_agent(state["topic"])
    emit_event_sync("Supervisor", "completed")
    return {"plan": plan}


def web_node(state):
    emit_event_sync("Research", "running")
    result = web_agent(state["topic"])
    emit_event_sync("Research", "completed")
    return {"web": result}


def literature_node(state):
    emit_event_sync("Research", "running")
    result = literature_agent(state["topic"])
    emit_event_sync("Research", "completed")
    return {"literature": result}


def technical_node(state):
    emit_event_sync("Research", "running")
    result = technical_agent(state["topic"])
    emit_event_sync("Research", "completed")
    return {"technical": result}


def industry_node(state):
    emit_event_sync("Research", "running")
    result = industry_agent(state["topic"])
    emit_event_sync("Research", "completed")
    return {"industry": result}


def rag_node(state):
    emit_event_sync("PDF Research", "running")
    try:
        answer = ask_question(state["topic"])
        result = answer.get("answer", "No relevant PDF context found.")
    except Exception:
        result = "No relevant PDF context found."
    emit_event_sync("PDF Research", "completed")
    return {"rag": result}


def merge_node(state):
    rag_content = state.get("rag", "No relevant PDF context found.")
    combined = f"""
# Web Research

{state.get('web', '')}

---

# Literature Review

{state.get('literature', '')}

---

# Technical Analysis

{state.get('technical', '')}

---

# Industry Applications

{state.get('industry', '')}

---

# PDF Research

{rag_content}
"""
    return {"research": combined}


def writer_node(state):
    return {
        "draft": writer_agent(
            state["topic"],
            state["research"],
        )
    }


def critique_node(state):
    return {
        "critique": critique_agent(state["draft"])
    }


# ----------------------
# Build Graph
# ----------------------

builder = StateGraph(ResearchState)

builder.add_node("supervisor", supervisor_node)
builder.add_node("web", web_node)
builder.add_node("literature", literature_node)
builder.add_node("technical", technical_node)
builder.add_node("industry", industry_node)
builder.add_node("rag", rag_node)
builder.add_node("merge", merge_node)
builder.add_node("writer", writer_node)
builder.add_node("critique", critique_node)

builder.set_entry_point("supervisor")

builder.add_edge("supervisor", "web")
builder.add_edge("supervisor", "literature")
builder.add_edge("supervisor", "technical")
builder.add_edge("supervisor", "industry")
builder.add_edge("supervisor", "rag")

builder.add_edge("web", "merge")
builder.add_edge("literature", "merge")
builder.add_edge("technical", "merge")
builder.add_edge("industry", "merge")
builder.add_edge("rag", "merge")

builder.add_edge("merge", "writer")
builder.add_edge("writer", "critique")
builder.add_edge("critique", END)

graph = builder.compile()