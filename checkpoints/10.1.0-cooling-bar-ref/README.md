# 10.1.0 — cooling bar reference (i-cooling.html `.banner`)

**Date:** Tuesday 2 Sep 2026  
Named look lock. `VERSION` was **not** bumped. Current line remains **10.1.0**.  
Checkout was not modified.

This checkpoint locks the sitewide concierge unpacking announcement bar to the HTML bar in `i-cooling.html`. Do not invent a new bar. Do not paint the whole bar gold.

Copy:

> Concierge unpacking **included with every mattress** · To the room of your choice, packaging taken away

## Files for review

| File | What it is |
|---|---|
| `i-cooling.html` | Source HTML (`.banner`) |
| `announcement-bar.liquid` | Live theme section (`.announcement`) |
| `announcement.css` | HTML `.banner` CSS + mapped theme CSS |

## HTML `.banner` vs live `.announcement`

HTML tokens: `--carbon:#1A1A1A` `--snow:#F5F4F1` `--mono:'Geist Mono','IBM Plex Mono',ui-monospace,monospace` gold `#C4A46A`.

| Property | HTML `.banner` | Theme before | Theme locked |
|---|---|---|---|
| background | `var(--carbon)` `#1A1A1A` | navy `--brand-primary` | `#1A1A1A` |
| color | `var(--snow)` `#F5F4F1` | gold mix on every node | `#F5F4F1` |
| `b` | `#C4A46A` / weight 500 | same gold mix / 600 | `#C4A46A` / 500 |
| font | `--mono` 11px | 14px / 500 / no mono | `--font-mono` 11px |
| tracking | `.09em` | `0.01em` | `0.09em` |
| transform | `uppercase` | none (mobile forced none) | `uppercase` |
| padding | `11px 24px` | `0.55rem 2.5rem …` | `11px 24px` |
| align | `center` | `center` | `center` |

Theme extras kept: session dismiss, `overflow-wrap`, `white-space: normal`. Not in the HTML bar.

## Restore

Copy `announcement-bar.liquid` and the `.announcement` rules in `announcement.css` back onto:

- `valtora-theme/sections/announcement-bar.liquid`
- `valtora-theme/assets/base.css`
- `valtora-theme/assets/brand.css`
- `valtora-theme/assets/mobile-fit.css`

Do not restore the old “gold announcement on navy” last-wins (`color-mix(… #8A6D3B … #E8D4A2)`).
