#!/usr/bin/env python3
"""Build the nine redesign preview pages from the supplied HTML, wrapped in live chrome."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PREVIEW = ROOT / "preview"
THEME_CSS = ROOT / "valtora-theme" / "assets" / "redesign.css"
SRC = Path("/tmp/numa-redesign")

DIMS = {
    "coolknit-corner.webp": (1400, 781),
    "coolknit-handle.webp": (1400, 781),
    "coolknit-macro.webp": (1400, 781),
    "coolknit-side.webp": (1400, 781),
    "cutout.webp": (1800, 1012),
    "product-floating-2.webp": (1400, 791),
    "product-floating.webp": (1600, 904),
    "product-plain-2.webp": (1600, 893),
    "product-plain.webp": (1376, 768),
    "product-profile.webp": (1400, 622),
    "quilt-edge.webp": (1400, 781),
    "quilt-macro-2.webp": (1400, 781),
    "quilt-macro.webp": (1400, 781),
    "room-calm.webp": (1400, 781),
    "room-city.webp": (1400, 781),
    "room-dark.webp": (1400, 781),
    "room-hotel-2.webp": (1400, 781),
    "room-hotel.webp": (1400, 781),
    "room-marble.webp": (1400, 781),
    "room-soft.webp": (1400, 781),
    "room-suite.webp": (1400, 781),
    "room-warm.webp": (1400, 787),
    "room-wide.webp": (1400, 781),
    "stack-sizes.webp": (1600, 893),
}

PAGES = {
    "c-specification.html": {
        "out": "specification.html",
        "title": "The specification · Numa",
        "description": "Thirty five centimetres, eight layers, each one doing a job. What is inside a Numa mattress and why it is there.",
        "body_class": "template-page-specification",
        "variant": "C-aspiration",
        "configure": False,
        "cta": "./configure.html",
    },
    "g-manufacturing.html": {
        "out": "manufacturing.html",
        "title": "How it is made · Numa",
        "description": "Pocket springs wound and pocketed, layers assembled by hand, then compressed and rolled.",
        "body_class": "template-page-manufacturing",
        "variant": "G-manufacturing",
        "configure": False,
        "cta": "./configure.html",
    },
    "f-about.html": {
        "out": "about.html",
        "title": "About · Numa",
        "description": "Numa was founded in 2026 because getting a mattress right takes months nobody has. So we carry that burden instead.",
        "body_class": "template-page-about",
        "variant": "F-about",
        "configure": False,
        "cta": "./configure.html",
        "keep_copy": True,
    },
    "h-support.html": {
        "out": "support.html",
        "title": "Mattresses for back pain and support · Numa",
        "description": "A seven-zone pocket spring core built for support, and a comfort layer tailored to you after you have slept on it.",
        "body_class": "template-page-support",
        "variant": "H-support",
        "configure": False,
        "cta": "./configure.html",
    },
    "a-large-sizes.html": {
        "out": "large-sizes.html",
        "title": "Emperor and Super King mattresses, made to order · Numa",
        "description": "Emperor is 200 x 200cm. Super King is 180 x 200. Made to order. You cannot know how a mattress feels in four minutes. The feel is decided after a year, not before.",
        "body_class": "template-page-large-sizes",
        "variant": "A-sizes",
        "configure": True,
        "preselect": "emperor",
        "cta": "#configure",
    },
    "b-european-king.html": {
        "out": "european-king.html",
        "title": "European King 160 x 200cm mattress · Numa",
        "description": "IKEA King is 160 by 200 centimetres. British King is 150. We make the first one, handmade to order.",
        "body_class": "template-page-european-king",
        "variant": "B-eurokingIKEA",
        "configure": True,
        "preselect": "european-king",
        "cta": "#configure",
    },
    "d-what-it-buys.html": {
        "out": "what-it-buys.html",
        "title": "What it buys · Numa",
        "description": "A seven-zone pocket spring core built to last twenty five years, a comfort layer tailored to you, and concierged delivery.",
        "body_class": "template-page-what-it-buys",
        "variant": "D-value",
        "configure": True,
        "preselect": "super-king",
        "cta": "#configure",
    },
    "i-cooling.html": {
        "out": "cooling.html",
        "title": "Cooler sleep · Numa",
        "description": "Heat sits in the top five centimetres. A pocket spring core is mostly air. The layer under you comes out.",
        "body_class": "template-page-cooling",
        "variant": "I-cooling",
        "configure": True,
        "preselect": "",
        "cta": "#configure",
    },
    "j-split-king.html": {
        "out": "split-king.html",
        "title": "Split King mattress · Numa",
        "description": "Two mattresses, linked. Each side supported on its own, each comfort layer tailored separately.",
        "body_class": "template-page-split-king",
        "variant": "J-splitKing",
        "configure": True,
        "preselect": "split-king",
        "cta": "#configure",
    },
}

NAV = """          <a href="./specification.html">The mattress</a>
          <a href="./manufacturing.html">How it is made</a>
          <a href="./support.html">Support</a>
          <a href="./about.html">About</a>
          <a href="./trade.html">Trade</a>"""

NAV_MOBILE = """                <a href="./specification.html">The mattress</a>
        <a href="./manufacturing.html">How it is made</a>
        <a href="./support.html">Support</a>
        <a href="./about.html">About</a>
        <a href="./trade.html">Trade</a>"""

FOOTER_SHOP = """            <ul>
              <li><a href="./configure.html">Reserve yours</a></li>
              <li><a href="./large-sizes.html">Large sizes</a></li>
              <li><a href="./european-king.html">European King</a></li>
              <li><a href="./split-king.html">Split King</a></li>
            </ul>"""

FOOTER_HELP = """            <ul>
              <li><a href="./size-guide.html">Size guide</a></li>
              <li><a href="./delivery.html">Delivery and lead time</a></li>
              <li><a href="./mattress-recycling.html">Old mattress removal and recycling</a></li>
              <li><a href="./support.html">Support</a></li>
              <li><a href="./about.html">About</a></li>
              <li><a href="./order-status.html">Order status</a></li>
              <li><a href="./contact.html">Contact</a></li>
              <li><a href="./trade.html">Trade and contract</a></li>
            </ul>"""

ABOUT_STORY = """
<section class="rd-sec"><div class="wrap"><div class="narrow story">
<p class="first">My family have bad backs. Several of them, across two generations, and I have listened to the same conversation for most of my adult life.</p>
<p>Someone would decide the mattress was the problem. A Saturday in a showroom, four minutes lying on a bed with their shoes off. They would choose something, it would arrive weeks later, and within a month they would know it was wrong.</p>
<p>Too firm. Or too soft, which they only worked out once their shoulder started aching. Or right for one of them and wrong for the other.</p>
<p>And no two of them wanted the same bed. The one that suited my father was the one my sister could not sleep on.</p>
<p>And then they kept it. Eight years. Sometimes ten.</p>
<p>Not because they were stubborn. Because the alternative was hopeless. To actually get it right you would have to sleep on a mattress for thirty nights to know, then send it back, then wait for another, then sleep on that one for thirty nights. Months of it. A part-time job with no guarantee at the end, carried out in the one place you go to stop working.</p>
<div class="pull"><p>The whole burden of getting it right sits with the person who knows least, at the moment they know least.</p></div>
<p>So they do what anyone would. They accept the first one, tell themselves it will settle, and quietly stop mentioning their back.</p>
<p>That is the part I could not leave alone. Not that the mattress was wrong, but that being wrong was treated as the customer&rsquo;s problem to solve, using a method nobody has the time or the will to see through.</p>
</div></div></section>
<section class="rd-sec rd-sec--bone rd-sec--flush"><figure class="figure full-bleed" data-rd-image="coolknit-corner"><img src="../assets/img/coolknit-corner.webp" alt="The corner of a Numa mattress, cover and edge" width="1400" height="781" loading="lazy" decoding="async"></figure></section>
<section class="rd-sec"><div class="wrap"><div class="narrow story">
<p>Numa is built so that burden is ours. You do not choose a feel. You cannot know how a mattress feels in four minutes. You live with the bed, and the feel is discovered over months of use. You have a year with us. Softer, firmer, more give under the hip, whatever it is in whatever words you have. We send the layer that takes you there, and you keep it, with our compliments. No trial-and-error, no sending anything back, no starting again.</p>
<p>You have a year with us. We do the rest.</p>
<div class="pull"><p>A bed that becomes yours, and stays that way.</p></div>
<p>That is why the top comes off. It began as a way to fix a wrong guess and it turned out to solve something larger. The part of a mattress that softens is the fifteen centimetres of comfort, and everything beneath it is usually still sound at year ten. Renewing the layer keeps the bed right for twenty five years instead of watching it drift wrong over eight.</p>
<p>The rest followed from the same thought. If somebody is spending three thousand pounds on a bed, it should not arrive as a box in their hallway. Concierge unpacking. Unrolled where it belongs. The packaging leaves with it. The old one leaves too.</p>
<p>We named it Numa after the second king of Rome, remembered for ending a long war and giving the city forty three years of quiet. It is also, almost exactly, the Arabic word for a night&rsquo;s sleep. Two languages, one meaning, and it seemed like the right thing to call a bed.</p>
<p>We started in 2026 and we are small. That is deliberate for now, because I want to work with you personally to get your bed right. Write to me and it is me who answers.</p>
<div class="sig"><p class="n">Ben Acolatse</p><p class="r">Founder · Numa · Est. 2026</p></div>
</div></div></section>
"""


def chrome(meta: dict) -> tuple[str, str]:
    cta = meta["cta"]
    head = f"""<!doctype html>
