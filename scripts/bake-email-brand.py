#!/usr/bin/env python3
"""Bake Theme settings → Brand name (line 1) into lifecycle emails.

Emails that used the short word 'Numa' take only the first word of brand_name,
never product line. Wordmark is that word in uppercase.

Also bakes return_window_days and adjustment_period_months into 07/13/16.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SETTINGS = ROOT / "valtora-theme" / "config" / "settings_data.json"
EMAILS = ROOT / "emails"
PREVIEW = ROOT / "preview" / "emails"


def settings_current() -> dict:
    data = json.loads(SETTINGS.read_text(encoding="utf-8"))
    return data.get("current") or {}


def brand_first() -> str:
    raw = (settings_current().get("brand_name") or "Numa").strip()
    return (raw.split() or ["Numa"])[0]


def policy_numbers() -> tuple[str, str]:
    cur = settings_current()
    return_days = str(cur.get("return_window_days") or cur.get("trial_nights") or 30)
    adj_months = str(cur.get("adjustment_period_months") or 12)
    return return_days, adj_months


def bake_text(text: str, first: str, return_days: str = "30", adj_months: str = "12") -> str:
    wordmark = first.upper()
    for old_mark in ("NUMA", "ALIGNA"):
        text = text.replace(f">{old_mark}</td>", f">{wordmark}</td>")
    for old in ("Numa", "Aligna"):
        text = text.replace(f"Your {old} mattress", f"Your {first} mattress")
        text = text.replace(f"your {old}", f"your {first}")
        text = text.replace(f"{old} &middot;", f"{first} &middot;")
        text = text.replace(f"{old} emails", f"{first} emails")
    text = text.replace("[RETURN_WINDOW]", return_days)
    text = text.replace("[ADJUST_MONTHS]", adj_months)
    text = text.replace("30-day return trial", f"{return_days}-day return trial")
    return text


def main() -> None:
    first = brand_first()
    return_days, adj_months = policy_numbers()
    PREVIEW.mkdir(parents=True, exist_ok=True)
    for src in sorted(EMAILS.glob("*.html")):
        out = bake_text(src.read_text(encoding="utf-8"), first, return_days, adj_months)
        src.write_text(out, encoding="utf-8")
        (PREVIEW / src.name).write_text(out, encoding="utf-8")
        print(f"baked {src.name} → {first} return={return_days} adjust={adj_months}")
    readme = EMAILS / "README.md"
    if readme.exists():
        (PREVIEW / "README.md").write_text(readme.read_text(encoding="utf-8"), encoding="utf-8")
    index = PREVIEW / "index.html"
    if index.exists():
        index.write_text(
            bake_text(index.read_text(encoding="utf-8"), first, return_days, adj_months),
            encoding="utf-8",
        )
    print(f"email brand is {first!r} (settings brand_name, first word)")


if __name__ == "__main__":
    main()
