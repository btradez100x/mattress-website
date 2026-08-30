# Extracted tokens — Brand_guidelines_a1e2.zip

Source: `BRAND-GUIDELINES.md` (complete reference). Aliases in parentheses are the names used in the older Valtora visual DOCX / user shorthand.

## Colour

| Token | Hex | Role | User shorthand |
|---|---|---|---|
| `--ground-light` / Snow | `#F5F4F1` | Primary background | cream / snow |
| `--ground-soft` / Bone | `#E4E1DA` | Cards, surfaces | stone |
| `--ground-mid` / Graphite | `#3A3A3C` | Secondary dark, muted text | — |
| `--ground-dark` / Carbon | `#1A1A1A` | Dark sections, headings, body, wordmark on light | navy (live dark ground) |
| `--accent` / Ember | `#8A6D3B` | Fine detail only. Never a fill. Never above 2% of a view | gold |
| `--hair` | `#D6D2CA` | 1px rules on light | — |
| `--hair-dark` | `#2E2E30` | 1px rules on dark | — |

Retired visual-DOCX palette (photography/ads only; **not** live type): Deep Navy `#1F3A5F`, Off-White `#F7F5F1`, Soft Stone `#EAE6DF`, Ink `#222222`. Same Ember/gold hex.

### Contrast matrix (permitted pairs only)

| Text | on Snow | on Bone | on Graphite | on Carbon |
|---|---|---|---|---|
| Carbon | 15.8 AAA | 13.3 AAA | Forbidden | Forbidden |
| Graphite | 10.3 AAA | 8.7 AAA | Forbidden | Forbidden |
| Snow | Forbidden | Forbidden | 10.3 AAA | 15.8 AAA |
| Bone | Forbidden | Forbidden | 8.7 AAA | 13.3 AAA |
| Ember | 4.4 large only | 3.7 large only | Forbidden | 3.6 large only |

Working pairs:

| Ground | Primary text | Secondary text | Rules |
|---|---|---|---|
| Snow / Bone | Carbon | Graphite | Hair |
| Graphite / Carbon | Snow | Bone | HairDark |

**Ember/gold is never body text, never a link colour, never a button fill.** Large-only (18.66px regular or 14px bold+) or non-text (1px rules, focus rings). Eyebrow under-rule: 1px × 40px Ember.

## Wordmark

- Rendered from the brand-name setting. Not an image.
- **Light ground: Carbon/navy (`#1A1A1A` / `#1F3A5F` on retired v1). Dark ground: Snow/cream (`#F5F4F1`).**
- Gold on navy is wrong. Single colour. No stretch, shadow, outline, or gradient.
- Sentence case in the live v2 system (Instrument Sans 700, tracking `-0.02em`). Visual DOCX all-caps + 0.12–0.18em applies only if v1 classic serif is explicitly selected.

## Type

| Token | Value |
|---|---|
| `--font-display` | `'Instrument Sans', system-ui, sans-serif` |
| `--font-text` | `'Inter', system-ui, sans-serif` |
| `--font-mono` | `'Geist Mono', ui-monospace, monospace` |

| Level | Desktop | Mobile | Line height | Tracking |
|---|---|---|---|---|
| Display | 64px | 38px | 1.02 | -0.045em |
| H2 | 44px | 30px | 1.10 | -0.035em |
| H3 | 24px | 20px | 1.25 | -0.015em |
| Body large | 19px | 17px | 1.55 | 0 |
| Body | 16px | 16px | 1.60 | 0 |
| Caption | 14px | 14px | 1.50 | 0 |
| Label | 12px | 12px | 1.40 | +0.14em uppercase |

No serif on the live v2 system. `font-variant-numeric: tabular-nums` on every number. Body never below 16px. Measure: body 66ch, lede 56ch, display 20ch, H2 24ch.

## Space

Scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`

| | Desktop | Mobile |
|---|---|---|
| Columns | 12 | 4 |
| Gutter | 24px | 16px |
| Max width | 1240px | — |
| Page margin | 80px min | 20px |
| Section rhythm | 128px | 72px |

Breakpoints: sm 640 · md 860 · lg 1024 · xl 1240. `--radius: 0` (checkbox 2px is the only radius).

## Motion

| Token | Value |
|---|---|
| `--dur-fast` | 120ms |
| `--dur-panel` | 280ms |
| `--dur-base` | 450ms |
| `--dur-wipe` | 600ms |
| `--ease` | `cubic-bezier(0.22, 1, 0.36, 1)` |

**One curve. Never a second.** Zip matches the existing smoke check (`0.22, 1, 0.36, 1`) — do not change smoke. Reveal: opacity + `translateY 20px → 0` only. `prefers-reduced-motion: reduce` disables motion.

## Buttons (global; do not restyle the size picker)

Primary: Carbon fill, Snow 15px/600, padding 15×24, min-height 48, radius 0. Hover `#000000` at 120ms. Focus-visible: 2px Ember, 4px offset.

On dark grounds: invert — Snow fill, Carbon text, hover to Bone.

Never: rounded corners, shadows, gradients, icons in buttons, scale/lift, more than one primary per view.

## Photography

Neutral colour temperature. High contrast. Low saturation. Deep clean shadows. Directional raking light. Loose crop. No grain. Real product; generated rooms allowed. Hero &lt; 300KB, others &lt; 200KB.
