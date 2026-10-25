from langchain_community.tools import DuckDuckGoSearchRun
from langchain_ollama import ChatOllama

from app.config import (
    OLLAMA_BASE_URL,
    OLLAMA_MODEL
)

from app.services.cache_service import (
    make_cache_key,
    save_cache,
    load_cache,
)
from app.config import WEB_CACHE_DIR

search_tool = DuckDuckGoSearchRun()

llm = ChatOllama(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL,
    temperature=0.1,
    num_predict=400,
)


def web_search(topic: str):
    key = make_cache_key(topic)

    cached = load_cache(WEB_CACHE_DIR, key)

    if cached:
        return cached["summary"]

    try:
        search_results = search_tool.invoke(topic)

        prompt = f"""
You are a Web Research Agent.

Research Topic:
{topic}

Web Search Results:
{search_results}

Create a structured summary.

Use these sections:

- Overview
- Key Findings
- Recent Developments
- Advantages
- Challenges
- Future Scope
"""

        response = llm.invoke(prompt)

        save_cache(
            WEB_CACHE_DIR,
            key,
            {
                "summary": response.content
            }
        )

        return response.content

    except Exception:
        return """
Web Search Unavailable

Continue the research using local knowledge and uploaded PDF documents.
"""