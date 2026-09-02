# Live tokens — Numa navy / gold / cream

Live storefront uses **V1 Signature**, not Carbon/Snow from the a1e2 zip. Gold is a brand colour on light grounds. On navy, type is cream.

## Type

Live type is the a1e2 zip system. One load in `theme.liquid`. Do not mix serif.

| Token | Value | Role |
|---|---|---|
| `--font-display` / `--font-headline` / `--font-wordmark` | `'Instrument Sans', system-ui, sans-serif` | Headings, wordmark, prices |
| `--font-text` / `--font-sans` | `'Inter', system-ui, sans-serif` | Body, H3, UI |
| `--font-mono` | `'Geist Mono', ui-monospace, monospace` | Labels, eyebrows, measurements |

`--font-serif` is an alias of Instrument Sans so leftover rules cannot swap to Georgia/Fraunces.

## Colour

| Token | Hex | Role |
|---|---|---|
| `--brand-primary` / Deep navy | `#1F3A5F` | Dark sections, CTAs |
| `--brand-accent` / Gold | `#8A6D3B` | Wordmark on light, eyebrows on cream, 1px rules, focus |
| `--brand-bg` / Cream | `#F7F5F1` | Primary background |
| `--brand-surface` / Soft stone | `#EAE6DF` | Cards |
| `--brand-ink` | `#222222` | Body on cream |
| `--brand-on-dark` | `#F7F5F1` | Type on navy |

**Never gold body copy on navy.** Cream on dark is the contrast lock (`d205fc5` / brand.css overlay). Carbon `#1A1A1A` is not the live dark ground.

## Radius

| Token | Value | Use |
|---|---|---|
| `.btn` | **12px** | Page CTAs. Sticky Continue rounded; bar full-bleed. |
| Size / delivery cards | **0.35rem** | Original `4fee53a` chrome: white fill, hairline, selected shadow. Not 2px, not 16px. |

Photos stay square. Do not reintroduce 2px fake radius or the 16px filled-card system.

Optional V2 schemes (Carbon `#1A1A1A`, Graphite `#3A3A3C`, Snow `#F5F4F1`) remain in Theme settings but are not the default.
