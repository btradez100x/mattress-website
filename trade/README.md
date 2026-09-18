# Onni London trade site

Static trade pages. Node builds `src/` to `dist/`. A static host serves `dist/`.
No framework, no `npm install`, no runtime.

This folder is the Onni London trade pack plus tests and versioning. It is not
the Shopify theme (`valtora-theme/`). Body copy uses numerals (12 not twelve).

## Run

```bash
cd trade
node build.mjs --check    # required. Fails on a hardcoded name or a voice breach
node --test test/*.test.mjs
```

`dist/` is deleted and rewritten on every build. Never edit it.

Brand names live in `brand.json` as `{{group.key}}` tokens. Change a value,
rebuild, every page and `<title>` updates.

## Pages

Access is enforced at the host or CDN, **before** a file is served. This repo
does not store partner passwords. See `DEPLOYMENT.md`.

| File | Access |
|---|---|
| `index.html` | Open |
| `modern-slavery.html` | Open |
| `sales-consultant.html` | Open |
| `b2b-strategy.html` | Internal |
| `specification.html` | Specification partners |
| `retail.html` | Retail partners |
| `contract.html` | Contract buyers |

## Versioning

Semver on this package only (`onni-london-trade`). Conventional commits that
touch `trade/` open a release-please PR on `main`. Merging that PR tags
`onni-london-trade-vX.Y.Z` and updates `CHANGELOG.md`.
