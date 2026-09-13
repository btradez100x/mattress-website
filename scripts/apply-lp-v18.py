#!/usr/bin/env python3
"""Apply numa-landing-pages-v18 pack to theme LP templates + preview pages."""
from __future__ import annotations

import json
import re
from copy import deepcopy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
THEME = ROOT / "valtora-theme"
PREVIEW = ROOT / "preview"
V18 = ROOT / ".tmp" / "lp-v18"

TOK = (
    "| replace: '[Brand]', brand"
    " | replace: '[Cover]', cover"
    " | replace: '[Gel]', gel"
    " | replace: '[Core]', core"
)
TOK_LAYER = TOK + " | replace: '[layer_price]', layer_price"

HANDLE_MAP = {
    "lp1-ag1-size": "size",
    "lp2-ag2-need": "need",
    "lp3-ag3-premium": "premium",
    "lp4-ag4-other-size": "other-size",
    "lp5-ag5-conquest": "conquest",
    "lp6-ag6-spec-size": "spec-size",
    "lp7-ag7-need-only": "need-only",
    "lp8-ag8-spec-only": "spec-only",
    "lp9-ag9-temperature": "temperature",
}


def clean(s: str) -> str:
    s = re.sub(r"<!--\{\{[^}]*\}\}-->", "", s or "")
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = (
        s.replace("&pound;", "£")
        .replace("&middot;", "·")
        .replace("&times;", "×")
        .replace("&amp;", "&")
    )
    return re.sub(r"[ \t]+\n", "\n", s).strip()


def brandify(s: str) -> str:
    """Turn preview literals into [Brand]/[Cover]/[Gel]/[Core] tokens."""
    if not s:
        return s
    # Longer compounds first
    reps = [
        ("Numa Coolweave", "[Brand] [Cover]"),
        ("Numa Coolcell", "[Brand] [Gel]"),
        ("Numa Sevencore", "[Brand] [Core]"),
        ("Coolweave", "[Cover]"),
        ("Coolcell", "[Gel]"),
        ("Sevencore", "[Core]"),
        ("Numa", "[Brand]"),
    ]
    out = s
    for a, b in reps:
        out = out.replace(a, b)
    return out