<html lang="en" data-market="ae" data-font-set="modern" data-color-scheme="signature" data-brand-guidelines="v1" data-warranty-years="25" data-trial-nights="30">
  <head>
    <meta charset="utf-8">
    <script src="../brand-boot.js?v=numa-brand1" data-valtora-brand-boot></script>
<meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="#1F3A5F">
    <title>{meta["title"]}</title>
    <meta name="description" content="{meta["description"]}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link id="PreviewFontLink" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../base.css?v=brand-e144">
    <link rel="stylesheet" href="../brand.css?v=radius2">
    <link rel="stylesheet" href="../redesign.css?v=rd1">
    <style>
      :root {{
        --brand-primary: #1F3A5F;
        --brand-accent: #8A6D3B;
        --brand-bg: #F7F5F1;
        --brand-surface: #EAE6DF;
        --brand-ink: #222222;
        --brand-on-dark: #F7F5F1;
        --eyebrow-on-dark: #8A6D3B;
        --font-serif: 'Instrument Sans', system-ui, sans-serif;
        --font-sans: 'Inter', system-ui, sans-serif;
        --font-wordmark: 'Instrument Sans', system-ui, sans-serif;
        --font-headline: 'Instrument Sans', system-ui, sans-serif;
        --wordmark-tracking: 0.18em;
        --space-section: clamp(5.5rem, 12vw, 9rem);
        --space-gutter: clamp(1.35rem, 4vw, 2.75rem);
        --max-width: 72rem;
        --max-width-narrow: 40rem;
        --radius: 16px;
        --radius-control: 12px;
        --transition: var(--dur-base) var(--ease);
      }}
      .preview-banner {{
        background: var(--brand-primary);
        color: var(--brand-on-dark);
        text-align: center;
        font-size: 0.8125rem;
        letter-spacing: 0.04em;
        padding: 0.55rem 1rem;
      }}
    </style>
  </head>
  <body class="{meta["body_class"]}" data-page="landing">
    <div class="preview-banner" data-preview-chrome><strong>Local theme preview</strong></div>
        <div class="announcement" role="region" aria-label="Announcement" data-announcement-bar>
      <p style="margin:0">Concierge unpacking <b>included with every mattress</b> · To the room of your choice, packaging taken away</p>
      <button type="button" class="announcement__dismiss" data-announcement-dismiss aria-label="Dismiss">×</button>
    </div>
