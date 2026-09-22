#!/usr/bin/env python3
"""Snapshot trust-policy fallback copy into dated text files.

Usage:
  python3 scripts/snapshot-policies.py "Short description of what changed"
"""
from __future__ import annotations

import html
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
THEME = ROOT / "valtora-theme" / "templates"
LOG = ROOT / "docs" / "policy-log"

POLICIES = (
    ("100-night-trial", "page.trial.json"),
    ("365-night-programme", "page.365-night-programme.json"),
    ("terms", "page.terms.json"),
    ("privacy", "page.privacy.json"),
    ("warranty", "page.warranty.json"),
    ("refunds", "page.refunds.json"),
    ("delivery", "page.delivery.json"),
    ("cookies", "page.cookies.json"),
)


def html_to_text(raw: str) -> str:
    text = raw or ""
    text = re.sub(r"(?i)</p>\s*", "\n\n", text)
    text = re.sub(r"(?i)<h2[^>]*>", "\n\n## ", text)
    text = re.sub(r"(?i)</h2>", "\n", text)
    text = re.sub(r"(?i)<br\s*/?>", "\n", text)
    text = re.sub(r"(?i)<li[^>]*>", "- ", text)
    text = re.sub(r"(?i)</li>", "\n", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def fallback_from(path: Path) -> tuple[str, str, str]:
    data = json.loads(path.read_text())
    settings = data["sections"]["main"]["settings"]
    heading = settings.get("heading") or path.stem
    stamp = settings.get("last_modified") or ""
    body = html_to_text(settings.get("fallback_content") or "")
    return heading, stamp, body


def snapshot(note: str, when: datetime | None = None) -> Path:
    when = when or datetime.now(timezone.utc)
    iso = when.strftime("%Y-%m-%dT%H:%M:%SZ")
    folder = LOG / "snapshots" / when.strftime("%Y-%m-%dT%H%M%SZ")
    folder.mkdir(parents=True, exist_ok=True)
    names = []
    for slug, filename in POLICIES:
        src = THEME / filename
        if not src.exists():
            continue
        heading, stamp, body = fallback_from(src)
        out = folder / f"{slug}.txt"
        header = [
            f"Policy: {heading}",
            f"Handle: {slug}",
            f"Captured: {iso}",
            f"Last-modified setting: {stamp or '(unset — Shopify page.updated_at on live)'}",
            "",
        ]
        out.write_text("\n".join(header) + "\n" + body, encoding="utf-8")
        names.append(slug)

    changelog = LOG / "CHANGELOG.txt"
    if not changelog.exists():
        changelog.write_text("POLICY CHANGE LOG\n=================\n\n", encoding="utf-8")
    block = (
        f"{iso}\n"
        f"- {note.strip() or 'Policy snapshot'}\n"
        f"- Files: docs/policy-log/snapshots/{folder.name}/ ({', '.join(names)})\n\n"
    )
    existing = changelog.read_text(encoding="utf-8")
    # Insert newest entry after the heading block.
    marker = "=================\n\n"
    if marker in existing:
        head, tail = existing.split(marker, 1)
        changelog.write_text(head + marker + block + tail, encoding="utf-8")
    else:
        changelog.write_text(existing + block, encoding="utf-8")
    return folder


def main() -> None:
    note = " ".join(sys.argv[1:]).strip() or "Policy snapshot"
    folder = snapshot(note)
    print(f"Wrote {folder}")


if __name__ == "__main__":
    main()
