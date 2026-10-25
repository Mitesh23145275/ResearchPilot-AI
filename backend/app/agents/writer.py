from langchain_ollama import ChatOllama

from app.config import OLLAMA_BASE_URL, OLLAMA_MODEL
from app.prompts import writer_prompt_template

# Dedicated LLM for report generation only
llm = ChatOllama(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL,
    temperature=0,
    num_predict=2000,
)


def writer_agent(topic: str, research: str):
    return llm.invoke(
        writer_prompt_template.format(
            topic=topic,
            research=research,
        )
    ).content