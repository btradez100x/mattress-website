# S15 Trust layer - store setup notes

Additive to Developer Spec v3. Theme pieces are in `valtora-theme/`. Create these **pages** in Shopify Admin and assign the matching templates, then link them from the Footer section and Trust bar items.

| Page title | Suggested handle | Template | Footer setting |
|---|---|---|---|
| 100-night trial | `100-night-trial` | `page.trial` | Trial page |
| Warranty | `warranty` | `page.warranty` | Warranty page |
| Refunds & deposit | `refunds-deposit` | `page.refunds` | Refunds & deposit page |
| Delivery & lead time | `delivery-lead-time` | `page.delivery` | Delivery & lead time page |
| Contact | `contact` | `page.contact` | Contact page |
| Size guide | `size-guide` | `page.size-guide` | Size guide page |
| Order status | `order-status` | `page.order-status` | Order status page |

Order lookup is **off** until the App Proxy worker is live. See `docs/ORDER_TRACKING.md` (App Proxy + email, not Shopify’s native status page).

Fallback copy is already in each template section if the page body is empty - replace with your final legal wording.

Local preview mirrors these at `preview/pages/*.html` (http://127.0.0.1:5173/pages/trial.html etc.).

## Theme settings to fill

- **WhatsApp:** enable + digits-only international number (S15.3)
- **Legal entity:** UAE trade licence / TRN; UK company + VAT when live
- **Contact hours** + response-time note
- Trust bar item **links** → the four policy pages (unlinked claims are weaker than no claim)

## Outside the theme

1. Install Judge.me / Okendo / Trustpilot → add app block in Social proof  
2. Deposit confirmation email: include lead-time line  
   `Made to order. Current window: [X-Y] weeks. We confirm your dispatch date before the balance is due.`  
3. BNPL apps (Tabby/Tamara AE; Klarna/Clearpay GB) - logos already shown in theme  

## Do not add

Countdown timers, viewer counts, artificial stock counters, seeded reviews, unearned badges, unverified cooling %.
