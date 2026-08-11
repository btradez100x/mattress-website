# Regression results log

Copy a new **Run** block for each execution. Case IDs refer to [`REGRESSION_PACK.md`](./REGRESSION_PACK.md).

---

## Run template

```
### Run YYYY-MM-DD — <Smoke | Full | Acceptance>
- Environment: <theme preview URL / store>
- Theme version / commit:
- Deposit app:
- Markets enabled:
- Tester:
- Browser/devices:

| ID | Result (Pass/Fail/N/A) | Notes |
|---|---|---|
| SM-01 | | |
| SM-02 | | |
| … | | |

P0 failures:
P1 failures:
Decision: Ship / Hold
Signed:
```

---

## Run 2026-08-08 — Baseline (theme scaffold)

- Environment: Local theme files + static `preview/`; Shopify store not yet connected for deposit E2E
- Theme version / commit: initial `valtora-theme` MVP
- Deposit app: not installed
- Markets enabled: n/a (preview forced AE)
- Tester: builder
- Browser/devices: static preview

| ID | Result | Notes |
|---|---|---|
| SM-01 | Pass (static) | Preview landing renders end-to-end |
| SM-02 | Pass (static) | Text wordmark VALTORA |
| SM-03 | Pass (static) | Tokens in preview `:root` |
| SM-04 | Pass (static) | UAE sizes + cm via `theme.js` |
| SM-05 | Pass (static) | Tier price updates |
| SM-06 | N/A | Needs Shopify cart |
| SM-07 | N/A | Needs Shopify cart attributes |
| SM-08 | N/A | Needs Shopify |
| SM-09 | N/A | Needs theme editor |
| SM-10 | Pass (static) | Preview usable at mobile width — retest on store |
| SM-11 | Pass | `shopify theme check` — 0 errors (RemoteAsset warnings only) |
| SM-12 | Pass | `./scripts/regression-smoke.sh` exit 0 |

P0 failures: none on static/automated scope  
P1 failures: n/a  
Decision: **Hold for store-connected smoke (SM-06+)** before ads  
Signed: builder
