import hashlib
import json
from pathlib import Path


def make_cache_key(text: str) -> str:
    return hashlib.sha256(text.lower().strip().encode()).hexdigest()


def save_cache(folder: Path, key: str, data: dict):
    path = folder / f"{key}.json"

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def load_cache(folder: Path, key: str):
    path = folder / f"{key}.json"

    if not path.exists():
        return None

    with open(path, encoding="utf-8") as f:
        return json.load(f)