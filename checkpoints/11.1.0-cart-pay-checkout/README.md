# 11.1.0 — cart-pay-checkout

**Date:** Thursday 3 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped.

| Tree | SHA |
|---|---|
| `v9` | `8513c8a` |
| `shopify-theme` | `a20fd56` |

## What shipped

Cart Pay was clearing the Shopify cart and re-adding lines from local storage before opening hosted `/checkout`. If that rebuild failed, the cart was empty, Shopify bounced back to `/cart`, and Stripe never loaded.

Pay now updates quantities in place, then posts the native checkout form (or goes to `/checkout`). Preview Pay still goes to order-confirmed.

## What was left out

- Size-selector redesign from New mods v2
- VERSION bump
- The local `8cc9f56` trade-page-redeploy checkpoint tarball was not pushed (too large for GitHub HTTP)

## Store

Numa Mattress `7dbr1b-1q`. Hard-refresh `/cart` after Shopify Connect pulls `shopify-theme`.
