# Policy change log

Full wording for each trust-policy page is stored as a dated text file so we can see what the customer-facing copy was at a given datetime.

Required set: 100-night trial, 365-night programme, terms, privacy. Warranty, refunds, delivery, and cookies are snapshotted with them.

## Layout

- `CHANGELOG.txt` — newest first, datetime + what changed
- `snapshots/YYYY-MM-DDTHHMMSSZ/<handle>.txt` — the policy text at that moment

## When you change a policy

1. Edit the page body in Shopify, or the fallback copy in `valtora-theme/templates/page.*.json` and the matching `preview/pages/*.html`.
2. Set **Last modified (UTC)** on the Trust policy section to the same ISO datetime (for example `2026-09-22T14:01:30Z`). Leave it blank only if Shopify `page.updated_at` should drive the stamp.
3. Run:

```bash
python3 scripts/snapshot-policies.py "What changed, in one line"
```

The live page stamp and this folder must agree. Do not rewrite an old snapshot; add a new dated folder.
