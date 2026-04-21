#!/usr/bin/env python3
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Optional


ROOT = Path(__file__).resolve().parent.parent
BOOKS_DIR = ROOT / "_books"
OUTPUT_PATH = ROOT / "_data" / "books_metadata.json"
USER_AGENT = "erk.github.io books sync/1.0"


def parse_front_matter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}

    parts = text.split("\n---\n", 1)
    if len(parts) != 2:
        return {}

    metadata = {}
    for raw_line in parts[0].splitlines()[1:]:
        line = raw_line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        metadata[key] = value
    return metadata


def normalize_isbn(value: str) -> Optional[str]:
    candidate = re.sub(r"[^0-9Xx]", "", value or "").upper()
    if len(candidate) == 10 and re.fullmatch(r"[0-9]{9}[0-9X]", candidate):
        return candidate
    if len(candidate) == 13 and candidate.isdigit():
        return candidate
    return None


def extract_isbn(metadata: dict) -> Optional[str]:
    direct = normalize_isbn(metadata.get("isbn", ""))
    if direct:
        return direct

    for key in ("book_url", "source_url", "goodreads_url"):
        value = metadata.get(key, "")
        for match in re.findall(r"(97[89][0-9Xx-]{10,}|[0-9Xx-]{10,17})", value):
            candidate = normalize_isbn(match)
            if candidate:
                return candidate

    return None


def fetch_json(url: str) -> dict:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request) as response:
        return json.load(response)


def fetch_google_books_metadata(isbn: str) -> dict:
    record = fetch_json(f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}")
    items = record.get("items") or []
    if not items:
        return {}

    volume_info = items[0].get("volumeInfo") or {}
    image_links = volume_info.get("imageLinks") or {}
    cover = image_links.get("thumbnail") or image_links.get("smallThumbnail")
    if cover:
        cover = cover.replace("http://", "https://")

    authors = volume_info.get("authors") or []

    return {
        "title": volume_info.get("title"),
        "subtitle": volume_info.get("subtitle"),
        "author": ", ".join(authors) if authors else None,
        "description": volume_info.get("description"),
        "publish_date": volume_info.get("publishedDate"),
        "page_count": volume_info.get("pageCount"),
        "cover": cover,
        "google_books_url": volume_info.get("infoLink") or volume_info.get("canonicalVolumeLink"),
    }


def build_metadata(slug: str, isbn: str) -> dict:
    google_record = fetch_google_books_metadata(isbn)

    return {
        "isbn": isbn,
        "title": google_record.get("title"),
        "subtitle": google_record.get("subtitle"),
        "author": google_record.get("author"),
        "description": google_record.get("description"),
        "publish_date": google_record.get("publish_date"),
        "page_count": google_record.get("page_count"),
        "cover": google_record.get("cover"),
        "google_books_url": google_record.get("google_books_url"),
        "slug": slug,
    }


def main() -> int:
    BOOKS_DIR.mkdir(exist_ok=True)
    OUTPUT_PATH.parent.mkdir(exist_ok=True)

    metadata = {}
    failures = []

    for path in sorted(BOOKS_DIR.glob("*.md")):
        front_matter = parse_front_matter(path)
        isbn = extract_isbn(front_matter)
        if not isbn:
            continue

        slug = path.stem
        try:
            metadata[slug] = build_metadata(slug, isbn)
        except urllib.error.HTTPError as error:
            failures.append(f"{path.name}: HTTP {error.code}")
        except urllib.error.URLError as error:
            failures.append(f"{path.name}: {error.reason}")

    OUTPUT_PATH.write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    if failures:
        for failure in failures:
            print(failure, file=sys.stderr)
        return 1

    print(f"Wrote metadata for {len(metadata)} book(s) to {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
