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
        if path.name != "checkout.html" and (
            path.parent.name in ("pages", "blog") or "pages/" in str(rel) or "blog/" in str(rel)
        ):
            if "data-announcement-bar" not in text and 'class="announcement"' not in text:
                bad(f"{rel}: missing site announcement bar")
            else:
                ok(f"{rel}: announcement bar present")

    nav_chunk = re.search(r'<nav class="site-header__nav"[^>]*>([\s\S]*?)</nav>', text)
    if nav_chunk and re.search(r'>Reserve</a>', nav_chunk.group(1)):
        bad(f"{rel}: header nav still includes Reserve")
    elif nav_chunk:
        ok(f"{rel}: header nav omits Reserve")

    # Manufacturing is how the mattress is built. Not the founder story.
    if path.name == "manufacturing.html":
        brand_spans = len(re.findall(r"data-brand-text", text))
        if brand_spans < 2:
            bad(f"{rel}: manufacturing wordmarks under-tokenised (found {brand_spans} data-brand-text)")
        else:
            ok(f"{rel}: manufacturing brand tokens present ({brand_spans})")
        if "theme.js" not in text:
            bad(f"{rel}: manufacturing missing theme.js (theme settings will not apply)")
        if "preview/pages" in str(rel).replace("\\", "/"):
            if re.search(r"An ethos, not a catalogue find|started on the road", text):
                bad(f"{rel}: manufacturing still carries the old origin story (that belongs on About)")
            else:
                ok(f"{rel}: manufacturing does not carry the founder origin story")
            if "Wound, pocketed" not in text and "Assembled by hand" not in text:
                bad(f"{rel}: manufacturing missing the factory replacement copy")
            else:
                ok(f"{rel}: manufacturing uses factory how-it-is-built copy")
        if re.search(r'href="#(swap|specs|lifestyle|reserve|founder|faq|cool-touch|swap-video)"', text):
            bad(f"{rel}: homepage section links are in-page hashes (need homepage + hash)")
        else:
            ok(f"{rel}: homepage section links point off-page")
        if 'href="./large-sizes.html"' not in text or 'href="./order-status.html"' not in text:
            bad(f"{rel}: menu must use landing pages and /pages/…")
        else:
            ok(f"{rel}: menu uses landing pages + /pages/ URLs")
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
    if "privacy_link" in footer_liquid and "/pages/configure" in footer_liquid and ">Shop<" in footer_liquid:
        ok("footer.liquid has Shop / Help / Policies with /pages/ URLs")
    else:
        bad("footer.liquid missing Shop column or /pages/ policy fallbacks")

    journal_href = (ROOT / "valtora-theme" / "snippets" / "journal-index-href.liquid").read_text(
        encoding="utf-8"
    )
    if "journal-index-href" not in header_liquid:
        bad("header.liquid Journal must use journal-index-href")
    elif "| default: '/blogs/journal'" in header_liquid or '| default: "/blogs/journal"' in header_liquid:
        bad("header.liquid Journal still falls back to /blogs/journal")
    elif "articles_count" in journal_href and "pages['journal'].url" in journal_href and "/pages/journal" in journal_href:
        ok("Journal prefers a populated blog, then the journal page, then /pages/journal")
    else:
        bad("journal-index-href missing populated-blog-first resolution")
    if "all_products['the-mattress'].url" in header_liquid or "| default: '/products/the-mattress'" in header_liquid:
        bad("header.liquid The mattress still points at /products/the-mattress (unpublished SKU 404)")
    elif "specification_url" in header_liquid and "The mattress" in header_liquid:
        ok("header.liquid The mattress goes to specification")
    else:
        bad("header.liquid The mattress missing specification destination")
    if "pages['journal'].url" in footer_liquid and "/pages/journal" in footer_liquid:
        if "| default: '/blogs/journal'" in footer_liquid or '| default: "/blogs/journal"' in footer_liquid:
            bad("footer.liquid Journal still falls back to /blogs/journal")
        else:
            ok("footer.liquid Journal prefers blog, then page, then /pages/journal")
    else:
        ok("footer.liquid Journal lives in the header menu, not the footer")
    journal_tpl = ROOT / "valtora-theme" / "templates" / "page.journal.json"
    journal_sec = ROOT / "valtora-theme" / "sections" / "main-journal.liquid"
    journal_body = ROOT / "valtora-theme" / "snippets" / "journal-article-body.liquid"
    journal_index = ROOT / "valtora-theme" / "snippets" / "journal-baked-index.liquid"
    if journal_tpl.exists() and journal_sec.exists():
        ok("page.journal.json + main-journal.liquid present")
    else:
        bad("missing page.journal.json or main-journal.liquid")
    if "journal-baked-index" not in journal_sec.read_text(encoding="utf-8"):
        bad("main-journal.liquid must render baked Journal notes")
    elif "New notes, in time" in journal_sec.read_text(encoding="utf-8"):
        bad("main-journal.liquid still uses the empty-state copy instead of baked notes")
    else:
        ok("main-journal.liquid renders baked Journal notes")
    journal_handles = (
        "how-to-choose-a-mattress",
        "mattress-firmness-guide",
        "cooler-sleep-and-mattress-materials",
        "mattress-support-and-back-comfort",
        "when-to-replace-a-mattress",
        "hybrid-vs-foam-vs-innerspring",
    )
    body_text = journal_body.read_text(encoding="utf-8") if journal_body.exists() else ""
    index_text = journal_index.read_text(encoding="utf-8") if journal_index.exists() else ""
    if journal_body.exists() and journal_index.exists():
        ok("journal-article-body.liquid + journal-baked-index.liquid present")
    else:
        bad("missing baked Journal snippets")
    for handle in journal_handles:
        article_tpl = ROOT / "valtora-theme" / "templates" / f"page.{handle}.json"
        if handle in body_text and handle in index_text and article_tpl.exists():
            ok(f"Journal note present: {handle}")
        else:
            bad(f"Journal note missing from theme: {handle}")
    journal_author = ROOT / "valtora-theme" / "snippets" / "journal-author.liquid"
    journal_layout = ROOT / "valtora-theme" / "snippets" / "journal-article-layout.liquid"
    main_page = ROOT / "valtora-theme" / "sections" / "main-page.liquid"
    main_blog = ROOT / "valtora-theme" / "sections" / "main-blog.liquid"
    author_text = journal_author.read_text(encoding="utf-8") if journal_author.exists() else ""
    layout_text = journal_layout.read_text(encoding="utf-8") if journal_layout.exists() else ""
    if "Ben Acolatse" in author_text and "CEO" in author_text:
        ok("Journal byline is Ben Acolatse, CEO")
    else:
        bad("Journal byline missing Ben Acolatse, CEO")
    if "journal-author" in layout_text and "Ben Acolatse, CEO" in index_text:
        ok("Journal cards and article chrome use the CEO byline")
    else:
        bad("Journal cards or article chrome missing CEO byline")
    page_text = main_page.read_text(encoding="utf-8") if main_page.exists() else ""
    if "page.handle == 'journal'" in page_text and "journal-baked-index" in page_text:
        ok("Default page template still lists Journal notes when handle is journal")
    else:
        bad("main-page.liquid must list baked Journal notes for handle journal")
    blog_text = main_blog.read_text(encoding="utf-8") if main_blog.exists() else ""
    if "blog.handle == 'journal'" in blog_text and "journal-baked-index" in blog_text:
        ok("Journal blog index always includes baked notes")
    else:
        bad("main-blog.liquid must always render baked Journal notes for handle journal")
    checkout_paths = (
        ROOT / "valtora-theme" / "sections" / "main-checkout.liquid",
        ROOT / "valtora-theme" / "templates" / "page.checkout.json",
        ROOT / "preview" / "pages" / "checkout.html",
    )
    if all(path.exists() for path in checkout_paths):
        ok("checkout files present and not required by Journal")
    else:
        bad("checkout files missing")

    for rel, js_text in (("preview/theme.js", js), ("valtora-theme/assets/theme.js", theme_js_text)):
        if "is-wiping" in js_text and "is-wiped" in js_text and "shopify-design-mode" in js_text:
            ok(f"{rel}: wipe plays once then clears clip")
        else:
            bad(f"{rel}: wipe must use is-wiping / is-wiped and skip design mode")
        if re.search(r"\.style\.clipPath\s*=", js_text) or 'inset(0 100%' in js_text:
            bad(f"{rel}: wipe must not set a resting clip-path")
        else:
            ok(f"{rel}: wipe does not set a resting clip-path")

    for rel in ("preview/base.css", "valtora-theme/assets/base.css"):
        css_text = (ROOT / rel).read_text(encoding="utf-8", errors="replace")
        if "--ease: cubic-bezier(0.22, 1, 0.36, 1)" not in css_text:
            bad(f"{rel}: --ease must be cubic-bezier(0.22, 1, 0.36, 1)")
        else:
            ok(f"{rel}: one --ease curve 0.22, 1, 0.36, 1")
        leftover_ease = re.findall(
            r"animation:\s*(?:revealRise|revealFirstPaint|heroRise|heroMediaIn|sectionWipe)\s+[^;]+",
            css_text,
        )
        bad_named = [
            decl
            for decl in leftover_ease
            if "var(--ease)" not in decl
            or re.search(r"\bease-out\b|\bease-in\b|\blinear\b|(?<!var\(--)\bease\b", decl)
        ]
        if leftover_ease and not bad_named:
            ok(f"{rel}: reveal/wipe/hero load use var(--ease)")
        else:
            bad(f"{rel}: reveal/wipe/hero load must use var(--ease), not named easing: {bad_named}")
        if re.search(r"(?<![\w-])ease-out(?![\w-])", css_text):
            bad(f"{rel}: leftover ease-out (second curve)")
        else:
            ok(f"{rel}: no leftover ease-out")
        if "@keyframes sectionWipe" not in css_text or "var(--dur-wipe)" not in css_text:
            bad(f"{rel}: missing 600ms sectionWipe")
        else:
            ok(f"{rel}: sectionWipe uses --dur-wipe")
        if re.search(r"\.section--wipe\s*\{[^}]*clip-path:\s*none", css_text):
            ok(f"{rel}: wipe resting state is visible")
        else:
            bad(f"{rel}: .section--wipe must rest at clip-path: none")
        stripped = re.sub(r"@keyframes\s+\w+\s*\{(?:[^{}]|\{[^{}]*\})*\}", "", css_text)
        if "inset(0 100% 0 0)" in stripped:
            bad(f"{rel}: wipe still clips sections to zero width at rest")
        else:
            ok(f"{rel}: wipe clip lives only inside keyframes")
        hide = re.search(
            r"html\.js-ready(?::not\(\.shopify-design-mode\))?\s+\[data-reveal-child\]:not\(\.is-visible\)(?::not\(\[data-reveal-first\]\))?\s*\{[^}]*opacity:\s*0",
            css_text,
        )
        if hide:
            ok(f"{rel}: storefront hides reveal children until visible")
        else:
            bad(f"{rel}: storefront reveal children are not hide-until-visible")
        first_paint = re.search(
            r"@keyframes\s+revealFirstPaint\s*\{.*?from\s*\{([^}]*)\}",
            css_text,
            re.S,
        )
        if first_paint and re.search(r"opacity:\s*1", first_paint.group(1)):
            ok(f"{rel}: first-paint reveal starts visible (LCP)")
        else:
            bad(f"{rel}: revealFirstPaint must start at opacity 1 so LCP is not delayed")
        if re.search(
            r"html:not\(\.shopify-design-mode\)\s+\[data-reveal-first\]\s*\{[^}]*revealFirstPaint",
            css_text,
        ):
            ok(f"{rel}: hero first-paint uses revealFirstPaint")
        else:
            bad(f"{rel}: [data-reveal-first] must use revealFirstPaint, not hide-from-0")
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
    if "display=swap" in theme_liquid and "Instrument+Sans" in theme_liquid and "family=Inter" in theme_liquid and "Geist+Mono" in theme_liquid:
        ok("theme.liquid loads Instrument Sans + Inter + Geist Mono with display=swap")
    else:
        bad("theme.liquid must load guideline fonts once (Instrument Sans, Inter, Geist Mono)")
    if "fonts.gstatic.com/s/outfit/" in theme_liquid or "family=Outfit" in theme_liquid or "Fraunces" in theme_liquid:
        bad("theme.liquid must not load Outfit or Fraunces")
    else:
        ok("theme.liquid does not load competing Outfit/Fraunces")
    hero_liquid = (ROOT / "valtora-theme" / "sections" / "hero.liquid").read_text(encoding="utf-8")
    if "fetchpriority: 'high'" in hero_liquid and "loading: 'eager'" in hero_liquid:
        ok("hero.liquid LCP image is eager + fetchpriority high")
    else:
        bad("hero.liquid must pass loading eager and fetchpriority high")
    if re.search(r"loading\s*[:=]\s*['\"]lazy['\"]", hero_liquid):
        bad("hero.liquid must not lazy-load the LCP image")
    else:
        ok("hero.liquid does not lazy-load the hero image")

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


