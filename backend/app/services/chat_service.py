from pathlib import Path
import fitz

from langchain_ollama import ChatOllama

from app.config import (
    OLLAMA_BASE_URL,
    OLLAMA_MODEL,
    PAPERS_DIR,
)
from app.services.vectorstore import get_vectorstore

llm = ChatOllama(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL,
    temperature=0.1,
    num_predict=180,
)

def get_first_page_text(document_id: str):
    """Read only the first page of a selected PDF."""

    pdf_path = PAPERS_DIR / document_id

    if not pdf_path.exists():
        return None

    if pdf_path.suffix.lower() != ".pdf":
        return None

    doc = fitz.open(pdf_path)

    if doc.page_count == 0:
        doc.close()
        return None

    text = doc[0].get_text("text")
    doc.close()

    return text.strip()


def ask_question(
    question: str,
    mode: str = "all",
    document_id: str | None = None,
):
    vectorstore = get_vectorstore()

    search_query = question.strip()
    # Fast path for title, author and abstract questions
    if mode == "selected" and document_id:
        first_page = get_first_page_text(document_id)

        if first_page:
            q = question.lower()

            if any(word in q for word in ["title", "author", "abstract"]):

                prompt = f"""
    You are reading the FIRST PAGE of a research paper.

    Rules:
    - Return ONLY what is asked.
    - If asked for the title, return ONLY the paper title.
    - Do not include authors, affiliations, conference names, or headings.
    - Preserve the original capitalization.
    - If asked for authors, return the author names exactly as written.
    - If asked for the abstract, return only the abstract.

    First Page:
    {first_page}

    Question:
    {question}
    """

                response = llm.invoke(prompt)

                return {
                    "answer": response.content.strip(),
                    "sources": [document_id],
                }

    if mode == "selected" and document_id:
        docs = vectorstore.similarity_search(
            search_query,
            k=8,
            filter={"document_id": document_id},
        )
    else:
        docs = vectorstore.similarity_search(
            search_query,
            k=8,
        )

    if not docs:
        return {
            "answer": "No relevant information found in the uploaded papers.",
            "sources": [],
        }

    context = "\n\n".join(doc.page_content for doc in docs)

    prompt = f"""
You are an academic research assistant.

Rules:
- Answer ONLY from the provided context.
- The beginning of the document often contains the paper title and authors.
- If asked for the title, return ONLY the exact title exactly as it appears.
- Do not combine headings into the title.
- If asked for authors, return the author names exactly as written.
- If the context truly does not contain the answer, reply exactly:
  "The uploaded papers do not contain this information."

Context:
{context}

Question:
{question}
"""

    response = llm.invoke(prompt)
    answer = response.content.strip()

    if "do not contain this information" in answer.lower():
        return {
            "answer": answer,
            "sources": [],
        }

    sources = sorted({
        Path(doc.metadata["source"]).name
        for doc in docs
    })

    return {
        "answer": answer,
        "sources": sources,
    }