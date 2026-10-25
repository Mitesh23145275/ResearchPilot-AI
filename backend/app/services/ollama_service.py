from langchain_ollama import ChatOllama
from app.config import OLLAMA_BASE_URL, OLLAMA_MODEL

# Shared LLM instance
llm = ChatOllama(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL,
    temperature=0.3,
)


def generate_text(prompt: str) -> str:
    """Generate text using Ollama."""
    response = llm.invoke(prompt)
    return response.content