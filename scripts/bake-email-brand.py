#!/usr/bin/env python3
"""Bake Theme settings → Brand name (line 1) into lifecycle emails.

Emails that used the short word 'Numa' take only the first word of brand_name,
never product line. Wordmark is that word in uppercase.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SETTINGS = ROOT / "valtora-theme" / "config" / "settings_data.json"
EMAILS = ROOT / "emails"
PREVIEW = ROOT / "preview" / "emails"


def brand_first() -> str:
    data = json.loads(SETTINGS.read_text(encoding="utf-8"))
    raw = ((data.get("current") or {}).get("brand_name") or "Numa").strip()
    return (raw.split() or ["Numa"])[0]


def bake_text(text: str, first: str) -> str:
    wordmark = first.upper()
    for old_mark in ("NUMA", "ALIGNA"):
        text = text.replace(f">{old_mark}</td>", f">{wordmark}</td>")
    for old in ("Numa", "Aligna"):
        text = text.replace(f"Your {old} mattress", f"Your {first} mattress")
        text = text.replace(f"your {old}", f"your {first}")
        text = text.replace(f"{old} &middot;", f"{first} &middot;")
        text = text.replace(f"{old} emails", f"{first} emails")
    return text


def main() -> None:
    first = brand_first()
    PREVIEW.mkdir(parents=True, exist_ok=True)
    for src in sorted(EMAILS.glob("*.html")):
        out = bake_text(src.read_text(encoding="utf-8"), first)
        src.write_text(out, encoding="utf-8")
        (PREVIEW / src.name).write_text(out, encoding="utf-8")
        print(f"baked {src.name} → {first}")
    readme = EMAILS / "README.md"
    if readme.exists():
        (PREVIEW / "README.md").write_text(readme.read_text(encoding="utf-8"), encoding="utf-8")
    index = PREVIEW / "index.html"
    if index.exists():
        index.write_text(bake_text(index.read_text(encoding="utf-8"), first), encoding="utf-8")
    print(f"email brand is {first!r} (settings brand_name, first word)")


if __name__ == "__main__":
    main()