<header class="site-header">
      <div class="site-header__inner">
        <a class="wordmark" href="../index.html" aria-label="Numa Mattresses">
          <span class="wordmark__lockup">
            <span class="wordmark__text" data-brand-text>Numa</span>
            <span class="wordmark__product" data-brand-product-line>Mattresses</span>
          </span>
        </a>
        <nav class="site-header__nav" aria-label="Primary">
{NAV}
        </nav>
        <div class="site-header__actions"><a class="site-header__order" href="./cart.html" data-order-link hidden aria-label="Order"><span class="site-header__order-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 8h14l-1.1 10.2a1.5 1.5 0 0 1-1.5 1.3H7.6a1.5 1.5 0 0 1-1.5-1.3L5 8z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg></span><span class="site-header__order-label">Order</span><span class="site-header__order-count" data-order-count hidden>0</span></a>
          <a class="btn" href="{cta}">Reserve yours</a>
          <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="MobileNav" aria-label="Open menu">
            <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
          </button>
        </div>
      </div>
      <div class="nav-panel" id="MobileNav" data-nav-panel aria-hidden="true">
{NAV_MOBILE}
        <a href="{cta}">Reserve yours</a>
      </div>
    </header>
"""
    foot = """
    <footer class="site-footer">
      <div class="page-width site-footer__grid">
        <div class="site-footer__brand">
          <a class="wordmark" href="../index.html" aria-label="Numa Mattresses">
            <span class="wordmark__lockup">
              <span class="wordmark__text" data-brand-text>Numa</span>
              <span class="wordmark__product" data-brand-product-line>Mattresses</span>
            </span>
          </a>
          <p>
        <span data-market-only="gb">A better bed, for life. Refresh it, do not replace it.</span>
        <span data-market-only="ae">Engineered for the Gulf. A better bed, for life. Refresh it, do not replace it.</span>
      </p>
        </div>
                  <div>
            <h3>Shop</h3>
