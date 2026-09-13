# 13.0.0 — lp-v11-pack

**Date:** Sunday 13 Sep 2026  
Named deploy checkpoint. `VERSION` was not bumped.

| Tree | SHA |
|---|---|
| `v9` | `309237d64598e13b0f246bacc0f23537f9b02668` |
| Connect / `shopify-theme` | `d99a695c137bd138a790730a0603d81f3192dfd4` |

## What shipped

v10b nested **v11** HTML pack (preferred over v10) into the nine live LPs, guided by the written paid-search spec.

- **Size strip** under the hero lede on size / other-size / spec pages (and on premium’s late price band).
- **Payment row** under every From price (Visa…Klarna mono chips). Klarna monthly amount bolded.
- **Arriving** block rebuilt as carbon `arrive` with Beforehand / On the day / Same visit labels. Lead time still hidden on all LPs.
- **Assurance** plaque: centred, carbon border, Ember square marks.
- Section order: hero → press-logos → story → configure (spec pages keep configure early; press + assurance after more).
- Rearrangeable `lp.liquid` blocks kept; homepage `press-logos` + `size-reserve` reused; dynamic From price preserved; GTM / `lp_variant` tracking preserved.
- Handles unchanged: `size`, `need`, `premium`, `other-size`, `conquest`, `spec-size`, `need-only`, `spec-only`, `temperature`.

## What was left out

- No VERSION bump. Cart protected files untouched.
- Downloads written spec’s five-route collapse not applied — zip plan + nine HTML files + live nine handles win.
- SEO `lp-*` handle rename not applied (would break live ad destinations).
- Concierge/removal steppers already restored in `3047c1b` / checkpoint `13.0.0-service-steppers-restore`.
- Pre-existing smoke fails (footer lockup, landing configure check, feel-ladder grounds, Trade copy) left as-is.
