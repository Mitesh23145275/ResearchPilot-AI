from pathlib import Path

from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_community.document_loaders import (
    PyMuPDFLoader,
    TextLoader,
    UnstructuredMarkdownLoader,
    Docx2txtLoader,
)
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import (
    CHROMA_DB_DIR,
    PAPERS_DIR,
    OLLAMA_BASE_URL,
    EMBEDDING_MODEL,
)


def create_vectorstore():
    """
    Builds a Chroma vector database from all PDFs
    inside data/papers.
    """

    documents = []

    supported_files = []

    for ext in ("*.pdf", "*.docx", "*.txt", "*.md"):
        supported_files.extend(Path(PAPERS_DIR).glob(ext))

    if not supported_files:
        return {
            "status": "error",
            "message": "No supported documents found in data/papers.",
        }

    for file in supported_files:

        suffix = file.suffix.lower()

        if suffix == ".pdf":
            loader = PyMuPDFLoader(str(file))

        elif suffix == ".docx":
            loader = Docx2txtLoader(str(file))

        elif suffix == ".txt":
            loader = TextLoader(str(file), encoding="utf-8")

        elif suffix == ".md":
            loader = UnstructuredMarkdownLoader(str(file))

        else:
            continue

        docs = loader.load()

        # Add metadata BEFORE chunking
        for doc in docs:
            doc.metadata["document_id"] = file.name
            doc.metadata["file_name"] = file.name
            doc.metadata["file_type"] = suffix[1:]

        documents.extend(docs)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    chunks = splitter.split_documents(documents)

    for chunk in chunks:
        chunk.metadata["document_id"] = chunk.metadata.get(
            "document_id",
            Path(chunk.metadata.get("source", "")).name,
        )

        chunk.metadata["file_name"] = chunk.metadata.get(
            "file_name",
            Path(chunk.metadata.get("source", "")).name,
        )

        chunk.metadata["file_type"] = chunk.metadata.get(
            "file_type",
            Path(chunk.metadata.get("source", "")).suffix.lstrip("."),
        )

    embeddings = OllamaEmbeddings(
        model=EMBEDDING_MODEL,
        base_url=OLLAMA_BASE_URL,
    )

    Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=str(CHROMA_DB_DIR),
    )

    return {
        "status": "success",
        "chunks": len(chunks),
    }


def get_vectorstore():
    """
    Loads the existing Chroma database.
    This function name is kept for compatibility with chat_service.py.
    """

    embeddings = OllamaEmbeddings(
        model=EMBEDDING_MODEL,
        base_url=OLLAMA_BASE_URL,
    )

    return Chroma(
        persist_directory=str(CHROMA_DB_DIR),
        embedding_function=embeddings,
    )


# Backward-compatible alias
load_vectorstore = get_vectorstore