#!/usr/bin/env python3
"""Apply Numa pack chrome and size config to preview HTML."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PREVIEW = ROOT / "preview"
THEME_JS = ROOT / "valtora-theme" / "assets" / "theme.js"
THEME_CSS = ROOT / "valtora-theme" / "assets" / "base.css"

BANNER = """    <div class="announcement" role="region" aria-label="Announcement" data-announcement-bar>
      <p style="margin:0">Concierge unpacking <b>included with every mattress</b> · To the room of your choice, packaging taken away</p>
      <button type="button" class="announcement__dismiss" data-announcement-dismiss aria-label="Dismiss">×</button>
    </div>"""

NAV_DESKTOP = """          <a href="../index.html#reserve">The mattress</a>
          <div class="site-header__item">
            <a href="./size-guide.html">Sizes</a>
            <div class="site-header__sub">
              <a href="./large-sizes.html">Large sizes</a>
              <a href="./european-king.html">European King</a>
              <a href="./size-guide.html">Size guide</a>
            </div>
          </div>
          <a href="./specification.html">Specification</a>
          <a href="./manufacturing.html">How it is made</a>
          <a href="./about.html">About</a>
          <a href="../blog/index.html">Journal</a>"""

NAV_HOME = NAV_DESKTOP.replace("./", "./pages/").replace("../index.html", "#reserve").replace("../blog", "./blog")
# homepage uses ./pages/ and #reserve — handled separately

SIZE_CONFIG = """[
  {"market":"ae","id":"single","label":"Single","dims":"90-100 × 200 cm","price":"AED 8,999","price_raw":899900,"available":true},
  {"market":"ae","id":"queen","label":"Queen","dims":"160 × 200 cm","price":"AED 11,999","price_raw":1199900,"available":true,"popular":true},
  {"market":"ae","id":"king","label":"King","dims":"180 × 200 cm","price":"AED 14,999","price_raw":1499900,"available":true},
  {"market":"ae","id":"super-king","label":"Super King","dims":"200 × 200 cm","price":"AED 16,999","price_raw":1699900,"available":false},
  {"market":"gb","id":"single","label":"Single","dims":"90 × 190 cm","price":"£1,999","price_raw":199900,"available":true},
  {"market":"gb","id":"small-double","label":"Small Double","dims":"120 × 190 cm","price":"£2,249","price_raw":224900,"available":true},
  {"market":"gb","id":"double","label":"Double","dims":"135 × 190 cm","price":"£2,499","price_raw":249900,"available":true},
  {"market":"gb","id":"king","label":"King","dims":"150 × 200 cm","price":"£2,999","price_raw":299900,"available":true,"popular":true},
  {"market":"gb","id":"european-king","label":"European King","dims":"160 × 200 cm","price":"£3,199","price_raw":319900,"available":true},
  {"market":"gb","id":"super-king","label":"Super King","dims":"180 × 200 cm","price":"£3,299","price_raw":329900,"available":true},
  {"market":"gb","id":"emperor","label":"Emperor","dims":"200 × 200 cm","price":"£3,699","price_raw":369900,"available":true},
  {"market":"eu","id":"european-king","label":"European King","dims":"160 × 200 cm","price":"£3,199","price_raw":319900,"available":true},
  {"market":"us","id":"twin","label":"Twin","dims":"99 × 191 cm","price":"£1,999","price_raw":199900,"available":true},
  {"market":"us","id":"twin-xl","label":"Twin XL","dims":"91 × 213 cm","price":"£2,049","price_raw":204900,"available":true},
  {"market":"us","id":"full","label":"Full","dims":"137 × 191 cm","price":"£2,499","price_raw":249900,"available":true},
  {"market":"us","id":"queen","label":"Queen","dims":"152 × 203 cm","price":"£2,999","price_raw":299900,"available":true},
  {"market":"us","id":"us-king","label":"King","dims":"193 × 203 cm","price":"£3,399","price_raw":339900,"available":true},
  {"market":"us","id":"california-king","label":"California King","dims":"183 × 213 cm","price":"£3,399","price_raw":339900,"available":true},
  {"market":"us","id":"split-king","label":"Split King","dims":"2 × 106 × 213 cm","price":"£3,699","price_raw":369900,"available":true}
]"""

POLICY = "Comfort layer included · 30-day comfort promise · Concierge unpacking included"
POLICY_EMP = 'data-lp-policy-emperor="Comfort layer included · Made to order · Concierge unpacking included · Not covered by the 30-day return trial"'
POLICY_DEF = 'data-lp-policy-default="' + POLICY + '"'

HELP_LI = """              <li><a href="./size-guide.html">Size guide</a></li>
              <li><a href="./delivery.html">Delivery and lead time</a></li>
              <li><a href="./mattress-recycling.html">Old mattress removal and recycling</a></li>
              <li><a href="./about.html">About</a></li>
              <li><a href="./order-status.html">Order status</a></li>
              <li><a href="./contact.html">Contact</a></li>"""


def patch_html(text: str, *, home: bool = False) -> str:
    text = text.replace('data-trial-nights="100"', 'data-trial-nights="30"')
    text = re.sub(
        r'<div class="announcement".*?</div>\s*',
        BANNER + "\n",
        text,
        count=1,
        flags=re.S,
    )
    text = re.sub(
        r'<script type="application/json" data-size-price-config>\s*\[.*?\]\s*</script>',
        '<script type="application/json" data-size-price-config>\n' + SIZE_CONFIG + "\n</script>",
        text,
        flags=re.S,
    )
    text = re.sub(
        r'data-lp-policy-default="[^"]*"',
        POLICY_DEF,
        text,
    )
    text = re.sub(
        r'data-lp-policy-emperor="[^"]*"',
        POLICY_EMP,
        text,
    )
    text = re.sub(
        r'<p class="lp-policy" data-lp-policy>.*?</p>',
        f'<p class="lp-policy" data-lp-policy>{POLICY}</p>',
        text,
        flags=re.S,
    )
    text = text.replace(
        '<a href="./manufacturing.html">How it is made</a>\n          <a href="../blog/index.html">Journal</a>',
        '<a href="./manufacturing.html">How it is made</a>\n          <a href="./about.html">About</a>\n          <a href="../blog/index.html">Journal</a>',
    )
    text = text.replace(
        '<a href="./manufacturing.html">How it is made</a>\n        <a href="../blog/index.html">Journal</a>',
        '<a href="./manufacturing.html">How it is made</a>\n        <a href="./about.html">About</a>\n        <a href="../blog/index.html">Journal</a>',
    )
    text = text.replace(
        '<a href="./pages/manufacturing.html">How it is made</a>\n        <a href="./blog/index.html">Journal</a>',
        '<a href="./pages/manufacturing.html">How it is made</a>\n        <a href="./pages/about.html">About</a>\n        <a href="./blog/index.html">Journal</a>',
    )
    text = text.replace(
        """              <li><a href="./size-guide.html">Size guide</a></li>
              <li><a href="./delivery.html">Delivery and lead time</a></li>
              <li><a href="./order-status.html">Order status</a></li>
              <li><a href="./contact.html">Contact</a></li>""",
        HELP_LI,
    )
    text = text.replace(
        """              <li><a href="./pages/size-guide.html">Size guide</a></li>
              <li><a href="./pages/delivery.html">Delivery and lead time</a></li>
              <li><a href="./pages/order-status.html">Order status</a></li>
              <li><a href="./pages/contact.html">Contact</a></li>""",
        HELP_LI.replace("./", "./pages/"),
    )
    text = text.replace(
        '<span data-trial-nights-text>100</span>-night trial',
        '30-day sleep trial',
    )
    text = text.replace(
        '<span data-trial-nights-text>100</span>-night comfort promise',
        '30-day comfort promise',
    )
    if home:
        text = text.replace(
            "<h1 data-reveal-child data-reveal-first style=\"--reveal-delay: 0ms\">Made to order. Made to last.</h1>",
            "<h1 data-reveal-child data-reveal-first style=\"--reveal-delay: 0ms\">You do not choose the feel. You discover it.</h1>",
        )
        text = text.replace(
            "Change the feel whenever you want. Replace the layer that wears, not the whole bed.",
            "Sleep on it for a month. Tell us how it should feel. We make it that way.",
        )
        text = text.replace(
            "How the swap system works",
            "How it arrives",
        )
        text = text.replace(
            "Cancel any time before dispatch · 100-night trial · <span data-warranty-years-text>25</span>-year warranty",
            "Concierge unpacking included · The old one leaves with it",
        )
    return text


def append_css() -> None:
    preview_css = (PREVIEW / "base.css").read_text(encoding="utf-8")
    if ".lp-outcome" in preview_css:
        return
    theme_css = THEME_CSS.read_text(encoding="utf-8")
    extra = theme_css[theme_css.index(".lp-outcome") :]
    (PREVIEW / "base.css").write_text(preview_css.rstrip() + "\n\n" + extra, encoding="utf-8")


def main() -> None:
    shutil.copyfile(THEME_JS, PREVIEW / "theme.js")
    append_css()
    for path in PREVIEW.rglob("*.html"):
        if "emails" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        home = path.name == "index.html" and path.parent == PREVIEW
        path.write_text(patch_html(text, home=home), encoding="utf-8")
    print("preview chrome patched")


if __name__ == "__main__":
    main()