def check_size_picker_chrome() -> None:
    """Choose-your-size must stay one card system — not two random skins."""
    css_files = (
        ROOT / "valtora-theme" / "assets" / "base.css",
        ROOT / "preview" / "base.css",
    )
    for path in css_files:
        if not path.exists():
            bad(f"{path.relative_to(ROOT)}: missing")
            continue
        text = path.read_text(encoding="utf-8")
        start = text.find("/* Size picker:")
        if start < 0:
            start = text.find(".size-list,")
        end = text.find(".size-markets")
        block = text[start:end] if start >= 0 and end > start else ""
        rel = str(path.relative_to(ROOT))
        if ".size-row" not in block:
            bad(f"{rel}: emptied .size-row CSS")
        else:
            ok(f"{rel}: .size-row rules present")
        if re.search(r"\.size-option,\s*\.size-row", block):
            ok(f"{rel}: size-option and size-row share one card class")
        else:
            bad(f"{rel}: size cards do not share one base class")
        if re.search(
            r"\.size-option\.is-in-basket[^{]*\{[^}]*background:\s*var\(--brand-surface\)",
            block,
        ):
            bad(f"{rel}: selected cards still use beige leftover")
        else:
            ok(f"{rel}: selected state is not beige leftover")
        add = re.search(r"\.size-option__add,\s*\.size-row__add\s*\{([^}]+)\}", block, re.S)
        if add and "margin-inline: auto" in add.group(1) and "align-self: center" in add.group(1):
            ok(f"{rel}: ADD is centred, not corner-jammed")
        else:
            bad(f"{rel}: ADD/qty control is corner-jammed")
        if "last-child:nth-child(odd)" in block and "grid-column: 1 / -1" in block:
            ok(f"{rel}: last odd size cell spans/centres (no Emperor hole)")
        else:
            bad(f"{rel}: last odd cell still leaves a grid hole")
        if re.search(
            r"\.(size-option|size-row|size-guide-tile)[^{:/]*\{[^}]*aspect-ratio:\s*1\s*/\s*1",
            text,
        ):
            bad(f"{rel}: 1:1 grey placeholder squares on size tiles")
        else:
            ok(f"{rel}: no 1:1 grey dummy squares on size-option/size-row/size-guide-tile")
        if (
            ".size-guide-tile__shape" in text
            or ".size-guide-tile__plan" in text
            or ".size-guide-tile__bed" in text
        ):
            bad(f"{rel}: size-guide still has dummy bed/plan boxes")
        else:
            ok(f"{rel}: size-guide tiles have no dummy bed boxes")
        if "--field-fill:" in text and "--field-line:" in text and "var(--field-fill" in text:
            ok(f"{rel}: size-note keeps distinct fill/border")
        else:
            bad(f"{rel}: size-note contrast tokens missing")

    for rel in ("preview/theme.js", "valtora-theme/assets/theme.js"):
        js_text = (ROOT / rel).read_text(encoding="utf-8")
        if 'class="size-option' in js_text and "size-option__add" in js_text:
            ok(f"{rel}: tiles use shared size-option class + ADD")
        else:
            bad(f"{rel}: tiles missing shared size-option class")
        if (
            "size-option__media" in js_text
            or "size-option__bed" in js_text
            or "size-guide-tile__shape" in js_text
            or "size-guide-tile__plan" in js_text
            or "size-guide-tile__bed" in js_text
        ):
            bad(f"{rel}: grey dummy image boxes returned to size tiles")
        else:
            ok(f"{rel}: size tiles have no dummy image boxes")
        if "european-king" in js_text and "160 × 200 cm" in js_text:
            ok(f"{rel}: European King 160 × 200 cm present")
        else:
            bad(f"{rel}: European King 160 × 200 cm missing")
        if (
            "filterCatalogRows" in js_text
            and "var sizes = [];" in js_text
            and "existingQty + 1" in js_text
            and "if (!tokens.length) return true" not in js_text
        ):
            ok(f"{rel}: picker paints Market Shown catalog (no SIZE_MAPS ceiling, blank is not all 18)")
        else:
            bad(f"{rel}: picker hardcodes a size count instead of Shopify rows")