""" + FOOTER_SHOP + """
          </div>
          <div>
            <h3>Help</h3>
""" + FOOTER_HELP + """
          </div>
          <div>
            <h3>Policies</h3>
            <ul>
              <li><a href="./trial.html">Adjust to Desire</a></li>
              <li><a href="./warranty.html">Warranty</a></li>
              <li><a href="./refunds.html">Refunds</a></li>
              <li><a href="./privacy.html">Privacy</a></li>
              <li><a href="./terms.html">Terms</a></li>
              <li><a href="./cookies.html">Cookies</a></li>
            </ul>
          </div>
      </div>
    </footer>
      <script>
      window.ValtoraTheme = { brandName: 'Numa', defaultMarket: 'ae', routes: { cart: '#', cartAdd: '#', root: '../index.html', review: './checkout.html' }, debugTrack: true };
    </script>
    <div class="float-basket" data-float-basket data-sticky-reserve hidden>
      <span class="float-basket__count" data-float-count>Choose a size</span>
      <strong class="float-basket__total" data-float-total data-sticky-price></strong>
      <a class="float-basket__btn" data-float-continue data-checkout-href="./cart.html" href="#configure">Reserve yours</a>
    </div>

    <script src="../utm-persistence.js?v=wo-v9-utm1"></script>
    <script src="../theme.js?v=wo-v9-favicon1"></script>
  </body>
