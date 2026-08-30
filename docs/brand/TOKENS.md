# Live tokens — Numa navy / gold / cream

Live storefront uses **V1 Signature**, not Carbon/Snow from the a1e2 zip. Gold is a brand colour on light grounds. On navy, type is cream.

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
| `--radius-control` | **12px** | Buttons: `.btn`, ADD, RESERVE YOURS, Continue, hero CTAs, Checkout pay |
| `--radius` / `--radius-card` | **16px** | Size cards, YOUR ORDER, note textarea, Request a size |
| `--shadow-card` | `0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(31,58,95,.08)` | Cards and order panel |

Do not flatten to 0 or 2px. Sticky basket **bar** stays full-bleed; the inner Continue button is 12px.

Optional V2 schemes (Carbon `#1A1A1A`, Graphite `#3A3A3C`, Snow `#F5F4F1`) remain in Theme settings but are not the default.
