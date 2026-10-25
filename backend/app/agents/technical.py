from app.prompts import technical_prompt_template
from app.agents.base import run_prompt


def technical_agent(topic: str):
    return run_prompt(
        technical_prompt_template.format(
            topic=topic
        )
    )