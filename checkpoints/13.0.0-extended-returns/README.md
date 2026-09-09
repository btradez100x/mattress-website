# 13.0.0 — extended-returns

**Date:** Wednesday 9 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `26416fe` |
| `shopify-theme` | `66e3df9` |

## What shipped

Extended returns now follow the size and market table. The cart line note is the same sentence Emperor already used: “Not covered by the 100 day returns policy.” A mixed basket names the excluded size. Policy pages list the sizes for the current market.

- Emperor — every market
- US King and California King — the UK and Ireland
- Split King — the UK, Ireland, and the UAE

Adjust to Desire still applies. The statutory 14 days are unaffected. Single and Small Double stay covered.

## What was left out

Shopify variant metafields and the returns_policy metaobject were not created in admin. The theme holds the launch table until those fields exist. Day 25 email suppression was not wired. No VERSION bump.
