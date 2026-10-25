import asyncio

from langchain_ollama import ChatOllama

from app.config import OLLAMA_BASE_URL, OLLAMA_MODEL
from app.services.chat_service import ask_question


llm = ChatOllama(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL,
    temperature=0,
    num_predict=650,
)


async def generate(prompt):
    return await asyncio.to_thread(
        lambda: llm.invoke(prompt).content
    )


async def normalize_topic(topic: str):
    """Normalize common user queries before research."""

    lower = topic.lower().strip()

    mapping = {
        "what is ssc": "Secondary School Certificate (SSC Board, India)",
        "ssc": "Secondary School Certificate (SSC Board, India)",
        "what is hsc": "Higher Secondary Certificate (HSC Board, India)",
        "hsc": "Higher Secondary Certificate (HSC Board, India)",
        "what is upsc": "Union Public Service Commission (India)",
        "upsc": "Union Public Service Commission (India)",
        "what is gst": "Goods and Services Tax (India)",
        "gst": "Goods and Services Tax (India)",
        "what is ai": "Artificial Intelligence",
        "ai": "Artificial Intelligence",
    }

    if lower in mapping:
        return mapping[lower]

    if lower.startswith("what is "):
        return topic[8:].strip().title()

    return topic.strip().title()


def extract(text, title, next_title=None):
    marker = f"## {title}"
    start = text.find(marker)

    if start == -1:
        return ""

    start += len(marker)

    if next_title:
        end = text.find(f"## {next_title}", start)

        if end == -1:
            end = len(text)
    else:
        end = len(text)

    section = text[start:end].strip()

    while section.endswith("#"):
        section = section[:-1].strip()

    return section


def replace_section(text, title, next_title, new_section):
    marker = f"## {title}"
    start = text.find(marker)

    if start == -1:
        return text.rstrip() + "\n\n" + new_section.strip()

    if next_title:
        end = text.find(f"## {next_title}", start)

        if end == -1:
            end = len(text)
    else:
        end = len(text)

    return (
        text[:start].rstrip()
        + "\n\n"
        + new_section.strip()
        + "\n\n"
        + text[end:].lstrip()
    )


async def ensure_section(text, title, next_title, topic, instructions):
    section = extract(text, title, next_title)

    if len(section) > 80:
        return text

    repair_prompt = f"""
You are an expert academic researcher.

Research ONLY this topic:

"{topic}"

Generate ONLY this section.

## {title}

{instructions}

Rules:
- Complete every bullet.
- Do not generate any other section.
"""

    repaired = await generate(repair_prompt)

    return replace_section(
        text,
        title,
        next_title,
        repaired,
    )


async def run_parallel_research(topic: str):

    topic = await normalize_topic(topic)

    web_prompt = f"""
You are an expert academic researcher.

Research ONLY this topic:

"{topic}"

Do not assume the topic is about Artificial Intelligence unless AI is explicitly mentioned.

Generate concise Markdown.

## Web Research
- 4 Key Findings
- 3 Important Facts
- 2 Recent Developments

## Literature Review
- 3 Major Themes
- 2 Important Studies
- 3 Research Gaps

Every bullet must be complete.
"""

    technical_prompt = f"""
You are an expert academic researcher.

Research ONLY this topic:

"{topic}"

Generate concise Markdown.

## Technical Analysis
- 4 Core Technologies
- 3 Important Algorithms or Methods
- 3 Technical Challenges

## Industry Applications
- 4 Real-world Applications
- 3 Leading Organizations or Companies
- 2 Future Opportunities

Every bullet must be complete.
"""

    async def rag():
        try:
            result = await asyncio.to_thread(
                ask_question,
                topic,
            )
            return result["answer"]
        except Exception:
            return "No relevant PDF context found."

    web_text, technical_text, rag_text = await asyncio.gather(
        generate(web_prompt),
        generate(technical_prompt),
        rag(),
    )

    web_text = await ensure_section(
        web_text,
        "Web Research",
        "Literature Review",
        topic,
        "- 4 Key Findings\n- 3 Important Facts\n- 2 Recent Developments",
    )

    web_text = await ensure_section(
        web_text,
        "Literature Review",
        None,
        topic,
        "- 3 Major Themes\n- 2 Important Studies\n- 3 Research Gaps",
    )

    technical_text = await ensure_section(
        technical_text,
        "Technical Analysis",
        "Industry Applications",
        topic,
        "- 4 Core Technologies\n- 3 Important Algorithms or Methods\n- 3 Technical Challenges",
    )

    technical_text = await ensure_section(
        technical_text,
        "Industry Applications",
        None,
        topic,
        "- 4 Real-world Applications\n- 3 Leading Organizations or Companies\n- 2 Future Opportunities",
    )

    return {
        "web": extract(web_text, "Web Research", "Literature Review"),
        "literature": extract(web_text, "Literature Review"),
        "technical": extract(
            technical_text,
            "Technical Analysis",
            "Industry Applications",
        ),
        "industry": extract(
            technical_text,
            "Industry Applications",
        ),
        "rag": rag_text,
    }