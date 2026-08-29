# 9.4.0 — numa-brand-default

**Date:** Saturday 29 Aug 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **9.4.0** (`landing-pages-and-gtm`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `6fb7580` | Default the storefront brand to Numa so Connect no longer overwrites live Theme settings with Aligna |
| Connect / `shopify-theme` | `40b8b85` | Subtree of `valtora-theme/` at this deploy |

`6fb7580` message: *Default the storefront brand to Numa so Connect no longer overwrites live Theme settings with Aligna.*

Shopify Connect should pull `shopify-theme` onto the live theme. Theme settings → Brand name (line 1) is now **Numa** in `settings_data.json`. That file is what the last deploy used to overwrite the Admin value.

`preview-and-theme.tar.gz` — local snapshot of `preview/` + `valtora-theme/` at this deploy.

## What shipped (theme / code)

- `brand_name` in Theme settings data, schema default, and locale default is **Numa**.
- Liquid and JS fallbacks that used Aligna now use Numa. Leftover-copy replace filters and the title rewrite regex still recognise Aligna so old titles get rewritten.
- Sixteen lifecycle emails re-baked to Numa / NUMA from Theme settings line 1.
- Preview wordmarks, titles, and the homepage brand control default to Numa. A saved preview brand of Aligna is migrated to Numa.

## What was left out

- Contact email is still `hello@aligna.com` in Theme settings. No Numa address was set.
- Legal entity remains **Valtora FZE**.
- Frozen `share/v4` snapshot still has Aligna in HTML. It is not the live theme.
- SemVer export / zip. `VERSION` stays **9.4.0**.
- Product flags. Comfort layer / sheets / pillows remain off.

Restore:
```bash
tar -xzf checkpoints/9.4.0-numa-brand-default/preview-and-theme.tar.gz
```
