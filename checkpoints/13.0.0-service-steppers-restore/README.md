# 13.0.0 — service-steppers-restore

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `3047c1be425c8d6331333766c5138ac22386d58a` |
| `shopify-theme` | `128fb47fae949f7ffb96d0758309366913a7939d` |

## What shipped

Restored the option to reduce or remove **Concierge unpacking** and **Old mattress removal** on the order surface.

- `/cart` order summary: service block unhides with `removeAttribute` when mattresses are in the basket; Remove / Add back and removal qty steppers keep working.
- Size-page **Your order** panel: locked Complimentary lines replaced with the same Remove / qty controls (shared storage keys).
- Theme + preview `theme.js` / `base.css` synced. Collection fee setting untouched.

## What was left out

No VERSION bump. Lead-time band and `/pages/checkout` → `/cart` redirect unchanged. Pre-existing smoke fails (footer lockup, landing configure check, grounds) left as they were.