def patch_lp_liquid() -> None:
    path = THEME / "sections" / "lp.liquid"
    text = path.read_text()

    if "assign cover = settings.cover_material" not in text:
        text = text.replace(
            "  assign brand = settings.brand_name | default: 'Numa'\n"
            "  assign trial = settings.trial_nights | default: 100\n",
            "  assign brand = settings.brand_name | default: 'Numa'\n"
            "  assign cover = settings.cover_material | default: 'Coolweave'\n"
            "  assign gel = settings.gel_material | default: 'Coolcell'\n"
            "  assign core = settings.core_name | default: 'Sevencore'\n"
            "  assign trial = settings.trial_nights | default: 100\n",
            1,
        )

    # Expand any existing short replace chains
    text = text.replace(
        "| replace: '[Brand]', brand | replace: '[layer_price]', layer_price",
        TOK_LAYER,
    )
    text = text.replace("| replace: '[Brand]', brand", TOK)
    text = text.replace("| replace: '[layer_price]', layer_price", TOK_LAYER)

    def tok_field(src: str, field: str, with_layer: bool = False) -> str:
        filt = TOK_LAYER if with_layer else TOK
        # {{ block.settings.FIELD }} or already filtered
        pattern = re.compile(
            rf"(\{{\{{\s*block\.settings\.{field})((?:\s*\|[^}}]+)*)(\s*\}}\}})"
        )

        def repl(m: re.Match) -> str:
            existing = m.group(2) or ""
            if "[Cover]" in existing:
                return m.group(0)
            # Drop prior brand/layer replaces; re-apply full chain
            return f"{m.group(1)} {filt}{m.group(3)}"

        return pattern.sub(repl, src)

    for f in [
        "kicker",
        "heading",
        "lede",
        "trust_1",
        "trust_2",
        "trust_3",
        "pull",
        "card_1_heading",
        "card_1_body",
        "card_2_heading",
        "card_2_body",
        "card_3_heading",
        "card_3_body",
    ]:
        text = tok_field(text, f)
    for f in ["body_1", "body_2", "body_3", "body"]:
        text = tok_field(text, f, with_layer=True)

    # Layer name/desc
    text = text.replace(
        "<div><b>{{ lname }}</b><span>{{ block.settings[desckey] }}</span></div>",
        "<div><b>{{ lname "
        + TOK
        + " }}</b><span>{{ block.settings[desckey] "
        + TOK
        + " }}</span></div>",
    )

    # Ensure body_3 render after each body_2 paragraph render (prose/split/video)
    body2_re = re.compile(
        r"(\{%- if block\.settings\.body_2 != blank -%\}<p[^>]*>"
        r"\{\{ block\.settings\.body_2[^}]+\}\}</p>\{%- endif -%\})"
    )

    def add_b3(m: re.Match) -> str:
        after_pos = m.end()
        peek = text[after_pos : after_pos + 100] if False else ""  # unused
        return (
            m.group(1)
            + "\n              {%- if block.settings.body_3 != blank -%}"
            "<p>{{ block.settings.body_3 "
            + TOK_LAYER
            + " }}</p>{%- endif -%}"
        )

    # Avoid double-insert: only if body_3 render missing nearby
    parts = []
    last = 0
    for m in body2_re.finditer(text):
        parts.append(text[last : m.start()])
        following = text[m.end() : m.end() + 90]
        if "body_3" in following:
            parts.append(m.group(1))
        else:
            parts.append(add_b3(m))
        last = m.end()
    parts.append(text[last:])
    text = "".join(parts)

    # Schema: add body_3 after body_2 settings for prose/split/video
    for label in ("prose", "split", "video"):
        marker = f'"type": "{label}"'
        pos = text.find(marker)
        if pos < 0:
            continue
        # find body_2 setting line within next 1200 chars
        window = text[pos : pos + 1400]
        if '"id": "body_3"' in window:
            continue
        needle = '{ "type": "textarea", "id": "body_2", "label": "Body 2" },'
        if needle not in window:
            continue
        insert = needle + '\n        { "type": "textarea", "id": "body_3", "label": "Body 3" },'
        text = text[:pos] + window.replace(needle, insert, 1) + text[pos + 1400 :]

    # Hero heading should keep newline_to_br after tokens
    text = re.sub(
        r"\{\{\s*block\.settings\.heading\s+"
        + re.escape(TOK)
        + r"\s*\}\}",
        "{{ block.settings.heading " + TOK + " | newline_to_br }}",
        text,
    )
    # Fix double newline_to_br
    text = text.replace(
        "| newline_to_br | newline_to_br",
        "| newline_to_br",
    )
    # Restore heading forms that already had newline_to_br before tokens got messy
    text = re.sub(
        r"\{\{\s*block\.settings\.heading\s+"
        + re.escape(TOK)
        + r"\s*\|\s*newline_to_br\s*\|\s*newline_to_br\s*\}\}",
        "{{ block.settings.heading " + TOK + " | newline_to_br }}",
        text,
    )

    path.write_text(text)
    print("patched", path.relative_to(ROOT))


def deep_set(obj: dict, *path, value):
    cur = obj
    for p in path[:-1]:
        cur = cur[p]
    cur[path[-1]] = value


