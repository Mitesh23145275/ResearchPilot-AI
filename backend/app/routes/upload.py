from pathlib import Path
import shutil

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.config import PAPERS_DIR
from app.services.pdf_service import (
    extract_pdf_text,
    extract_docx_text,
    extract_txt_text,
    extract_md_text,
)

router = APIRouter(prefix="/upload", tags=["Upload"])

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
    ".md",
}


@router.post("/")
async def upload_document(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix.lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX, TXT and MD files are allowed."
        )

    save_path = PAPERS_DIR / file.filename

    with save_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract according to file type
    if ext == ".pdf":
        data = extract_pdf_text(save_path)
    elif ext == ".docx":
        data = extract_docx_text(save_path)
    elif ext == ".txt":
        data = extract_txt_text(save_path)
    elif ext == ".md":
        data = extract_md_text(save_path)

    return {
        "message": "Document uploaded successfully.",
        "filename": file.filename,
        "file_type": ext[1:],
        "pages": data["pages"],
        "characters": len(data["text"]),
        "preview": data["text"][:500],
    }

@router.get("/documents")
async def list_documents():
    """Return all uploaded documents."""

    documents = []

    for file in sorted(
        PAPERS_DIR.iterdir(),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    ):
        if not file.is_file():
            continue

        ext = file.suffix.lower()

        if ext not in ALLOWED_EXTENSIONS:
            continue

        documents.append({
            "id": file.name,
            "name": file.stem,
            "filename": file.name,
            "file_type": ext[1:],      # pdf, docx, txt, md
            "size": file.stat().st_size,
            "modified": file.stat().st_mtime,
        })

    return documents