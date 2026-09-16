# 13.0.0 — lp-v18-reviews-visible

**Date:** Wednesday 16 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

| Tree | SHA |
|---|---|
| `v9` | `58d0bb9b50861af129c926f4b0acdade6f93af4d` |
| Connect / `shopify-theme` | `839a88f8d77de1e45a8220388982a168236bc3e5` |

## What shipped

v18 LP polish on the nine zip-stem handles (`size`, `need`, `premium`, `other-size`, `conquest`, `spec-size`, `need-only`, `spec-only`, `temperature`).

### Reviews (root cause + fix)
- **Cause:** `revstrip` started with HTML `hidden` and only unhid after JS fetched `reviews.json`. Empty score/count meant a failed or late fetch left the strip invisible forever.
- **Fix:** SSR visible out-of-5 widget with **4.96** / 500 from shared `reviews.json`; JS refreshes from `summary` when fetch succeeds. Stars + score + count + link, above press.

### Press / payment / rhythm / copy
- Compact HTML **press row** (wordmarks, no awards).
- **Pay by** chip row under From (Visa…Klarna 3 / 24) with Klarna pink mark; pay still renders if From is empty.
- Desktop gaps: collapse consecutive `.lp` section pads, flush double-pad, hero line at `--s5` (not a second full `--sec` before revstrip); configure keeps brand 72/128.
- LP marketing copy uses **figures** (35 cm, 4 minutes, 25 years); `seven-zone` kept as compound product term.
- Coolweave / Coolcell / Sevencore via `[Brand]` / `[Cover]` / `[Gel]` / `[Core]` settings.
- Heading display weights use `var(--heading-weight, 700)` in `lp.css` + `redesign.css` (Guidelines 700; no LP-only hard 600).

### Kept
- `size-reserve` `#configure`, lead time hidden, dynamic From, tracking, zip-stem handles.

## What was left out

- No VERSION bump. Cart protected files untouched.
- Spec five-route collapse (`/lp/support` etc.) not applied — nine zip stems remain.
- Pre-existing smoke fails (landing configure cart add, etc.) left as-is.
