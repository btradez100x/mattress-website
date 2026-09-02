# Brand guidelines — live storefront

**Live Numa is V1 navy / gold / cream.** The a1e2 zip described Carbon/Snow with Ember as ornament only. That overlay went too far: it deleted gold as a brand colour. Do not last-win Carbon `#1A1A1A` over the storefront.

## Live tokens (restore these)

| Token | Hex | Role |
|---|---|---|
| `--brand-primary` / Deep navy | `#1F3A5F` | Dark sections, CTAs, wordmark line 2 |
| `--brand-accent` / Gold / Ember | `#8A6D3B` | Wordmark on light header, eyebrows on cream, 1px rules, focus rings |
| `--brand-bg` / Cream | `#F7F5F1` | Primary background |
| `--brand-surface` / Soft stone | `#EAE6DF` | Cards, surfaces |
| `--brand-ink` | `#222222` | Body on cream |
| `--brand-on-dark` / Cream | `#F7F5F1` | Body, headings, captions on navy |

**On navy/dark sections:** body, headings, and captions stay cream. Do not paint gold paragraphs on navy. Gold may remain for small eyebrows on light grounds and for hairlines.

## Zip (type is live; colour overlay is V1 navy / gold / cream)

| What | Path |
|---|---|
| Zip | `docs/brand/Brand_guidelines_a1e2.zip` |
| Extracted files | `docs/brand-guidelines-a1e2/Brand guidelines/` |
| Live CSS overlay | `valtora-theme/assets/brand.css` (loaded last: cream-on-dark + gold rules + type lock; does **not** force Carbon) |

**Type:** Instrument Sans (headings / wordmark), Inter (body), Geist Mono (labels). Loaded once from `theme.liquid`. No serif.

Theme settings: `brand_guidelines` = `v1`, `color_scheme` = `signature`. Checkout and VERSION are unchanged.

Legal entity: **Valtora FZE**. Brand name remains a theme setting (never hard-code it).
