#!/usr/bin/env python3
"""Bake brand + absolute Open Graph URLs into share/v4 HTML for phone link previews."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PREVIEW = ROOT / "preview"
SHARE_V4 = ROOT / "share" / "v4"
SETTINGS = ROOT / "valtora-theme" / "config" / "settings_data.json"
SHARE_BRAND = PREVIEW / "share-brand.json"


def load_brand() -> dict:
    brand = {
        "brand": "Aligna",
        "line": "Mattresses",
        "tagline": "Premium Sleep, Engineered for the Gulf",
        "description": (
            "Premium Sleep, Engineered for the Gulf · Aligna. "
            "A better bed, for life. Refresh the comfort top - "
            "do not replace the whole mattress."
        ),
        "image": "assets/hero-mattress.jpg",
    }
    if SETTINGS.exists():
        try:
            data = json.loads(SETTINGS.read_text(encoding="utf-8"))
            cur = data.get("current") or {}
            if cur.get("brand_name"):
                brand["brand"] = str(cur["brand_name"]).strip() or brand["brand"]
            if "brand_product_line" in cur:
                brand["line"] = str(cur.get("brand_product_line") or "").strip()
            if cur.get("brand_tagline"):
                brand["tagline"] = str(cur["brand_tagline"]).strip() or brand["tagline"]
            if cur.get("share_description"):
                brand["description"] = str(cur["share_description"]).strip() or brand["description"]
        except Exception:
            pass

    index_html = SHARE_V4 / "index.html"
    if index_html.exists():
        try:
            raw = index_html.read_text(encoding="utf-8")
            m = re.search(
                r'<script[^>]*id=["\']ShareBrandData["\'][^>]*>(.*?)</script>',
                raw,
                re.I | re.S,
            )
            if m:
                embedded = json.loads(m.group(1).strip())
                for key in ("brand", "line", "tagline", "description", "image"):
                    if key in embedded and embedded[key] is not None:
                        brand[key] = str(embedded[key]).strip()
        except Exception:
            pass

    if SHARE_BRAND.exists():
        try:
            override = json.loads(SHARE_BRAND.read_text(encoding="utf-8"))
            for key in ("brand", "line", "tagline", "description", "image"):
                if key in override and override[key] is not None:
                    brand[key] = str(override[key]).strip()
        except Exception:
            pass
    return brand


def abs_url(base: str, path: str) -> str:
    base = base.rstrip("/") + "/"
    path = path.lstrip("./")
    return base + path


def esc(value: str) -> str:
    return (
        str(value)
        .replace("&", "&amp;")
        .replace('"', "&quot;")
        .replace("<", "&lt;")
    )


def head_and_rest(html: str) -> tuple[str, str]:
    m = re.search(r"</head>", html, re.I)
    if not m:
        return html, ""
    return html[: m.start()], html[m.start() :]


def upsert_in_head(head: str, attr: str, key: str, content: str) -> str:
    """Replace or insert a meta tag inside <head> only (avoids script string matches)."""
    tag = f'<meta {attr}="{key}" content="{esc(content)}">'
    # Match a full meta element for this key (either attribute order)
    patterns = [
        re.compile(
            rf'<meta\s+[^>]*\b{attr}=["\']{re.escape(key)}["\'][^>]*>',
            re.I,
        ),
        re.compile(
            rf'<meta\s+[^>]*\bcontent=(["\'])(.*?)\1[^>]*\b{attr}=["\']{re.escape(key)}["\'][^>]*>',
            re.I | re.S,
        ),
    ]
    for pattern in patterns:
        if pattern.search(head):
            return pattern.sub(tag, head, count=1)
    # Insert before end of head chunk (caller appends </head>)
    return head.rstrip() + "\n    " + tag + "\n  "


def upsert_title(head: str, title: str) -> str:
    if re.search(r"<title>.*?</title>", head, re.I | re.S):
        return re.sub(
            r"<title>.*?</title>",
            f"<title>{esc(title)}</title>",
            head,
            count=1,
            flags=re.I | re.S,
        )
    return head.rstrip() + f"\n    <title>{esc(title)}</title>\n  "


def expand_share_tokens(template: str, brand: dict) -> str:
    name = brand.get("brand") or "Aligna"
    line = brand.get("line") or ""
    tagline = brand.get("tagline") or ""
    text = template or ""
    text = (
        text.replace("[Brand]", name)
        .replace("[Line]", line)
        .replace("[Tagline]", tagline)
    )
    return re.sub(r"\s+", " ", text).strip()


def build_description(brand: dict) -> str:
    name = brand.get("brand") or "Aligna"
    tagline = brand.get("tagline") or ""
    desc = (brand.get("description") or "").strip()
    if not desc:
        desc = (
            f"{tagline} · [Brand]. A better bed, for life. "
            "Refresh the comfort top - do not replace the whole mattress."
        )
    return expand_share_tokens(desc, brand) or (
        f"{tagline} · {name}. A better bed, for life."
    ).strip(" ·")


def inject_file(path: Path, base_url: str, brand: dict, page_path: str = "") -> None:
    if not path.exists():
        return
    html = path.read_text(encoding="utf-8")
    head, rest = head_and_rest(html)
    if not rest:
        return

    name = brand["brand"] or "Aligna"
    line = brand.get("line") or ""
    tagline = brand.get("tagline") or ""
    desc = build_description(brand)
    site = f"{name} {line}".strip() if line else name
    title = site
    page_url = abs_url(base_url, page_path) if page_path else base_url.rstrip("/") + "/"
    image = abs_url(base_url, brand.get("image") or "assets/hero-mattress.jpg")

    head = upsert_title(head, title)
    for attr, key, val in [
        ("name", "description", desc),
        ("name", "application-name", name),
        ("name", "apple-mobile-web-app-title", name),
        ("property", "og:site_name", name),
        ("property", "og:title", title),
        ("property", "og:description", desc),
        ("property", "og:url", page_url),
        ("property", "og:type", "website"),
        ("property", "og:image", image),
        ("property", "og:image:alt", site),
        ("name", "twitter:card", "summary_large_image"),
        ("name", "twitter:title", title),
        ("name", "twitter:description", desc),
        ("name", "twitter:image", image),
        ("name", "twitter:image:alt", site),
    ]:
        head = upsert_in_head(head, attr, key, val)

    payload = json.dumps(
        {
            "brand": name,
            "line": line,
            "tagline": tagline,
            "description": desc,
            "image": brand.get("image") or "assets/hero-mattress.jpg",
        },
        ensure_ascii=False,
    )
    if re.search(r'<script[^>]*id=["\']ShareBrandData["\']', head, re.I):
        head = re.sub(
            r'(<script[^>]*id=["\']ShareBrandData["\'][^>]*>)(.*?)(</script>)',
            rf"\1{payload}\3",
            head,
            count=1,
            flags=re.I | re.S,
        )
    else:
        head = head.rstrip() + f'\n    <script type="application/json" id="ShareBrandData">{payload}</script>\n  '

    path.write_text(head + rest, encoding="utf-8")


def main() -> int:
    base = (sys.argv[1] if len(sys.argv) > 1 else "").strip()
    if not base:
        print("Usage: inject-share-meta.py <public-v4-base-url>", file=sys.stderr)
        return 1
    if not base.endswith("/"):
        if base.rstrip("/").endswith("v4"):
            base = base.rstrip("/") + "/"
        else:
            base = base.rstrip("/") + "/v4/"

    brand = load_brand()
    # Reset description from tagline+brand for a clean card when file has a mangled desc
    if "Aligna't" in (brand.get("description") or "") or "don&" in (brand.get("description") or ""):
        brand["description"] = (
            f"{brand.get('tagline') or 'Premium Sleep, Engineered for the Gulf'} · "
            f"{brand.get('brand') or 'Aligna'}. A better bed, for life. "
            "Refresh the comfort top - do not replace the whole mattress."
        )

    inject_file(SHARE_V4 / "index.html", base, brand, "")
    print(
        f"Injected share meta: brand={brand['brand']!r} title_line={brand.get('line')!r} base={base}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
