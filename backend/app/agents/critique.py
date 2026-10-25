from langchain_ollama import ChatOllama

from app.config import OLLAMA_BASE_URL, OLLAMA_MODEL
from app.prompts import critique_prompt_template


llm = ChatOllama(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL,
    temperature=0,
    num_predict=700,
)


def critique_agent(draft: str):
    return llm.invoke(
        critique_prompt_template.format(
            draft=draft
        )
    ).content