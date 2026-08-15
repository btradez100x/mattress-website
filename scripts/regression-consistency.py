#!/usr/bin/env python3
"""
Preview consistency gate — brand/theme/chrome must match across pages.

Run via: ./scripts/regression-smoke.sh
Or alone:  python3 scripts/regression-consistency.py

Fails closed if any preview/share page is missing brand-boot, theme.js,
brand tokens, or common chrome wiring that caused past “blink / Aligna /
wrong banner” regressions.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAIL = 0
PASS = 0


def ok(msg: str) -> None:
    global PASS
    PASS += 1
    print(f"PASS  {msg}")


def bad(msg: str) -> None:
    global FAIL
    FAIL += 1
    print(f"FAIL  {msg}")


def check_html(path: Path, *, is_home: bool = False) -> None:
    rel = path.relative_to(ROOT)
    text = path.read_text(encoding="utf-8", errors="replace")

    if "data-valtora-brand-boot" not in text and "brand-boot.js" not in text:
        bad(f"{rel}: missing brand-boot.js (pre-paint theme)")
    else:
        ok(f"{rel}: brand-boot present")

    if not is_home:
        if "theme.js" not in text:
            bad(f"{rel}: missing theme.js")
        else:
            ok(f"{rel}: theme.js present")

        if "data-brand-guidelines=" not in text:
            bad(f"{rel}: missing data-brand-guidelines on <html>")
        else:
            ok(f"{rel}: data-brand-guidelines present")

        if "data-color-scheme=" not in text:
            bad(f"{rel}: missing data-color-scheme on <html>")
        else:
            ok(f"{rel}: data-color-scheme present")

    if "fonts.googleapis.com" in text and 'id="PreviewFontLink"' not in text:
        # Homepage may use PreviewFontLink — require it wherever Google fonts link exists
        if re.search(r'fonts\.googleapis\.com/css2', text):
            bad(f"{rel}: Google Fonts link missing id=PreviewFontLink")
        else:
            ok(f"{rel}: no swappable Google Fonts link required")
    else:
        ok(f"{rel}: PreviewFontLink present (or N/A)")

    # Wordmarks must be config-driven
    if "wordmark__text" in text:
        bare = re.findall(r'<span class="wordmark__text"(?![^>]*data-brand-text)[^>]*>', text)
        if bare:
            bad(f"{rel}: {len(bare)} wordmark__text without data-brand-text")
        else:
            ok(f"{rel}: wordmark__text uses data-brand-text")

        bare_line = re.findall(
            r'<span class="wordmark__product"(?![^>]*data-brand-product-line)[^>]*>', text
        )
        if bare_line:
            bad(f"{rel}: {len(bare_line)} wordmark__product without data-brand-product-line")
        else:
            ok(f"{rel}: wordmark__product uses data-brand-product-line")

    # Hardcoded navy header chrome (must use brand tokens)
    if re.search(r"rgba\(\s*31\s*,\s*58\s*,\s*95", text) or re.search(
        r"background:\s*#1F3A5F", text
    ):
        # allow only if clearly not header/banner — still flag preview-banner hardcoded
        if ".site-header--solid" in text and "rgba(31, 58, 95" in text:
            bad(f"{rel}: site-header uses hardcoded navy rgba (use brand CSS vars)")
        elif ".preview-banner" in text and re.search(
            r"\.preview-banner\s*\{[^}]*#1F3A5F", text, re.S
        ):
            bad(f"{rel}: preview-banner hardcoded #1F3A5F (use var(--brand-primary))")
        else:
            ok(f"{rel}: no hardcoded header/banner navy found")
    else:
        ok(f"{rel}: no hardcoded navy chrome")

    # Announcement bar consistency on multi-page surfaces
    if path.name != "index.html" or "pages/" in str(rel) or "blog/" in str(rel):
        if path.parent.name in ("pages", "blog") or "pages/" in str(rel) or "blog/" in str(rel):
            if "data-announcement-bar" not in text and 'class="announcement"' not in text:
                bad(f"{rel}: missing site announcement bar")
            else:
                ok(f"{rel}: announcement bar present")

    nav_chunk = re.search(r'<nav class="site-header__nav"[^>]*>([\s\S]*?)</nav>', text)
    if nav_chunk and re.search(r'>Reserve</a>', nav_chunk.group(1)):
        bad(f"{rel}: header nav still includes Reserve")
    elif nav_chunk:
        ok(f"{rel}: header nav omits Reserve")

    # Manufacturing / journey story must use brand tokens in copy
    if path.name == "manufacturing.html":
        brand_spans = len(re.findall(r"data-brand-text", text))
        if brand_spans < 3:
            bad(f"{rel}: manufacturing story/logo under-tokenised (found {brand_spans} data-brand-text)")
        else:
            ok(f"{rel}: manufacturing brand tokens present ({brand_spans})")
        if "theme.js" not in text:
            bad(f"{rel}: manufacturing missing theme.js (theme settings will not apply)")
        if re.search(r'href="#(swap|specs|lifestyle|reserve|founder|faq|cool-touch|swap-video)"', text):
            bad(f"{rel}: homepage section links are in-page hashes (need homepage + hash)")
        else:
            ok(f"{rel}: homepage section links point off-page")
        if 'href="../index.html#swap"' not in text or 'href="../pages/order-status.html"' not in text:
            bad(f"{rel}: menu must use ../index.html#… and ../pages/…")
        else:
            ok(f"{rel}: menu uses homepage hash + /pages/ URLs")
        if "site-header--solid" in text:
            bad(f"{rel}: manufacturing header still uses site-header--solid (must match homepage chrome)")
        else:
            ok(f"{rel}: manufacturing header uses homepage chrome")
        nav_chunk = re.search(r'<nav class="site-header__nav"[^>]*>([\s\S]*?)</nav>', text)
        if nav_chunk and re.search(r'>Reserve</a>', nav_chunk.group(1)):
            bad(f"{rel}: manufacturing nav still includes Reserve")
        else:
            ok(f"{rel}: manufacturing nav omits Reserve")


def check_theme_js() -> None:
    js = (ROOT / "preview" / "theme.js").read_text(encoding="utf-8", errors="replace")
    theme_js = ROOT / "valtora-theme" / "assets" / "theme.js"
    if not theme_js.exists():
        bad("valtora-theme/assets/theme.js missing")
        return

    # Live must not overwrite server theme attrs from preview localStorage
    if "Live Shopify: trust server-rendered settings" in js or (
        "if (!previewHost)" in js and "initPreviewBrandChrome" in js
    ):
        ok("theme.js gates preview localStorage away from live Shopify")
    else:
        bad("theme.js may overwrite live theme settings from preview storage")

    # applyShareMeta must not clobber "Page · Brand" titles
    if "Keep page titles like" in js or (
        "/ · /".replace(" ", "") in js.replace(" ", "") and "replace(/Aligna|Sattva|Valtora" in js
    ):
        ok("applyShareMeta preserves Page · Brand titles")
    else:
        # structural check
        m = re.search(r"function applyShareMeta\([\s\S]*?\n  \}", js)
        chunk = m.group(0) if m else ""
        if " · " in chunk and "replace(/Aligna|Sattva|Valtora" in chunk:
            ok("applyShareMeta preserves Page · Brand titles")
        elif "titleEl.textContent = site" in chunk and "/ · /" not in chunk.replace(" ", ""):
            bad("applyShareMeta still overwrites all matching titles with site name")
        else:
            ok("applyShareMeta title handling present")

    # Preview/theme.js parity for brand chrome helpers
    for needle in (
        "initPreviewAnnouncement",
        "initPreviewClaimToggles",
        "isPreviewHost",
        "brand-boot",
    ):
        # brand-boot is a separate file
        if needle == "brand-boot":
            continue
        if needle not in js:
            bad(f"preview/theme.js missing {needle}")
        else:
            ok(f"preview/theme.js has {needle}")

    theme_js_text = theme_js.read_text(encoding="utf-8", errors="replace")
    if "function homeSectionHref" in js and "function homeRootHref" in js:
        ok("preview/theme.js homeSectionHref prefers routes.root")
    else:
        bad("preview/theme.js missing homeSectionHref (Shopify /pages/ 404s on ../index.html)")
    if "function homeSectionHref" in theme_js_text and "function homeRootHref" in theme_js_text:
        ok("theme.js homeSectionHref prefers routes.root")
    else:
        bad("theme.js missing homeSectionHref (Shopify /pages/ 404s on ../index.html)")
    header_liquid = (ROOT / "valtora-theme" / "sections" / "header.liquid").read_text(encoding="utf-8")
    if "home_hash" in header_liquid and "home-section-href" in header_liquid:
        ok("header.liquid prefixes homepage hashes off index")
    else:
        bad("header.liquid still uses bare in-page hashes on inner pages")
    if re.search(r'<a href="\{\{\s*home_hash\s*\}\}#reserve">Reserve</a>', header_liquid):
        bad("header.liquid fallback still includes Reserve as a nav item")
    elif "link_title_down == 'reserve'" in header_liquid or 'link_title_down == "reserve"' in header_liquid:
        ok("header.liquid omits Reserve from fallback and skips it in assigned menus")
    else:
        bad("header.liquid must skip Reserve when a Shopify menu still lists it")
    footer_liquid = (ROOT / "valtora-theme" / "sections" / "footer.liquid").read_text(encoding="utf-8")
    if "home_hash" in footer_liquid and "/pages/" in footer_liquid:
        ok("footer.liquid prefixes Explore hashes and keeps /pages/ policy URLs")
    else:
        bad("footer.liquid missing homepage hash prefix or /pages/ policy fallbacks")

    journal_fallback = "pages['journal'].url"
    if journal_fallback in header_liquid and "/pages/journal" in header_liquid:
        if "| default: '/blogs/journal'" in header_liquid or '| default: "/blogs/journal"' in header_liquid:
            bad("header.liquid Journal still falls back to /blogs/journal")
        else:
            ok("header.liquid Journal prefers blog, then page, then /pages/journal")
    else:
        bad("header.liquid Journal missing pages['journal'] / /pages/journal fallback")
    if journal_fallback in footer_liquid and "/pages/journal" in footer_liquid:
        if "| default: '/blogs/journal'" in footer_liquid or '| default: "/blogs/journal"' in footer_liquid:
            bad("footer.liquid Journal still falls back to /blogs/journal")
        else:
            ok("footer.liquid Journal prefers blog, then page, then /pages/journal")
    else:
        bad("footer.liquid Journal missing pages['journal'] / /pages/journal fallback")
    journal_tpl = ROOT / "valtora-theme" / "templates" / "page.journal.json"
    journal_sec = ROOT / "valtora-theme" / "sections" / "main-journal.liquid"
    if journal_tpl.exists() and journal_sec.exists():
        ok("page.journal.json + main-journal.liquid present")
    else:
        bad("missing page.journal.json or main-journal.liquid")

    if "sec.classList.add('section--wipe')" in js or 'sec.classList.add("section--wipe")' in js:
        bad("preview/theme.js still applies section--wipe (clips Offer/Swap off-screen)")
    else:
        ok("preview/theme.js does not clip dark sections with section--wipe")
    if "sec.classList.add('section--wipe')" in theme_js_text or 'sec.classList.add("section--wipe")' in theme_js_text:
        bad("valtora-theme/assets/theme.js still applies section--wipe (clips Offer/Swap off-screen)")
    else:
        ok("theme.js does not clip dark sections with section--wipe")

    for rel in ("preview/base.css", "valtora-theme/assets/base.css"):
        css_text = (ROOT / rel).read_text(encoding="utf-8", errors="replace")
        if "inset(0 100% 0 0)" in css_text:
            bad(f"{rel}: wipe still clips sections to zero width")
        else:
            ok(f"{rel}: wipe does not clip sections")
        hide = re.search(
            r"html\.js-ready(?::not\(\.shopify-design-mode\))?\s+\[data-reveal-child\]:not\(\.is-visible\)\s*\{[^}]*opacity:\s*0",
            css_text,
        )
        if hide:
            ok(f"{rel}: storefront hides reveal children until visible")
        else:
            bad(f"{rel}: storefront reveal children are not hide-until-visible")
        if re.search(
            r"html\.shopify-design-mode[^{]*\{[^}]*opacity:\s*1",
            css_text,
        ):
            ok(f"{rel}: design-mode keeps reveal children visible")
        else:
            bad(f"{rel}: missing shopify-design-mode opacity 1 failsafe")

    for rel in ("preview/theme.js", "valtora-theme/assets/theme.js"):
        js_text = (ROOT / rel).read_text(encoding="utf-8", errors="replace")
        if re.search(r"setTimeout\(\s*showAll\s*,\s*900\s*\)", js_text):
            ok(f"{rel}: showAll failsafe present")
        else:
            bad(f"{rel}: missing ~900ms showAll failsafe")
        if "shopify-design-mode" in js_text and "designMode" in js_text:
            ok(f"{rel}: design-mode skips hide-until-visible")
        else:
            bad(f"{rel}: missing shopify-design-mode / designMode failsafe")

    theme_liquid = (ROOT / "valtora-theme" / "layout" / "theme.liquid").read_text(encoding="utf-8")
    if "request.design_mode" in theme_liquid and "shopify-design-mode" in theme_liquid:
        ok("theme.liquid marks shopify-design-mode on first paint")
    else:
        bad("theme.liquid missing request.design_mode class (editor can look empty)")

    if not (ROOT / "preview" / "brand-boot.js").exists():
        bad("preview/brand-boot.js missing")
    else:
        ok("preview/brand-boot.js exists")
        boot = (ROOT / "preview" / "brand-boot.js").read_text(encoding="utf-8", errors="replace")
        if "__valtoraApplyBrandFavicon" in boot and "brandInitials" in boot:
            ok("preview/brand-boot.js generates initials favicon")
        else:
            bad("preview/brand-boot.js missing initials favicon helper")
        if "data-brand-tagline" in boot and "valtoraPreviewTaglineMarket" in boot:
            ok("preview/brand-boot.js applies per-market tagline")
        else:
            bad("preview/brand-boot.js missing per-market tagline wiring")

    helper = ROOT / "valtora-theme" / "snippets" / "market-tagline.liquid"
    if helper.exists() and "|AL|" in helper.read_text(encoding="utf-8") and "brand_tagline_eu" in helper.read_text(
        encoding="utf-8"
    ):
        ok("market-tagline.liquid maps Europe including Albania")
    else:
        bad("market-tagline.liquid missing or does not include AL / Europe")

    home = (ROOT / "preview" / "index.html").read_text(encoding="utf-8", errors="replace")
    if 'data-brand-tagline' in home and 'value="us"' in home and 'value="eu"' in home:
        ok("preview homepage has tagline token and USA/Europe markets")
    else:
        bad("preview homepage missing data-brand-tagline or USA/Europe market options")
        if "wordmarkLine2" in boot and "--wordmark-line-2:" in boot:
            ok("preview/brand-boot.js injects wordmark line-2 colour")
        else:
            bad("preview/brand-boot.js missing wordmark line-2 colour token")

    for rel in ("preview/base.css", "valtora-theme/assets/base.css"):
        css_text = (ROOT / rel).read_text(encoding="utf-8", errors="replace")
        if "var(--wordmark-line-2" in css_text and "Single-colour lockup" not in css_text:
            ok(f"{rel}: wordmark line 2 uses --wordmark-line-2")
        else:
            bad(f"{rel}: wordmark line 2 still inherits name colour")



def check_cert_strip_empty_hidden() -> None:
    """Empty OEKO/chemicals strip must not leave hairlines (V1 restraint / V2 no empty chrome)."""
    css = (ROOT / "preview/base.css").read_text(encoding="utf-8", errors="ignore")
    js = (ROOT / "preview/theme.js").read_text(encoding="utf-8", errors="ignore")
    if ".cert-strip[hidden]" in css or ".cert-strip.is-empty" in css:
        ok("preview/base.css: empty .cert-strip hide rules present")
    else:
        bad("preview/base.css: missing empty .cert-strip hide rules")
    if "syncCertStripVisibility" in js:
        ok("preview/theme.js: syncCertStripVisibility present")
    else:
        bad("preview/theme.js: missing syncCertStripVisibility for claim toggles")


def check_funnel_chrome():
    """Thank-you / checkout / cart must carry brand chrome + footer."""
    for rel in (
        "preview/pages/order-confirmed.html",
        "preview/pages/checkout.html",
        "preview/pages/cart.html",
        "share/v4/pages/order-confirmed.html",
    ):
        p = ROOT / rel
        if not p.exists():
            continue
        t = p.read_text()
        if "site-footer" not in t:
            bad(f"{rel}: missing site-footer")
        else:
            ok(f"{rel}: site-footer present")
        if "data-valtora-brand-boot" not in t and "brand-boot.js" not in t:
            bad(f"{rel}: missing brand-boot")
        else:
            ok(f"{rel}: brand-boot present")
        # Hardcoded navy tokens in :root break scheme inheritance
        m = re.search(r":root\s*\{([\s\S]*?)\}", t)
        if m and "--brand-primary" in m.group(1):
            bad(f"{rel}: :root still hardcodes --brand-primary (use base.css schemes)")
        else:
            ok(f"{rel}: :root does not hardcode brand colours")


def _section_schema(liquid: Path) -> dict:
    text = liquid.read_text(encoding="utf-8")
    m = re.search(r"\{%\s*schema\s*%\}(.*?)\{%\s*endschema\s*%\}", text, re.S)
    if not m:
        return {}
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        return {}


def check_section_schemas_no_liquid() -> None:
    """Liquid inside {% schema %} makes Shopify drop the section, then drop index.json."""
    theme = ROOT / "valtora-theme"
    hits = []
    blank = []
    for path in sorted((theme / "sections").glob("*.liquid")):
        text = path.read_text(encoding="utf-8")
        m = re.search(r"\{%\s*schema\s*%\}(.*?)\{%\s*endschema\s*%\}", text, re.S)
        if m and "{{" in m.group(1):
            hits.append(path.name)
        if m:
            for mid in re.findall(
                r'"id"\s*:\s*"([^"]+)"[^}]*"default"\s*:\s*""',
                m.group(1),
                re.S,
            ):
                blank.append(f"{path.name}:{mid}")
    if hits:
        bad("Liquid inside section schema (Shopify drops the section): " + ", ".join(hits))
    else:
        ok("section schemas have no Liquid")
    if blank:
        bad("section schema blank default (Shopify rejects save): " + ", ".join(blank))
    else:
        ok("section schemas have no blank defaults")


def check_no_leaked_liquid() -> None:
    """A missing {% on a liquid block prints assign/if onto the storefront."""
    theme = ROOT / "valtora-theme"
    tag = re.compile(
        r"\{%-?.*?-%\}|\{%-?.*?%\}|\{\{-?.*?-\}\}|\{\{.*?\}\}",
        re.S,
    )
    leaks = []
    for folder in ("sections", "snippets", "layout"):
        d = theme / folder
        if not d.exists():
            continue
        for path in sorted(d.glob("*.liquid")):
            text = path.read_text(encoding="utf-8")
            text = re.sub(
                r"\{%-?\s*schema\s*-?%\}.*?\{%-?\s*endschema\s*-?%\}",
                "",
                text,
                flags=re.S | re.I,
            )
            text = re.sub(
                r"\{%-?\s*stylesheet\s*-?%\}.*?\{%-?\s*endstylesheet\s*-?%\}",
                "",
                text,
                flags=re.S | re.I,
            )
            text = re.sub(
                r"\{%-?\s*javascript\s*-?%\}.*?\{%-?\s*endjavascript\s*-?%\}",
                "",
                text,
                flags=re.S | re.I,
            )
            leftover = tag.sub("", text)
            if re.search(r"\bassign\s+\w+", leftover) or "-%}" in leftover:
                leaks.append(path.name)
    if leaks:
        bad("leaked Liquid (missing {% ): " + ", ".join(leaks))
    else:
        ok("no leaked Liquid assigns in sections/snippets/layout")


def check_no_filters_in_render_args() -> None:
    """Filters in {% render %} arguments make Shopify skip the whole section."""
    theme = ROOT / "valtora-theme"
    hits = []
    comment = re.compile(
        r"\{%-?\s*comment\s*-?%\}.*?\{%-?\s*endcomment\s*-?%\}",
        re.S | re.I,
    )
    render_tag = re.compile(r"\{%-?\s*render\b[\s\S]*?%\}")
    for folder in ("sections", "snippets", "layout"):
        d = theme / folder
        if not d.exists():
            continue
        for path in sorted(d.glob("*.liquid")):
            text = comment.sub("", path.read_text(encoding="utf-8"))
            for tag in render_tag.findall(text):
                if " | " in tag:
                    hits.append(path.name)
                    break
    if hits:
        bad("filter inside {% render %} (Shopify blanks the section): " + ", ".join(hits))
    else:
        ok("no filters inside {% render %} arguments")


def check_json_templates_uploadable() -> None:
    """Shopify silently drops JSON templates on zip upload if they fail platform checks."""
    theme = ROOT / "valtora-theme"
    templates = theme / "templates"
    sections_dir = theme / "sections"
    if not templates.exists():
        bad("valtora-theme/templates missing")
        return

    for path in sorted(templates.glob("*.json")):
        rel = path.relative_to(ROOT)
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            bad(f"{rel}: invalid JSON ({exc})")
            continue

        sections = data.get("sections")
        order = data.get("order")
        if not isinstance(sections, dict) or not isinstance(order, list):
            bad(f"{rel}: missing sections object or order list")
            continue
        if not order:
            bad(f"{rel}: empty order — Shopify drops the file on zip upload")
            continue
        if len(order) > 25:
            bad(f"{rel}: {len(order)} sections (Shopify max 25)")
        else:
            ok(f"{rel}: {len(order)} sections")

        orphaned = [k for k in sections if k not in order]
        missing = [k for k in order if k not in sections]
        if orphaned:
            bad(f"{rel}: sections not in order (Shopify drops file): {', '.join(orphaned)}")
        elif missing:
            bad(f"{rel}: order ids missing from sections: {', '.join(missing)}")
        else:
            ok(f"{rel}: sections match order")

        raw = path.read_text(encoding="utf-8")
        if "{{" in raw:
            bad(f"{rel}: contains Liquid {{{{ }}}} — zip upload treats this as a dynamic source and drops the file")

        for sid, section in sections.items():
            stype = section.get("type")
            liquid = sections_dir / f"{stype}.liquid"
            schema = _section_schema(liquid) if liquid.exists() else {}
            max_blocks = schema.get("max_blocks", 16)
            block_order = section.get("block_order") or []
            # Zip upload validates templates before section schemas apply, so
            # the platform default of 16 wins and Shopify silently drops the file.
            if len(block_order) > 16:
                bad(
                    f"{rel}: {sid} has {len(block_order)} blocks; "
                    "keep JSON at 16 or fewer so zip upload does not drop the template"
                )
            elif len(block_order) > max_blocks:
                bad(
                    f"{rel}: {sid} has {len(block_order)} blocks; "
                    f"{stype} max_blocks is {max_blocks} (Shopify drops file)"
                )


def main() -> int:
    print("Valtora consistency gate (preview + chrome)")
    print("----------------------------------------")

    check_theme_js()
    check_cert_strip_empty_hidden()
    check_funnel_chrome()
    check_section_schemas_no_liquid()
    check_no_leaked_liquid()
    check_no_filters_in_render_args()
    check_json_templates_uploadable()

    roots = [
        ROOT / "preview" / "pages",
        ROOT / "preview" / "blog",
        ROOT / "share" / "v4" / "pages",
        ROOT / "share" / "v4" / "blog",
    ]
    for folder in roots:
        if not folder.exists():
            bad(f"missing folder {folder.relative_to(ROOT)}")
            continue
        for path in sorted(folder.glob("*.html")):
            check_html(path, is_home=False)

    # Homepages
    for home in (ROOT / "preview" / "index.html", ROOT / "share" / "v4" / "index.html"):
        if home.exists():
            check_html(home, is_home=True)
        else:
            bad(f"missing {home.relative_to(ROOT)}")

    print("----------------------------------------")
    print(f"consistency: {PASS} passed, {FAIL} failed")
    return 1 if FAIL else 0


if __name__ == "__main__":
    sys.exit(main())
