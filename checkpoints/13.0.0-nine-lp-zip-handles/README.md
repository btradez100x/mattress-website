# 13.0.0 — nine-lp-zip-handles

**Date:** Saturday 12 Sep 2026  
**This is a named deploy checkpoint** (rollback / fix version), not a SemVer export. `VERSION` was **not** bumped. MAJOR was **not** bumped. Current line remains **13.0.0** (`guarantee-page-and-basket`).

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `v9` | `9d69b0490fcadbe6a86c322779b9480f18889718` | Zip-derived LP handles + prototype copy |
| Connect / `shopify-theme` | `65e188a921cdd56a378446f628b4682460fb551b` | Theme tree at this deploy |

Shopify Connect should pull `shopify-theme`. Connect can lag a minute.

## What shipped

- Handles: `size`, `need`, `premium`, `other-size`, `conquest`, `spec-size`, `need-only`, `spec-only`, `temperature`
- Block-based `lp.liquid` defaults; separate `landing-funnel` configure at `#configure` (third on `spec-size` / `spec-only`)
- Prototype copy restored; redesign `cooling` restored; wrong-handle templates removed
- Size filters: launch / single+small-double / king group / full per plan

## Admin checklist

| Handle | URL |
|---|---|
| size | /pages/size |
| need | /pages/need |
| premium | /pages/premium |
| other-size | /pages/other-size |
| conquest | /pages/conquest |
| spec-size | /pages/spec-size |
| need-only | /pages/need-only |
| spec-only | /pages/spec-only |
| temperature | /pages/temperature |

Create each page in Admin and assign the matching `page.*` template. Unpublish any old professional-handle pages if they exist.

## What was left out

- VERSION bump; cart files; Cursor plan edits
