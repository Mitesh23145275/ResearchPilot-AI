from app.prompts import industry_prompt_template
from app.agents.base import run_prompt


def industry_agent(topic: str):
    return run_prompt(
        industry_prompt_template.format(
            topic=topic
        )
    )