from langchain_ollama import ChatOllama

from app.config import (
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
)

# Shared LLM used by all agents
llm = ChatOllama(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL,
    temperature=0.1,
    num_predict=220,
)


def run_prompt(prompt: str):
    return llm.invoke(prompt).content