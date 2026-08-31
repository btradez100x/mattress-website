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
| `--radius` / `--radius-control` | **2px** | CTAs, size cards, YOUR ORDER, note field. Original subtle curve (`2dc913c` / `01de629`). |

Do not bump to 12px / 16px. Photos stay square. Sticky basket **bar** stays full-bleed.

Optional V2 schemes (Carbon `#1A1A1A`, Graphite `#3A3A3C`, Snow `#F5F4F1`) remain in Theme settings but are not the default.