</html>
"""
    return head, foot


def extract_configure(existing: Path) -> str:
    text = existing.read_text(encoding="utf-8")
    m = re.search(
        r'(<script type="application/json" data-size-price-config>[\s\S]*?</script>\s*)?<section class="section lp-section lp-section--configure[\s\S]*?</section>',
        text,
    )
    if not m:
        return ""
    return m.group(0)


LAYER_NAMES = {
    "01": "Cool-Knit cover",
    "02": "Gel memory foam",
    "03": "Comfort foam",
    "04": "Wave-profile foam",
    "05": "Flippable comfort layer",
    "06": "Seven-zone pocket spring core",
    "07": "Encased perimeter",
    "08": "Anti-slip underside",
}


def decorate_layers(html: str) -> str:
    def repl(m: re.Match) -> str:
        block = m.group(0)
        num = m.group(1)
        name = LAYER_NAMES.get(num, "")
        extra = f' data-rd-layer="{num}" data-rd-layer-name="{name}"'
        if 'data-rd-layer=' in block:
            return block
        return block.replace('class="layer reveal"', f'class="layer reveal"{extra}', 1)

    return re.sub(
        r'<div class="layer reveal">\s*<div class="layer-n"><span class="mono">(0\d)</span>',
        lambda m: repl(m) if False else m.group(0),
        html,
    )


def add_layer_attrs(html: str) -> str:
    for num, name in LAYER_NAMES.items():
        html = html.replace(
            f'<div class="layer reveal">\n<div class="layer-n"><span class="mono">{num}</span>',
            f'<div class="layer reveal" data-rd-layer="{num}" data-rd-layer-name="{name}">\n<div class="layer-n"><span class="mono">{num}</span>',
            1,
        )
        html = html.replace(
            f'<div class="layer reveal"><div class="layer-n"><span class="mono">{num}</span>',
            f'<div class="layer reveal" data-rd-layer="{num}" data-rd-layer-name="{name}"><div class="layer-n"><span class="mono">{num}</span>',
            1,
        )
    return html


def add_img_dims(html: str) -> str:
    def repl(m: re.Match) -> str:
        full = m.group(0)
        src = m.group(1)
        name = Path(src).name
        if name not in DIMS:
            return full
        if " width=" in full:
            return full
        w, h = DIMS[name]
        return full[:-1] + f' width="{w}" height="{h}">'

    return re.sub(r'<img src="([^"]+)"[^>]*>', repl, html)


def transform_body(html: str, meta: dict) -> str:
    m = re.search(r"</nav>(.*)<footer>", html, re.S)
    if not m:
        raise SystemExit("could not extract body")
    body = m.group(1)
    body = re.sub(r"<style>[\s\S]*?</style>", "", body)
    body = re.sub(
        r'<section class="bone" id="configure">[\s\S]*?</script>',
        "",
        body,
    )
    body = body.replace("&mdash;", "-")
    body = body.replace("assets/img/", "../assets/img/")
    body = body.replace("assets/video/", "../assets/video/")
    body = body.replace('href="/configure"', 'href="./configure.html"')
    body = body.replace('href="/pages/specification"', 'href="./specification.html"')
    body = body.replace('href="/pages/manufacturing"', 'href="./manufacturing.html"')
    body = body.replace('href="/pages/support"', 'href="./support.html"')
    body = body.replace('href="/pages/about"', 'href="./about.html"')
    body = body.replace('href="/pages/trade"', 'href="./trade.html"')
    body = body.replace('href="/basket', 'href="./cart.html')
    body = body.replace('class="hero"', 'class="rd-hero"')
    body = body.replace('class="hero ', 'class="rd-hero ')
    body = body.replace('<section class="bone"', '<section class="rd-sec rd-sec--bone"')
    body = body.replace('<section class="dark"', '<section class="rd-sec rd-sec--dark"')
    body = body.replace('<section class="flush"', '<section class="rd-sec rd-sec--flush"')
    body = body.replace("<section>", '<section class="rd-sec">')
    body = body.replace('<section id="layers"', '<section class="rd-sec" id="layers"')
    body = body.replace('<section id="breakdown"', '<section class="rd-sec rd-sec--bone" id="breakdown"')
    body = body.replace('<section class="rd-hero"', '<section class="rd-sec rd-hero"')
    body = re.sub(
        r'<video src="([^"]+)" poster="([^"]+)" autoplay muted loop playsinline preload="none" aria-label="([^"]+)"></video>',
        lambda mm: (
            '<video class="rd-video" data-rd-video data-video-id="'
            + Path(mm.group(1)).stem
            + '" data-src="'
            + mm.group(1)
            + '" poster="'
            + mm.group(2)
            + '" muted loop playsinline preload="none" aria-label="'
            + mm.group(3)
            + '"></video>'
        ),
        body,
    )
    body = add_layer_attrs(body)
    body = add_img_dims(body)

    def fullbleed(mm: re.Match) -> str:
        tag = mm.group(0)
        src = mm.group(1)
        image_id = Path(src).stem
        if "data-rd-image=" in tag:
            return tag
        return tag.replace("<figure ", f'<figure data-rd-image="{image_id}" ', 1)

    body = re.sub(
        r'<figure class="figure full-bleed"><img src="([^"]+)"',
        lambda mm: f'<figure class="figure full-bleed" data-rd-image="{Path(mm.group(1)).stem}"><img src="{mm.group(1)}"',
        body,
    )
    body = body.replace('class="btn btn-line"', 'class="btn btn--ghost btn-line"')
    body = body.replace(
        'class="btn" href="./configure.html" style="background:var(--snow);color:var(--carbon)"',
        'class="btn" href="./configure.html"',
    )
    if meta.get("keep_copy"):
        # Keep hero + first full-bleed from the mock, replace the story with live copy.
        hero = re.search(r'(<section class="rd-sec rd-hero">[\s\S]*?</section>)', body)
        hero_html = hero.group(1) if hero else ""
        outcome = re.search(r'(<section class="rd-sec rd-sec--dark">[\s\S]*?</section>)\s*$', body)
        outcome_html = outcome.group(1) if outcome else ""
        body = hero_html + ABOUT_STORY + (outcome_html or "")
    return body.strip()


def nav_for_prefix(prefix: str) -> tuple[str, str]:
    desk = f"""          <a href="{prefix}specification.html">The mattress</a>
          <a href="{prefix}manufacturing.html">How it is made</a>
          <a href="{prefix}support.html">Support</a>
          <a href="{prefix}about.html">About</a>
          <a href="{prefix}trade.html">Trade</a>"""
    mobile = f"""                <a href="{prefix}specification.html">The mattress</a>
        <a href="{prefix}manufacturing.html">How it is made</a>
        <a href="{prefix}support.html">Support</a>
        <a href="{prefix}about.html">About</a>
        <a href="{prefix}trade.html">Trade</a>"""
    return desk, mobile


def infer_prefix(text: str) -> str:
    if re.search(r'href="\./pages/(?:manufacturing|specification|about)\.html"', text):
        return "./pages/"
    if re.search(r'href="\.\./pages/(?:manufacturing|specification|about)\.html"', text):
        return "../pages/"
    return "./"


def patch_site_nav(text: str) -> str:
    if 'class="site-header__nav"' not in text:
        return text
    text = text.replace("\x03", "</nav>")
    prefix = infer_prefix(text)
    desk, mobile = nav_for_prefix(prefix)
    text = re.sub(
        r'(<nav class="site-header__nav"[^>]*>)([\s\S]*?)(</nav>)',
        lambda m: m.group(1) + "\n" + desk + "\n        </nav>",
        text,
        count=1,
    )
    text = re.sub(
        r'(<div class="nav-panel"[^>]*>)([\s\S]*?)(<a href="[^"]*">Reserve yours</a>)',
        lambda m: m.group(1) + "\n" + mobile + "\n        " + m.group(3),
        text,
        count=1,
    )
    return text


def main() -> None:
    shutil.copyfile(THEME_CSS, PREVIEW / "redesign.css")
    for src_name, meta in PAGES.items():
        src = SRC / src_name
        body = transform_body(src.read_text(encoding="utf-8"), meta)
        head, foot = chrome(meta)
        extra = ""
        if meta.get("configure"):
            existing = PREVIEW / "pages" / meta["out"]
            extra = extract_configure(existing)
            if extra:
                extra = "\n      " + extra
        html = (
            head
            + f'\n    <main>\n      <div class="rd" data-lp-page data-lp-variant="{meta["variant"]}">\n'
            + body
            + "\n      </div>"
            + extra
            + "\n    </main>\n"
            + foot
        )
        out = PREVIEW / "pages" / meta["out"]
        out.write_text(html, encoding="utf-8")
        print("wrote", out.relative_to(ROOT))

    skip = {v["out"] for v in PAGES.values()}
    for path in PREVIEW.rglob("*.html"):
        if "emails" in path.parts:
            continue
        if path.name in skip:
            continue
        text = path.read_text(encoding="utf-8")
        updated = patch_site_nav(text)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            print("nav", path.relative_to(ROOT))


if __name__ == "__main__":
    main()
