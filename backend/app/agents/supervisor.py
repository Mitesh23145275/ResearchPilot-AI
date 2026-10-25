from app.prompts import supervisor_prompt_template
from app.agents.base import run_prompt


def supervisor_agent(topic: str):
    return run_prompt(
        supervisor_prompt_template +
        f"\n\nTopic: {topic}"
    )