def update_json_templates() -> None:
    """Patch changed copy fields in the nine page JSON templates."""

    # Shared Sevencore build split (size + other-size)
    sevencore_split = {
        "kicker": "[Brand] [Core]",
        "heading": "Thirty five centimetres,\nassembled by hand.",
        "body_1": (
            "It begins as wire. Drawn, wound into coils, and each one dropped into its own "
            "fabric pocket so it can rise and fall without disturbing the one beside it. "
            "Two thousand of them in a super king, arranged in seven bands along the length of the bed."
        ),
        "body_2": (
            "Heavier gauge under the hips and shoulders, where a body presses hardest. "
            "Lighter at the waist and the calves, where it does not. Nobody sinks evenly, so nothing is sprung evenly."
        ),
        "body_3": (
            "Then the comfort is laid over it by hand, layer by layer, and the whole thing is closed "
            "under a zip that runs the full perimeter. Not glued. Glue is permanent, and nothing about this bed is meant to be."
        ),
        "image_alt": "The quilted comfort surface",
    }

    layers = {
        "layer_1_name": "[Brand] [Cover] cover",
        "layer_1_desc": (
            "400gsm. The most effective cooling material on the market, knitted open so body heat passes straight through"
        ),
        "layer_2_name": "[Brand] [Gel] gel",
        "layer_2_desc": "One centimetre, at the surface. Pulls heat off your skin the moment it leaves you",
        "layer_4_desc": "Two and a half centimetres. Channels cut through it so air moves when you do",
        "layer_6_name": "[Brand] [Core]",
        "layer_6_desc": (
            "Twenty centimetres. Two thousand springs, seven zones, two wire gauges. Guaranteed twenty five years"
        ),
    }

    core_video = {
        "kicker": "[Brand] [Core]",
        "heading": "Two thousand springs.\nNot one of them touches another.",
        "body_1": (
            "[Core] is what a mattress should have been doing all along. Two thousand springs, wound, heat-set "
            "and sleeved one by one, so each answers only to the weight directly above it. Your shoulder does not "
            "decide what your hip gets. Nobody turning over at three in the morning decides anything for you."
        ),
        "body_2": (
            "Seven bands run the length of it, set to the shape of a person rather than the shape of a rectangle. "
            "Two millimetre wire holds the hips and shoulders, where a body lands hardest. One point eight through "
            "the waist and legs, where it does not. You are not the same weight all the way down, so the bed is not "
            "the same tension all the way down."
        ),
        "body_3": (
            "Twenty centimetres of it. Guaranteed a quarter of a century, because it is the part that never comes out and never wears."
        ),
        "caption": "Pocket springs being wound and encased",
    }

    comfort_split = {
        "heading": "One layer.\nTwo different nights.",
        "body_1": (
            "Ten centimetres, two densities bonded face to face. Sleep on one side and the bed gives a little more. "
            "Turn it over and it holds you a little higher. Same mattress, a different night, and it costs nothing to change your mind."
        ),
        "body_2": (
            "If neither face is yours, tell us how it should feel. We cut and assemble a new one to your description "
            "and send it, for a year, with our compliments. Most people ask once. Some never do."
        ),
    }

    cover_video = {
        "heading": "The most effective cooling\nmaterial on the market.",
        "body_1": (
            "[Cover] is the most effective cooling material on the market. Knitted at 400gsm, four times the weight "
            "of what most mattresses arrive in, and open enough that heat walks straight out of it instead of gathering "
            "under you. Heavy in the hand, weightless to sleep on."
        ),
        "body_2": (
            "It works with [Gel], one centimetre of gel directly beneath it. [Gel] takes the heat off your skin. "
            "[Cover] lets it go. Neither does much alone, which is why everyone else's gel sits buried in foam doing nothing."
        ),
        "body_3": (
            "The zip that closes it runs every side. That is why the comfort layer lifts out. Nothing is glued. "
            "Nothing is tufted. The cover is what holds the build together, which is also what lets the build come apart."
        ),
        "caption": "Roll-packed after inspection",
    }

    def patch_settings(block: dict, updates: dict) -> None:
        s = block.setdefault("settings", {})
        for k, v in updates.items():
            s[k] = v

    def load(handle: str) -> dict:
        return json.loads((THEME / "templates" / f"page.{handle}.json").read_text())

    def save(handle: str, data: dict) -> None:
        path = THEME / "templates" / f"page.{handle}.json"
        path.write_text(json.dumps(data, indent=2) + "\n")
        print("updated", path.relative_to(ROOT))

    # size + other-size
    for handle in ("size", "other-size"):
        data = load(handle)
        story = data["sections"]["story"]["blocks"]
        # find split block
        for bid, block in story.items():
            if block.get("type") == "split":
                patch_settings(block, sevencore_split)
        save(handle, data)

    # premium
    data = load("premium")
    story = data["sections"]["story"]["blocks"]
    for bid, block in story.items():
        if block.get("type") == "cards" and block["settings"].get("layout") == "grid":
            patch_settings(
                block,
                {
                    "card_1_body": (
                        "[Core] is two thousand springs, each sleeved on its own. One side of the bed does not travel "
                        "to the other, so a partner getting up at six does not wake you at six."
                    ),
                    "card_2_body": (
                        "Seven zones, two wire gauges. Heavier under the hips and shoulders where the weight lands, "
                        "lighter at the waist and legs. You wake up the shape you should be rather than the shape the bed made you."
                    ),
                },
            )
        if block.get("type") == "prose" and block["settings"].get("ground") == "dark":
            patch_settings(
                block,
                {
                    "body_1": (
                        "[Core] is ours. [Gel] is ours. [Cover] is ours. The two wire gauges and exactly where each one "
                        "starts and stops, the flippable comfort layer, the wave-cut airflow profile, the zip that runs every side. "
                        "Drawn here, argued over here, specified down to the density of every centimetre, and made to those drawings and no others."
                    ),
                    "body_2": (
                        "Most mattresses sold in this country are three or four builds wearing different covers. "
                        "A brand picks one, chooses a fabric, names it something, and sells it to you as theirs. "
                        "We did not want to sell you somebody else's bed with our name on it."
                    ),
                    "pull": (
                        "Nothing is built until you order it. Which is why the guarantee is twenty five years, "
                        "and why you get a year to change how it feels."
                    ),
                    "body_3": (
                        "So you are not buying what was made last quarter and needs shifting before the next container lands. "
                        "You are buying a bed that does not exist yet, built to a specification we own, assembled by hand, in the size you chose."
                    ),
                },
            )
    save("premium", data)

    # spec-size + spec-only
    for handle in ("spec-size", "spec-only"):
        data = load(handle)
        main_blocks = data["sections"]["main"]["blocks"]
        for bid, block in main_blocks.items():
            if block.get("type") == "layers":
                patch_settings(block, layers)
        more = data["sections"]["more"]["blocks"]
        for bid, block in more.items():
            t = block.get("type")
            kicker = block.get("settings", {}).get("kicker", "")
            if t == "video" and ("core" in kicker.lower() or "Seven zones" in block["settings"].get("heading", "") or "Sevencore" in kicker or "[Core]" in kicker or kicker == "The core"):
                patch_settings(block, core_video)
            elif t == "split" and "comfort" in kicker.lower():
                patch_settings(block, comfort_split)
            elif t == "video" and ("cover" in kicker.lower() or "Zipped" in block["settings"].get("heading", "") or "cooling" in block["settings"].get("heading", "").lower()):
                patch_settings(block, cover_video)
            # Also match by block id conventions
            if bid == "b3":
                patch_settings(block, core_video)
            elif bid == "b4":
                patch_settings(block, comfort_split)
            elif bid == "b5":
                patch_settings(block, cover_video)
        save(handle, data)

    # temperature
    data = load("temperature")
    main = data["sections"]["main"]["blocks"]["b1"]["settings"]
    main["lede"] = (
        "A foam mattress is a block, and heat has nowhere to go in a block. Ours is three things working together: "
        "[Gel] at the surface, [Cover] over the top, and twenty thousand pockets of air in [Core] beneath. "
        "Built to move heat, not hold it."
    )
    main["trust_1"] = "[Gel] gel at the surface"
    main["trust_2"] = "[Cover], 400gsm, over it"
    main["trust_3"] = "[Core] beneath"
    main["image_alt"] = "[Cover] cover, close"

    story = data["sections"]["story"]["blocks"]
    for bid, block in story.items():
        if block.get("type") == "cards" and block["settings"].get("layout") == "grid":
            patch_settings(
                block,
                {
                    "heading": "Three parts.\nOne system.",
                    "card_1_heading": "[Gel] takes the heat off you",
                    "card_1_body": (
                        "One centimetre of gel, one centimetre from your skin. Not buried in the middle of a foam block "
                        "where it warms up and stays warm, but at the surface, where the heat actually is."
                    ),
                    "card_2_heading": "[Cover] lets it go",
                    "card_2_body": (
                        "400gsm, four times the weight of a standard cover, and the most effective cooling material on the market. "
                        "Knitted open, so everything [Gel] pulls off you walks straight out instead of sitting there."
                    ),
                    "card_3_heading": "[Core] gives it somewhere to be",
                    "card_3_body": (
                        "Twenty centimetres of pocket springs is mostly air. A foam block holds heat because heat has nowhere "
                        "to go in a block. This is two thousand springs and the space between them."
                    ),
                },
            )
        if block.get("type") == "split":
            patch_settings(
                block,
                {
                    "kicker": "[Brand] [Gel]",
                    "heading": "Gel in the middle\ndoes nothing.",
                    "body_1": (
                        "Every mattress claims cooling gel. Most of them bury it in the middle of a foam block, where it "
                        "absorbs heat for an hour and then holds it against you all night, because there is nowhere for that heat to leave."
                    ),
                    "body_2": (
                        "[Gel] sits one centimetre from the surface, directly beneath [Cover]. It takes the heat off your skin "
                        "where you can actually feel it, and the cover carries it out of the bed. Same material everyone else uses, "
                        "put somewhere it can work, and the difference is the whole night."
                    ),
                },
            )
    save("temperature", data)

    # Sweep remaining Cool-Knit / cool-knit / Gel memory foam product naming on all nine LP JSON files
    coolknit_re = re.compile(r"cool-?knit", re.I)
    for handle in HANDLE_MAP.values():
        path = THEME / "templates" / f"page.{handle}.json"
        raw = path.read_text()
        data = json.loads(raw)

        def walk(o):
            if isinstance(o, dict):
                for k, v in list(o.items()):
                    if isinstance(v, str):
                        nv = v
                        nv = re.sub(r"Cool-Knit cover", "[Brand] [Cover] cover", nv, flags=re.I)
                        nv = re.sub(r"cool-knit cover", "[Brand] [Cover] cover", nv, flags=re.I)
                        nv = re.sub(r"\bCool-Knit\b", "[Cover]", nv)
                        nv = re.sub(r"\bcool-knit\b", "[Cover]", nv, flags=re.I)
                        nv = re.sub(r"400 gram \[Cover\]", "400gsm [Cover]", nv)
                        nv = re.sub(r"Four hundred gram \[Cover\]", "400gsm [Cover]", nv)
                        if nv != v:
                            o[k] = nv
                    else:
                        walk(v)
            elif isinstance(o, list):
                for i in o:
                    walk(i)

        walk(data)
        path.write_text(json.dumps(data, indent=2) + "\n")


