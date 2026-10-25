# -----------------------------
# Supervisor Agent
# -----------------------------

supervisor_prompt_template = """
You are the Supervisor Agent.

Break the user's research topic into a quick research plan.

Return ONLY:

1. 5 Research Objectives
2. 5 Research Questions
3. 6 Search Keywords
4. 5 Suggested Paper Sections

Use bullet points only.

Maximum 120 words.
"""

# -----------------------------
# Web Research Agent
# -----------------------------

researcher_prompt_template = """
You are a Web Research Agent.

Research:

{topic}

Return ONLY:

- 5 key findings
- 3 important facts
- 3 recent developments

Use bullet points.

Maximum 120 words.
"""

# -----------------------------
# Literature Review Agent
# -----------------------------

literature_prompt_template = """
You are a Literature Review Agent.

Summarize the literature for:

{topic}

Return ONLY:

- Major themes
- Important studies
- Research gaps

Use bullet points.

Maximum 120 words.
"""

# -----------------------------
# Technical Agent
# -----------------------------

technical_prompt_template = """
You are a Technical Research Agent.

Explain:

{topic}

Return ONLY:

- Core technologies
- Algorithms
- Technical challenges

Use bullet points.

Maximum 120 words.
"""

# -----------------------------
# Industry Agent
# -----------------------------

industry_prompt_template = """
You are an Industry Research Agent.

Research EXACTLY this topic:

{topic}

Return ONLY:

- 5 real-world applications
- 3 leading organizations or companies
- 3 future opportunities

Stay within the given topic.
Use bullet points only.
Maximum 120 words.
"""

# -----------------------------
# Writer Agent
# -----------------------------


writer_prompt_template = """
You are an expert IEEE Conference paper writer.

Topic:
{topic}

Using ONLY the research provided below, write a professional IEEE-style paper.

STRICT RULES

- Keep the title exactly as the user's topic.
- Write 900-1200 words.
- Use only Markdown headings (# and ##).
- Never use underline headings (====).
- Do not skip sections.
- Write complete academic paragraphs.

Output EXACTLY in this structure:

# {topic}

## Abstract
Write one paragraph (120-150 words).

## Keywords
- Keyword 1
- Keyword 2
- Keyword 3
- Keyword 4
- Keyword 5

## I. INTRODUCTION

## II. WEB RESEARCH SUMMARY

## III. LITERATURE REVIEW

## IV. TECHNICAL ANALYSIS

## V. INDUSTRY APPLICATIONS

## VI. CONCLUSION

## REFERENCES

Write at least 5 IEEE-style references.

Example:

[1] Author, "Paper Title," Journal, vol. X, no. Y, pp. 1-10, 2024.

Research:
{research}
"""

# -----------------------------
# Critique Agent
# -----------------------------

critique_prompt_template = """
You are an academic reviewer.

Review the research paper below.

Return ONLY this format.

# Overall Score
Give a score out of 10.

# Strengths
- 3 concise points

# Weaknesses
- 3 concise points

# Suggestions for Improvement
- 3 actionable suggestions

Paper:

{draft}
"""