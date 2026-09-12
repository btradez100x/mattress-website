# 13.0.0 — landing-pages

**Date:** Saturday 12 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `deef30d` |
| `shopify-theme` | `0a72a59` |

## What shipped

Nine ad-group landing pages as rearrangeable `lp` section blocks, with the real size picker and no lead time on the page.

| Handle | URL | Notes |
|---|---|---|
| `king-and-super-king` | `/pages/king-and-super-king` | Create page; sizes filtered to launch large sizes |
| `support-and-comfort` | `/pages/support-and-comfort` | Create page |
| `best-mattress` | `/pages/best-mattress` | Create page |
| `single-and-small-double` | `/pages/single-and-small-double` | Create page; Single and Small Double only |
| `mattress-that-opens` | `/pages/mattress-that-opens` | Create page; no competitor names |
| `pocket-sprung-king` | `/pages/pocket-sprung-king` | Create page; configure third; spring and compression video |
| `side-sleeper-mattress` | `/pages/side-sleeper-mattress` | Create page |
| `hybrid-mattress` | `/pages/hybrid-mattress` | Create page; configure third; spring and compression video |
| `cooling` | `/pages/cooling` | Replaces the previous cooling redesign content |

Shared pieces: `sections/lp.liquid`, `assets/lp.css`, configure `allowed_size_ids` + `hide_lead_time` on `landing-funnel`, preview mirrors under `preview/pages/`. Extended returns note uses the shipped “not covered by the N day returns policy” wording. Cart files untouched.

## What was left out

Shopify Admin pages still need creating (except Cooling) and templates assigned. No VERSION bump. Editorial landers (`specification`, `manufacturing`, `large-sizes`, `european-king`, journal) unchanged. Pre-existing smoke fails (footer lockup, password, grounds, lifestyle assets) left as they were.
