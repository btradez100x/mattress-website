# 10.1.0 — latest export (simple Downloads names)

**Date:** Sunday 30 Aug 2026  
Named snapshot for Downloads / Shopify Admin upload. `VERSION` was **not** bumped. Current line remains **10.1.0**.

## Simple names (use these)

| File | What it is |
|---|---|
| `Numa-website-latest.zip` | Theme zip for Shopify Admin upload (folders at zip root) |
| `Numa-website-latest-preview-and-theme.tar.gz` | `preview/` + `valtora-theme/` snapshot |

Repo copy of the preview+theme pack: `checkpoints/10.1.0-latest/preview-and-theme.tar.gz`

Restore:
```bash
tar -xzf checkpoints/10.1.0-latest/preview-and-theme.tar.gz
```

Pointer file in the repo root: `DOWNLOADS-HERE.txt`

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `cursor/lates-changes-29th-2577` | `723485a` | Committed line at pack time |
| Connect source `v9` | `acbccda` | Last v9 at pack time |
| Connect / `shopify-theme` | `f9bfed3` | Theme subtree at pack time |

This pack is a **working-tree snapshot** of `preview/` + `valtora-theme/` at export time.

Checkout was not modified. Legal name **Valtora FZE**.
