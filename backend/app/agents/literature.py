from app.prompts import literature_prompt_template
from app.agents.base import run_prompt


def literature_agent(topic: str):
    return run_prompt(
        literature_prompt_template.format(
            topic=topic
        )
    )