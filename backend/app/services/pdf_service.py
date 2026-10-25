import fitz
from pathlib import Path
from docx import Document


def extract_pdf_text(pdf_path: Path):
    """Extract text and metadata from a PDF."""

    document = fitz.open(pdf_path)

    text = ""
    page_count = document.page_count

    for page in document:
        text += page.get_text("text") + "\n"

    document.close()

    return {
        "text": text.strip(),
        "pages": page_count
    }


def extract_docx_text(docx_path: Path):
    """Extract text from a DOCX document."""

    document = Document(docx_path)

    text = "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
        if paragraph.text.strip()
    )

    return {
        "text": text.strip(),
        "pages": None
    }


def extract_txt_text(txt_path: Path):
    """Extract text from a TXT file."""

    text = txt_path.read_text(encoding="utf-8", errors="ignore")

    return {
        "text": text.strip(),
        "pages": None
    }


def extract_md_text(md_path: Path):
    """Extract text from a Markdown file."""

    text = md_path.read_text(encoding="utf-8", errors="ignore")

    return {
        "text": text.strip(),
        "pages": None
    }