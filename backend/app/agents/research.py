from app.prompts import researcher_prompt_template
from app.agents.base import run_prompt


def research_agent(topic: str):
    return run_prompt(
        researcher_prompt_template.format(
            topic=topic
        )
    )