def check_funnel_chrome():
    """Thank-you / checkout / cart must carry brand chrome + footer."""
    for rel in (
        "preview/pages/order-confirmed.html",
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

    for rel in (
        "preview/pages/large-sizes.html",
        "preview/pages/european-king.html",
        "preview/pages/what-it-buys.html",
        "preview/pages/cooling.html",
        "preview/pages/split-king.html",
    ):
        p = ROOT / rel
        if not p.exists():
            bad(f"{rel}: missing")
            continue
        t = p.read_text(encoding="utf-8")
        if "data-lp-sizes" in t and "data-size-note" in t:
            ok(f"{rel}: landing size tiles + note")
        else:
            bad(f"{rel}: landing size selector missing tiles or note")
    funnel = (ROOT / "valtora-theme" / "sections" / "landing-funnel.liquid").read_text(encoding="utf-8")
    if "data-lp-sizes" in funnel and "size-list" in funnel:
        ok("landing-funnel.liquid has tile size selector")
    else:
        bad("landing-funnel.liquid missing tile size selector")
    if "data-size-pick" in funnel:
        ok("landing-funnel.liquid keeps data-size-pick")
    else:
        bad("landing-funnel.liquid missing data-size-pick")
    if "size-rows" in funnel:
        bad("landing-funnel.liquid reintroduced size-rows markup")
    else:
        ok("landing-funnel.liquid does not use size-rows markup")
    for rel in ("preview/theme.js", "valtora-theme/assets/theme.js"):
        js_text = (ROOT / rel).read_text(encoding="utf-8")
        if "function shopifyCartAddUrl" in js_text and "function addLandingToShopify" in js_text:
            ok(f"{rel}: posts landing add to Shopify cart")
        else:
            bad(f"{rel}: landing add must POST /cart/add.js")
    check_size_picker_chrome()


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


def check_warranty_years_setting() -> None:
    """Theme settings → Warranty years must drive storefront + preview copy."""
    schema = (ROOT / "valtora-theme" / "config" / "settings_schema.json").read_text(encoding="utf-8")
    if '"id": "warranty_years"' in schema and '"label": "Warranty years"' in schema:
        ok("settings_schema.json has Warranty years")
    else:
        bad("settings_schema.json missing labelled warranty_years setting")
    if "including T&Cs" in schema or "including T&Cs" in schema.replace("and", "&"):
        ok("warranty_years info mentions T&Cs")
    elif "T&Cs" in schema or "T&C" in schema:
        ok("warranty_years info mentions T&Cs")
    else:
        bad("warranty_years info must say it is used in T&Cs")
    if '"default": "25"' in schema:
        ok("warranty_years schema default is 25")
    else:
        bad("warranty_years schema default must be 25")

    data = json.loads((ROOT / "valtora-theme" / "config" / "settings_data.json").read_text(encoding="utf-8"))
    current = (data.get("current") or {}).get("warranty_years")
    if str(current) == "25":
        ok("settings_data.json warranty_years is 25")
    else:
        bad(f"settings_data.json warranty_years is {current!r}, expected '25'")

    snippet = ROOT / "valtora-theme" / "snippets" / "warranty-tokens.liquid"
    if snippet.exists() and "[X]" in snippet.read_text(encoding="utf-8"):
        ok("snippets/warranty-tokens.liquid resolves [X]")
    else:
        bad("missing snippets/warranty-tokens.liquid")

    theme_liquid = (ROOT / "valtora-theme" / "layout" / "theme.liquid").read_text(encoding="utf-8")
    if "data-warranty-years=" in theme_liquid and "settings.warranty_years" in theme_liquid:
        ok("theme.liquid emits data-warranty-years from the setting")
    else:
        bad("theme.liquid must set data-warranty-years from settings.warranty_years")

    surfaces = {
        "sections/hero.liquid": ("warranty-tokens", "settings.warranty_years"),
        "sections/offer.liquid": ("warranty-tokens",),
        "sections/trust-bar.liquid": ("warranty-tokens",),
        "sections/faq.liquid": ("warranty-tokens",),
        "sections/trust-policy.liquid": ("warranty-tokens",),
        "sections/main-cart.liquid": ("settings.warranty_years",),
        "snippets/reserve-stage-b.liquid": ("warranty-tokens", "settings.warranty_years"),
        "sections/size-reserve.liquid": ("[X]-year warranty",),
    }
    for rel, needles in surfaces.items():
        text = (ROOT / "valtora-theme" / rel).read_text(encoding="utf-8")
        if all(n in text for n in needles):
            ok(f"{rel} reads the warranty setting")
        else:
            bad(f"{rel} must interpolate Theme settings → Warranty years ({needles})")

    year_phrase = re.compile(r"(?:15|25)-year")
    for path in (ROOT / "valtora-theme" / "templates").glob("*.json"):
        raw = path.read_text(encoding="utf-8")
        if year_phrase.search(raw):
            bad(f"{path.relative_to(ROOT)} hardcodes 15/25-year (use [X] or a blank override)")
        else:
            ok(f"{path.relative_to(ROOT)} has no hardcoded warranty years")

    boot = (ROOT / "preview" / "brand-boot.js").read_text(encoding="utf-8")
    if "PREVIEW_WARRANTY_YEARS" in boot and "data-warranty-years-text" in boot:
        ok("preview/brand-boot.js hydrates data-warranty-years-text")
    else:
        bad("preview/brand-boot.js must apply warranty years from data-warranty-years")

    for rel in (
        "preview/index.html",
        "preview/pages/cart.html",
        "preview/pages/checkout.html",
        "preview/pages/warranty.html",
    ):
        html = (ROOT / rel).read_text(encoding="utf-8")
        if 'data-warranty-years="25"' not in html.split(">", 1)[0] and "data-warranty-years=" not in html[:400]:
            bad(f"{rel} missing data-warranty-years on <html>")
        elif "data-warranty-years-text" not in html:
            bad(f"{rel} warranty copy must use data-warranty-years-text")
        elif year_phrase.search(html):
            bad(f"{rel} still has a hardcoded 15/25-year warranty string")
        else:
            ok(f"{rel} warranty years come from data-warranty-years")


def check_trade_page() -> None:
    """Trade page reply window comes from Theme settings, not one working day."""
    schema = (ROOT / "valtora-theme" / "config" / "settings_schema.json").read_text(encoding="utf-8")
    if '"id": "trade_email"' in schema and '"id": "reply_working_days"' in schema:
        ok("settings_schema.json has trade_email and reply_working_days")
    else:
        bad("settings_schema.json missing trade_email or reply_working_days")

    data = json.loads((ROOT / "valtora-theme" / "config" / "settings_data.json").read_text(encoding="utf-8"))
    current = data.get("current") or {}
    if int(current.get("reply_working_days") or 0) == 5:
        ok("settings_data.json reply_working_days is 5")
    else:
        bad(f"settings_data.json reply_working_days is {current.get('reply_working_days')!r}, expected 5")
    if current.get("trade_email"):
        ok("settings_data.json has trade_email")
    else:
        bad("settings_data.json missing trade_email")

    snippet = ROOT / "valtora-theme" / "snippets" / "reply-tokens.liquid"
    if snippet.exists() and "[D-reply]" in snippet.read_text(encoding="utf-8"):
        ok("snippets/reply-tokens.liquid resolves [D-reply]")
    else:
        bad("missing snippets/reply-tokens.liquid")

    tpl = ROOT / "valtora-theme" / "templates" / "page.trade.json"
    if not tpl.exists():
        bad("missing templates/page.trade.json")
        return
    raw = tpl.read_text(encoding="utf-8")
    if "[D-reply]" in raw and "one working day" not in raw:
        ok("page.trade.json uses [D-reply] and not one working day")
    else:
        bad("page.trade.json must use [D-reply] and must not say one working day")

    preview = ROOT / "preview" / "pages" / "trade.html"
    if not preview.exists():
        bad("missing preview/pages/trade.html")
        return
    html = preview.read_text(encoding="utf-8")
    if "within 5 working days, approximately" not in html:
        bad("preview/pages/trade.html missing 5 working days copy")
    elif "one working day" in html:
        bad("preview/pages/trade.html still says one working day")
    elif 'data-trade-enquiry="contact"' not in html or 'data-trade-enquiry="footer"' not in html:
        bad("preview/pages/trade.html missing trade_enquiry_click hooks")
    elif ">Trade</a>" not in html:
        bad("preview/pages/trade.html missing Trade in the header")
    else:
        ok("preview/pages/trade.html has 5-day replies, Trade nav, and enquiry tracking")

    header = (ROOT / "valtora-theme" / "sections" / "header.liquid").read_text(encoding="utf-8")
    footer = (ROOT / "valtora-theme" / "sections" / "footer.liquid").read_text(encoding="utf-8")
    if "pages['trade']" in header and ">Trade</a>" in header:
        ok("header.liquid includes Trade in desktop and mobile nav")
    else:
        bad("header.liquid must include Trade")
    if "Trade and contract" in footer:
        ok("footer.liquid includes Trade and contract")
    else:
        bad("footer.liquid must include Trade and contract")


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


def check_reserve_cta_copy() -> None:
    """Shopper CTAs say Reserve yours, not Configure yours. Routes/titles stay /pages/configure."""
    skip_names = {
        "main-checkout.liquid",
        "main-cart.liquid",
        "page.checkout.json",
        "checkout.html",
    }
    cta_re = re.compile(
        r">(Configure yours|Configure your size|Configure)</",
        re.I,
    )
    label_re = re.compile(
        r'"(?:cta_label|reserve_label|default)"\s*:\s*"(Configure yours|Configure your size)"',
        re.I,
    )
    assign_re = re.compile(
        r"reserve_label\s*=\s*'(Configure yours|Configure your size)'",
        re.I,
    )
    roots = [
        ROOT / "valtora-theme",
        ROOT / "preview",
        ROOT / "scripts" / "finish-numa-preview.py",
    ]
    kicker_re = re.compile(
        r'"(?:kicker|eyebrow)"\s*:\s*"Configure(?: yours)?"',
        re.I,
    )
    eyebrow_re = re.compile(
        r'section__eyebrow[^>]*>Configure(?: yours)?<',
        re.I,
    )
    hits: list[str] = []
    files: list[Path] = []
    for root in roots:
        if root.is_file():
            files.append(root)
            continue
        files.extend(root.rglob("*.liquid"))
        files.extend(root.rglob("*.json"))
        files.extend(root.rglob("*.html"))
        files.extend(root.rglob("*.py"))
    for path in files:
        if path.name in skip_names:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        rel = path.relative_to(ROOT)
        for i, line in enumerate(text.splitlines(), 1):
            if (
                cta_re.search(line)
                or label_re.search(line)
                or assign_re.search(line)
                or kicker_re.search(line)
                or eyebrow_re.search(line)
            ):
                hits.append(f"{rel}:{i}")
    if hits:
        bad("shopper CTA still says Configure: " + "; ".join(hits[:8]))
    else:
        ok("shopper CTAs use Reserve yours, not Configure yours")
    header = (ROOT / "valtora-theme" / "sections" / "header.liquid").read_text(encoding="utf-8")
    if "assign reserve_label = 'Reserve yours'" in header:
        ok("header.liquid landing CTAs say Reserve yours")
    else:
        bad("header.liquid landing reserve_label must be Reserve yours")
    funnel = (ROOT / "valtora-theme" / "sections" / "landing-funnel.liquid").read_text(encoding="utf-8")
    if '"default": "Reserve yours"' in funnel:
        ok("landing-funnel CTA default is Reserve yours")
    else:
        bad("landing-funnel.liquid cta_label default must be Reserve yours")


def check_mobile_overflow_and_dark_lock() -> None:
    """390px overflow, Cool Touch snow, no cyan outlines, sticky flush, baked Journal."""
    css_files = (
        ROOT / "valtora-theme" / "assets" / "base.css",
        ROOT / "preview" / "base.css",
    )
    for path in css_files:
        text = path.read_text(encoding="utf-8")
        rel = str(path.relative_to(ROOT))
        if re.search(
            r"@media \(max-width:\s*899px\)[\s\S]{0,5000}?\.hero(?:--light)? h1[^{]*\{[^}]*(?:max-width:\s*100%|clamp\()",
            text,
        ):
            ok(f"{rel}: hero h1 clamp/max-width 100% under 899px")
        else:
            bad(f"{rel}: hero h1 missing clamp or max-width 100% under 899px")
        if re.search(r"\.announcement(?: p)?[^{]*\{[^}]*white-space:\s*normal", text, re.S):
            ok(f"{rel}: announcement wraps")
        else:
            bad(f"{rel}: announcement does not wrap")
        if "#cool-touch.section--dark .cool-touch__points span" in text and (
            "color: var(--brand-on-dark) !important" in text
        ):
            ok(f"{rel}: Cool Touch spans are on-dark")
        else:
            bad(f"{rel}: Cool Touch spans missing on-dark lock")
        if "bottom: 0 !important" in text and ".float-basket" in text:
            ok(f"{rel}: sticky basket is bottom: 0")
        else:
            bad(f"{rel}: sticky basket not pinned to bottom: 0")
        stripped = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
        if re.search(r"outline:\s*1px solid cyan", stripped, re.I) or re.search(
            r"\*\s*\{[^}]*outline:\s*[^}]*cyan", stripped, re.I
        ):
            bad(f"{rel}: cyan debug outline present")
        else:
            ok(f"{rel}: no * outline cyan")
    journal = ROOT / "valtora-theme" / "sections" / "journal-home.liquid"
    if journal.exists():
        bad("journal-home.liquid is present; Journal must stay off the homepage")
    else:
        ok("journal-home.liquid absent (Journal off homepage)")
    main_blog = ROOT / "valtora-theme" / "sections" / "main-blog.liquid"
    if main_blog.exists() and "journal-baked-index" in main_blog.read_text(encoding="utf-8"):
        ok("main-blog.liquid still renders baked notes")
    else:
        bad("main-blog.liquid missing baked index")


def check_redesign() -> None:
    spec = ROOT / "preview" / "pages" / "specification.html"
    mfg = ROOT / "preview" / "pages" / "manufacturing.html"
    css = (ROOT / "valtora-theme" / "assets" / "redesign.css").read_text(encoding="utf-8")
    js = (ROOT / "valtora-theme" / "assets" / "theme.js").read_text(encoding="utf-8")
    spec_text = spec.read_text(encoding="utf-8") if spec.exists() else ""
    mfg_text = mfg.read_text(encoding="utf-8") if mfg.exists() else ""

    layers = re.findall(r'data-rd-layer="(0[1-8])"', spec_text)
    if layers == [f"{i:02d}" for i in range(1, 9)]:
        ok("specification has eight spec_layer_view markers in order")
    else:
        bad(f"specification layer markers {layers}")

    if 'class="layer-benefit"' in spec_text and "Air moves sideways through those channels" in spec_text:
        ok("specification layer-benefit contrast copy present")
    else:
        bad("specification missing layer-benefit copy")

    videos = re.findall(r"<video[^>]*>", mfg_text)
    if len(videos) >= 2 and all("preload=\"none\"" in v and " src=" not in v for v in videos):
        ok("manufacturing videos use preload=none without src (E4)")
    else:
        bad("manufacturing videos must be preload=none with data-src only")

    if "prefers-reduced-motion: reduce" in css and ".rd .reveal" in css:
        ok("redesign .reveal respects prefers-reduced-motion (E6)")
    else:
        bad("redesign.css must keep .reveal motion inside prefers-reduced-motion")

    for event in ("spec_layer_view", "spec_scroll_complete", "video_start", "video_complete", "media_gallery_view"):
        if f"'{event}'" in js or f'"{event}"' in js:
            ok(f"theme.js fires {event}")
        else:
            bad(f"theme.js missing {event}")

    if "pageHasScrolled" in js and "videoQueue" in js:
        ok("factory videos wait for scroll before setting src (E4)")
    else:
        bad("theme.js must not set factory video src until the visitor scrolls")

    rd_img = (ROOT / "valtora-theme" / "snippets" / "rd-img.liquid").read_text(encoding="utf-8")
    if re.search(r"\|\s*asset_img_url", rd_img):
        bad("rd-img.liquid must not use asset_img_url on theme WebP (srcset 404s)")
    elif "asset_url" in rd_img:
        ok("rd-img.liquid serves theme assets with asset_url")
    else:
        bad("rd-img.liquid missing asset_url fallback")

    if "rootMargin: '-40px'" in js or 'rootMargin: "-40px"' in js:
        ok("redesign observer uses rootMargin -40px")
    else:
        bad("redesign observer must use rootMargin -40px")

    assets = [
        "coolknit-macro.webp",
        "product-floating.webp",
        "spring.mp4",
        "compression.mp4",
        "spring-poster.webp",
    ]
    for name in assets:
        theme_file = ROOT / "valtora-theme" / "assets" / name
        preview_file = ROOT / "preview" / "assets" / ("video" if name.endswith(".mp4") or "poster" in name else "img") / name
        if name.endswith(".mp4") or name.endswith("-poster.webp"):
            preview_file = ROOT / "preview" / "assets" / "video" / name
        if theme_file.exists() and preview_file.exists():
            ok(f"asset present: {name}")
        else:
            bad(f"missing asset {name}")

    if "Fifteen centimetres of comfort" in spec_text and "20cm" in spec_text:
        ok("specification states 20cm core / 15cm comfort")
    else:
        bad("specification figures must be 20cm core, 15cm comfort, 35cm total")


def main() -> int:
    print("Valtora consistency gate (preview + chrome)")
    print("----------------------------------------")

    check_theme_js()
    check_cert_strip_empty_hidden()
    check_funnel_chrome()
    check_reserve_cta_copy()
    check_mobile_overflow_and_dark_lock()
    check_section_schemas_no_liquid()
    check_no_leaked_liquid()
    check_no_filters_in_render_args()
    check_json_templates_uploadable()
    check_warranty_years_setting()
    check_trade_page()
    check_redesign()

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