def update_preview_pages() -> None:
    """Patch preview LP HTML with v18 copy + brand tokens resolved to Numa defaults for static preview."""
    brand, cover, gel, core = "Numa", "Coolweave", "Coolcell", "Sevencore"

    def resolve(s: str) -> str:
        return (
            s.replace("[Brand]", brand)
            .replace("[Cover]", cover)
            .replace("[Gel]", gel)
            .replace("[Core]", core)
        )

    # Map of handle -> list of (old, new) plain-text replacements inside the lp div
    # Prefer surgical replacements from known v12 strings.
    patches: dict[str, list[tuple[str, str]]] = {
        "size": [
            (
                '<p class="kicker">The build</p><h2>Thirty five centimetres,<br>in two parts.</h2>',
                f'<p class="kicker">{brand} {core}</p><h2>Thirty five centimetres,<br>assembled by hand.</h2>',
            ),
            (
                "Twenty centimetres of individually pocketed springs in seven zones, with heavier wire under the hips and shoulders. That is the part that carries a twenty five year guarantee.",
                "It begins as wire. Drawn, wound into coils, and each one dropped into its own fabric pocket so it can rise and fall without disturbing the one beside it. Two thousand of them in a super king, arranged in seven bands along the length of the bed.",
            ),
            (
                "Above it, fifteen centimetres of comfort closed under a zip that runs the whole way round. That is the part that comes out and renews.",
                "Heavier gauge under the hips and shoulders, where a body presses hardest. Lighter at the waist and the calves, where it does not. Nobody sinks evenly, so nothing is sprung evenly.</p>\n<p>Then the comfort is laid over it by hand, layer by layer, and the whole thing is closed under a zip that runs the full perimeter. Not glued. Glue is permanent, and nothing about this bed is meant to be.",
            ),
        ],
        "other-size": [],  # filled from size
        "premium": [
            (
                "Every spring sits in its own pocket and moves alone. One side of the bed does not travel to the other, so a partner getting up at six does not wake you at six.",
                f"{core} is two thousand springs, each sleeved on its own. One side of the bed does not travel to the other, so a partner getting up at six does not wake you at six.",
            ),
            (
                "Seven zones along the bed, wound at two wire gauges. Heavier under the hips and shoulders where the weight lands, lighter at the waist and legs. You wake up aligned rather than folded.",
                "Seven zones, two wire gauges. Heavier under the hips and shoulders where the weight lands, lighter at the waist and legs. You wake up the shape you should be rather than the shape the bed made you.",
            ),
            (
                "Every part of this mattress is our own. The seven-zone spring layout, the two wire gauges and where they sit, the flippable comfort layer, the wave-cut airflow profile, the zip that runs the full perimeter. Drawn here, specified here, made to our drawings.",
                f"{core} is ours. {gel} is ours. {cover} is ours. The two wire gauges and exactly where each one starts and stops, the flippable comfort layer, the wave-cut airflow profile, the zip that runs every side. Drawn here, argued over here, specified down to the density of every centimetre, and made to those drawings and no others.",
            ),
            (
                "Most mattresses in this country are the same three or four builds with different covers on them. Ours is not one of them, and you can read every layer of it before you buy. You are not buying what was made last quarter and needs shifting. You are buying a bed that does not exist yet, built to a specification we own, in the size you chose.",
                "Most mattresses sold in this country are three or four builds wearing different covers. A brand picks one, chooses a fabric, names it something, and sells it to you as theirs. We did not want to sell you somebody else's bed with our name on it.</p>\n<div class=\"pull\"><p>Nothing is built until you order it. Which is why the guarantee is twenty five years, and why you get a year to change how it feels.</p></div>\n<p>So you are not buying what was made last quarter and needs shifting before the next container lands. You are buying a bed that does not exist yet, built to a specification we own, assembled by hand, in the size you chose.",
            ),
        ],
        "temperature": [
            (
                "A solid foam mattress is a solid block, and a block has nowhere for warm air to go. Ours is twenty centimetres of open spring core, with the foam kept to the top where it is cut to let air move.",
                f"A foam mattress is a block, and heat has nowhere to go in a block. Ours is three things working together: {gel} at the surface, {cover} over the top, and twenty thousand pockets of air in {core} beneath. Built to move heat, not hold it.",
            ),
            ("Open spring core", f"{gel} gel at the surface"),
            ("Wave-cut airflow layer", f"{cover}, 400gsm, over it"),
            ("Cool-knit cover", f"{core} beneath"),
            ("Where the heat goes", "Three parts.<br>One system."),
            (
                "<div><h3>The cover breathes</h3><p>Four hundred gram cool-knit. Open-structured, so it does not trap what the layers beneath give off.</p></div>",
                f"<div><h3>{gel} takes the heat off you</h3><p>One centimetre of gel, one centimetre from your skin. Not buried in the middle of a foam block where it warms up and stays warm, but at the surface, where the heat actually is.</p></div>",
            ),
            (
                "<div><h3>The airflow layer moves it</h3><p>Two and a half centimetres of foam cut in a wave profile. The channels are where the air goes when you move.</p></div>",
                f"<div><h3>{cover} lets it go</h3><p>400gsm, four times the weight of a standard cover, and the most effective cooling material on the market. Knitted open, so everything {gel} pulls off you walks straight out instead of sitting there.</p></div>",
            ),
            (
                "<div><h3>The core lets it out</h3><p>Twenty centimetres of pocket springs is mostly air. Foam blocks hold heat because there is nowhere for it to go. This has somewhere.</p></div>",
                f"<div><h3>{core} gives it somewhere to be</h3><p>Twenty centimetres of pocket springs is mostly air. A foam block holds heat because heat has nowhere to go in a block. This is two thousand springs and the space between them.</p></div>",
            ),
            (
                '<p class="kicker">What we do not claim</p><h2>It will not make you cold.</h2>',
                f'<p class="kicker">{brand} {gel}</p><h2>Gel in the middle<br>does nothing.</h2>',
            ),
            (
                "No mattress does. Cooling gel in a solid block warms up within an hour and stays warm. What a mattress can do is not add to the problem, and let the heat you make leave.",
                "Every mattress claims cooling gel. Most of them bury it in the middle of a foam block, where it absorbs heat for an hour and then holds it against you all night, because there is nowhere for that heat to leave.",
            ),
            (
                "The gel layer here is one centimetre, on top, where it can dissipate. It is not the mechanism. The springs are.",
                f"{gel} sits one centimetre from the surface, directly beneath {cover}. It takes the heat off your skin where you can actually feel it, and the cover carries it out of the bed. Same material everyone else uses, put somewhere it can work, and the difference is the whole night.",
            ),
        ],
    }
    patches["other-size"] = list(patches["size"])

    # Spec pages: rebuild key layer rows and section copy from tokens
    for handle in ("spec-size", "spec-only"):
        patches[handle] = [
            (
                "<b>Cool-knit cover</b><span>400 gram, zipped the whole way round</span>",
                f"<b>{brand} {cover} cover</b><span>400gsm. The most effective cooling material on the market, knitted open so body heat passes straight through</span>",
            ),
            (
                "<b>Gel memory foam</b><span>One centimetre, 28 density</span>",
                f"<b>{brand} {gel} gel</b><span>One centimetre, at the surface. Pulls heat off your skin the moment it leaves you</span>",
            ),
            (
                "<b>Wave-profile airflow foam</b><span>Two and a half centimetres, cut to let air move</span>",
                "<b>Wave-profile airflow foam</b><span>Two and a half centimetres. Channels cut through it so air moves when you do</span>",
            ),
            (
                "<b>Seven-zone pocket spring core</b><span>Twenty centimetres. 2.0mm wire at hips and shoulders, 1.8mm elsewhere</span>",
                f"<b>{brand} {core}</b><span>Twenty centimetres. Two thousand springs, seven zones, two wire gauges. Guaranteed twenty five years</span>",
            ),
            (
                '<p class="kicker">The core</p><h2>Seven zones, two wire gauges,<br>every spring in its own pocket</h2>',
                f'<p class="kicker">{brand} {core}</p><h2>Two thousand springs.<br>Not one of them touches another.</h2>',
            ),
            (
                "Two millimetre wire under the hips and shoulders, where the weight lands. One point eight everywhere else. Each spring in its own fabric pocket.",
                f"{core} is what a mattress should have been doing all along. Two thousand springs, wound, heat-set and sleeved one by one, so each answers only to the weight directly above it. Your shoulder does not decide what your hip gets. Nobody turning over at three in the morning decides anything for you.",
            ),
            (
                "Twenty centimetres of it, guaranteed for twenty five years. It is the part that does not come out, because it is the part that does not wear.",
                "Seven bands run the length of it, set to the shape of a person rather than the shape of a rectangle. Two millimetre wire holds the hips and shoulders, where a body lands hardest. One point eight through the waist and legs, where it does not. You are not the same weight all the way down, so the bed is not the same tension all the way down.</p>\n<p>Twenty centimetres of it. Guaranteed a quarter of a century, because it is the part that never comes out and never wears.",
            ),
            (
                "<h2>Medium one face.<br>Medium firm the other.</h2>",
                "<h2>One layer.<br>Two different nights.</h2>",
            ),
            (
                "Ten centimetres, two densities laminated together. Turn it over and the feel changes. That is the first adjustment, and it costs nothing.",
                "Ten centimetres, two densities bonded face to face. Sleep on one side and the bed gives a little more. Turn it over and it holds you a little higher. Same mattress, a different night, and it costs nothing to change your mind.",
            ),
            (
                "If neither face is right, tell us how it should feel and we build a new one to that. For a year, with our compliments.",
                "If neither face is yours, tell us how it should feel. We cut and assemble a new one to your description and send it, for a year, with our compliments. Most people ask once. Some never do.",
            ),
            (
                "<h2>Zipped the whole way round</h2>",
                "<h2>The most effective cooling<br>material on the market.</h2>",
            ),
            (
                "Four hundred gram cool-knit, breathable, closed with a zip that runs the full perimeter. The zip is why the comfort layer can come out.",
                f"{cover} is the most effective cooling material on the market. Knitted at 400gsm, four times the weight of what most mattresses arrive in, and open enough that heat walks straight out of it instead of gathering under you. Heavy in the hand, weightless to sleep on.",
            ),
            (
                "Nothing is glued. Nothing is tufted. The build is held together by the cover, which means the build can be opened.",
                f"It works with {gel}, one centimetre of gel directly beneath it. {gel} takes the heat off your skin. {cover} lets it go. Neither does much alone, which is why everyone else's gel sits buried in foam doing nothing.</p>\n<p>The zip that closes it runs every side. That is why the comfort layer lifts out. Nothing is glued. Nothing is tufted. The cover is what holds the build together, which is also what lets the build come apart.",
            ),
        ]

    for handle, reps in patches.items():
        path = PREVIEW / "pages" / f"{handle}.html"
        if not path.exists():
            print("skip missing preview", handle)
            continue
        text = path.read_text()
        n = 0
        for old, new in reps:
            if old in text:
                text = text.replace(old, new, 1)
                n += 1
            else:
                # try without exact match noise
                pass
        # Global cool-knit sweep on LP preview
        before = text
        text = re.sub(r"Cool-Knit cover", f"{brand} {cover} cover", text, flags=re.I)
        text = re.sub(r"cool-knit cover", f"{brand} {cover} cover", text, flags=re.I)
        text = re.sub(r"\bCool-Knit\b", cover, text)
        text = re.sub(r"\bcool-knit\b", cover, text, flags=re.I)
        text = text.replace("lp.css?v=lp-v12", "lp.css?v=lp-v18")
        if text != before or n:
            path.write_text(text)
            print(f"preview {handle}: {n} surgical + coolknit sweep")
        else:
            print(f"preview {handle}: no changes")


