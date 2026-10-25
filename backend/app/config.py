from pathlib import Path
import os
from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = Path(__file__).resolve().parents[1]

load_dotenv(BACKEND_DIR / ".env")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:3b-instruct")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")

DATA_DIR = PROJECT_ROOT / "data"

PAPERS_DIR = DATA_DIR / "papers"
REPORTS_DIR = DATA_DIR / "reports"
CHROMA_DB_DIR = DATA_DIR / "chroma_db"

CACHE_DIR = DATA_DIR / "cache"
WEB_CACHE_DIR = CACHE_DIR / "web"
RESEARCH_CACHE_DIR = CACHE_DIR / "research"
REPORT_CACHE_DIR = CACHE_DIR / "report"

for folder in [
    PAPERS_DIR,
    REPORTS_DIR,
    CHROMA_DB_DIR,
    WEB_CACHE_DIR,
    RESEARCH_CACHE_DIR,
    REPORT_CACHE_DIR,
]:
    folder.mkdir(parents=True, exist_ok=True)