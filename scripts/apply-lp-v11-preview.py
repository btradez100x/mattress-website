#!/usr/bin/env python3
"""Apply v11 LP pack deltas to preview HTML pages."""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
META = json.loads(Path("/tmp/lp-v11-meta.json").read_text())

PAY_HTML = (
    '<div class="pay"><span class="k">Pay by</span><div class="m">'
    "<span>Visa</span><span>Mastercard</span><span>Amex</span><span>PayPal</span>"
    "<span>Apple Pay</span><span>Google Pay</span>"
    "<span>Klarna, 3 payments</span><span>Klarna, 24 months</span>"
    "</div></div>"
)

ARRIVE_HTML = """<section class="arrive">
<div class="wrap">
<div class="sec-head narrow">
<p class="kicker">What arriving looks like</p>
<h2>It arrives finished.</h2>
<p class="lede" style="color:#C9C5BD;margin-top:var(--s2)">Not left in a hallway in a box for you to wrestle upstairs.</p>
</div>
<div class="steps3">
<div><span class="n">On the day</span><h3>Concierged in</h3><p>To the room you choose, unboxed, unrolled onto your bed and positioned. The packaging leaves with it.</p></div>
<div><span class="n">Same visit</span><h3>The old one leaves</h3><p>Taken away and sent for recycling. We carry the cost.</p></div>
<div><span class="n">Beforehand</span><h3>A window you agree</h3><p>We call before we come, and arrange a time that suits you. Nothing arrives unannounced.</p></div>
</div></div></section>"""

ASSURE_IC = """<section class="bone"><div class="wrap"><div class="assure">
<div>
<span class="ic"></span>
<b>You cannot get this wrong</b>
<p>A year to tell us how it should feel. We remake the comfort layer to that, with our compliments, as often as it takes.</p>
</div>
<div>
<span class="ic"></span>
<b>100 days to change your mind</b>
<p>Collected from your home and refunded in full. Emperor is made to order and excluded.</p>
</div>
<div>
<span class="ic"></span>
<b>25 years on the core</b>
<p>The part that carries you is guaranteed for a quarter of a century.</p>
</div>
</div></div></section>"""


def sizestrip_html(sizes: list[dict]) -> str:
    if not sizes:
        return ""
    bits = ['<div class="sizestrip">']
    for s in sizes:
        cls = ' class="on"' if s.get("on") else ""
        bits.append(
            f'<a href="#configure"{cls} data-lp-cta="sizestrip">'
            f'<b>{html.escape(s["label"])}</b><span>{html.escape(s["dims"])}</span></a>'
        )
    bits.append("</div>")
    return "".join(bits)


def patch_preview(handle: str) -> None:
    path = ROOT / f"preview/pages/{handle}.html"
    text = path.read_text()
    meta = META[handle]
    orig = text

    if meta["sizes"] and 'class="sizestrip"' not in text:
        strip = sizestrip_html(meta["sizes"])
        text = re.sub(
            r'(<p class="lede">.*?</p>\s*)(<div class="cta-row">)',
            r"\1" + strip + r"\2",
            text,
            count=1,
            flags=re.S,
        )
        # premium: sizestrip sits in price band — insert after price-block if no cta match
        if 'class="sizestrip"' not in text and handle == "premium":
            text = re.sub(
                r'(<div class="price-block"[^>]*>.*?</div>)',
                r"\1" + strip,
                text,
                count=1,
                flags=re.S,
            )

    text = re.sub(
        r'<span class="klarna">or £(\d[\d,]*) a month with Klarna</span>',
        r'<span class="klarna">or <b>£\1 a month</b> with Klarna</span>',
        text,
    )

    if 'class="pay"' not in text:
        text = re.sub(
            r'(<div class="price-block"[^>]*>.*?</div>)',
            r"\1" + PAY_HTML,
            text,
            count=1,
            flags=re.S,
        )

    if meta.get("arrive"):
        text = re.sub(
            r'<section class="bone">\s*<div class="wrap">\s*<div class="sec-head narrow">\s*'
            r'<p class="kicker">What arriving looks like</p>.*?</section>',
            ARRIVE_HTML,
            text,
            count=1,
            flags=re.S,
        )

    text = re.sub(
        r'<section class="bone"><div class="wrap"><div class="narrow"><div class="assure">.*?</div></div></div></section>',
        ASSURE_IC,
        text,
        count=1,
        flags=re.S,
    )

    if handle not in ("spec-size", "spec-only"):
        m = re.search(
            r'(\n<!-- As seen on -->\s*<section class="section" id="press".*?</section>)',
            text,
            re.S,
        )
        if m:
            press = m.group(1)
            text2 = text[: m.start()] + text[m.end() :]
            hm = re.search(r'(<section class="hero">.*?</section>)', text2, re.S)
            if hm:
                text = text2[: hm.end()] + press + text2[hm.end() :]
                text = text.replace(
                    '<p class="section__eyebrow">As seen on</p>',
                    '<p class="section__eyebrow">As featured in</p>',
                    1,
                )

    if handle == "need-only" and "price-block--large" not in text:
        text = text.replace('class="price-block"', 'class="price-block price-block--large"', 1)

    if handle in ("other-size", "premium"):
        text = text.replace("<b>£104 a month</b>", "<b>£83 a month</b>")

    # bump cache buster
    text = re.sub(r"lp\.css\?v=[^\"]+", "lp.css?v=lp-v11", text)

    if text != orig:
        path.write_text(text)
        print("patched", handle)
    else:
        print("unchanged", handle)


def main() -> None:
    for handle in META:
        patch_preview(handle)


if __name__ == "__main__":
    main()