def patch_redesign_layers() -> None:
    """Shared layer table on manufacturing/redesign: Cool-Knit → brand coolweave tokens."""
    path = THEME / "sections" / "redesign.liquid"
    text = path.read_text()
    if "settings.cover_material" in text and "Cool-Knit cover" not in text:
        print("redesign already patched")
        return
    # Inject assigns near top if needed - redesign may already have brand
    if "assign cover = settings.cover_material" not in text:
        # Prepend liquid assign block after first line if file starts with markup
        inject = (
            "{%- liquid\n"
            "  assign brand = settings.brand_name | default: 'Numa'\n"
            "  assign cover = settings.cover_material | default: 'Coolweave'\n"
            "  assign gel = settings.gel_material | default: 'Coolcell'\n"
            "  assign core = settings.core_name | default: 'Sevencore'\n"
            "-%}\n"
        )
        if text.lstrip().startswith("{%- liquid") or text.lstrip().startswith("{% liquid"):
            # insert into existing
            text = text.replace(
                "assign brand = settings.brand_name | default: 'Numa'",
                "assign brand = settings.brand_name | default: 'Numa'\n"
                "  assign cover = settings.cover_material | default: 'Coolweave'\n"
                "  assign gel = settings.gel_material | default: 'Coolcell'\n"
                "  assign core = settings.core_name | default: 'Sevencore'",
                1,
            )
            if "assign cover = settings.cover_material" not in text:
                text = inject + text
        else:
            text = inject + text

    reps = [
        ('data-rd-layer-name="Cool-Knit cover"', 'data-rd-layer-name="{{ brand }} {{ cover }}"'),
        ("<h3>Cool-Knit cover</h3>", "<h3>{{ brand }} {{ cover }}</h3>"),
        ('alt: "Cool-Knit cover, 400 gram"', 'alt: brand | append: " " | append: cover | append: ", 400 gram"'),
        ("<h3>400 gram cool-knit</h3>", "<h3>400 gram {{ cover }}</h3>"),
        ("a 400 gram cool-knit cover", "a 400 gram {{ cover }} cover"),
        ("400g cool-knit cover", "400g {{ cover }} cover"),
        ("400 gram cool-knit cover", "400 gram {{ cover }} cover"),
        ('alt: "Cool-knit cover detail"', 'alt: cover | append: " cover detail"'),
        ('alt: "Cool-knit cover, macro"', 'alt: cover | append: " cover, macro"'),
        ("cool-knit cover", "{{ cover }} cover"),
        ("Cool-knit cover", "{{ brand }} {{ cover }}"),
    ]
    for a, b in reps:
        text = text.replace(a, b)
    path.write_text(text)
    print("patched redesign.liquid layer naming")


def main() -> None:
    if not V18.exists():
        raise SystemExit(f"missing {V18}")
    patch_lp_liquid()
    update_json_templates()
    update_preview_pages()
    patch_redesign_layers()
    print("done")


if __name__ == "__main__":
    main()
