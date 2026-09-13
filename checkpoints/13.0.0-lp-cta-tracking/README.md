# 13.0.0 — lp-cta-tracking

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | *(commit after this deploy)* |
| `shopify-theme` | *(sync after this deploy)* |

Base fold already live: `v9` `7c3479a` / `shopify-theme` `6001b54` (press-logos + size-reserve). This checkpoint adds size-reserve Add/Continue `cta_click` on top.

## What shipped

- All nine ad LPs keep the default `theme` layout → GTM (`GTM-MX9SHNSM`), Consent Mode, `tracking-pixels`. Microsoft/Meta/GA4 via GTM.
- `data-lp-page` / `data-lp-variant` seed first-touch `lp_variant` on every `vTrack` event.
- `cta_click` on: LP hero primary/secondary, header Reserve yours, size-reserve **Add** (`size_add`), size-reserve **Continue/Add to basket** (`reserve_continue`).
- Existing funnel events unchanged: `select_size`, `add_to_basket`, `configure_start`/`configure_complete`, `reserve_intent`, `begin_checkout` — all carry `lp_variant`.
- Press-logos + size-reserve sections left in place (not reverted to landing-funnel).

## CTA → event map

| CTA | Event(s) | `cta_position` / notes |
|---|---|---|
| Hero primary | `cta_click` | `hero_primary` |
| Hero secondary | `cta_click` | `hero_secondary` |
| Header Reserve yours | `cta_click` | `header` / `header_mobile` |
| Size tile Add | `cta_click` + `add_to_basket` (+ `select_size` / `configure_complete`) | `size_add` |
| Continue / Add to basket | `cta_click` + `reserve_intent` | `reserve_continue` |
| Page load | `lp_view` | + scroll_depth / engaged_session / scroll_past_price |

## What was left out

- No VERSION bump. Cart protected files untouched.
- No direct Microsoft UET in theme (GTM). Clarity legacy-only when GTM blank.
