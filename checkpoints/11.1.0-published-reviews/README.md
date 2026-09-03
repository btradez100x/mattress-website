# 11.1.0 — published-reviews

**Date:** Thursday 3 Sep 2026  
**Export version:** `VERSION` and Shopify `theme_version` stay **11.1.0** (`cta-spec`). No VERSION bump.

## Files for review

| File | What it is |
|---|---|
| `preview-and-theme.tar.gz` | `preview/` + `valtora-theme/` at this deploy |

Restore:
```bash
tar -xzf checkpoints/11.1.0-published-reviews/preview-and-theme.tar.gz
```

## Deploy SHAs

| Tree | SHA | What it is |
|---|---|---|
| Feature / `cursor/lates-changes-29th-2577` | `5883978` | 500 published reviews on Social proof |
| Connect source `v9` | `5883978` | Same as the feature branch |
| Connect / `shopify-theme` | `1454160` | Subtree of `valtora-theme/` at `5883978` |

Shopify Connect should pull `v9` → `valtora-theme/` and/or `shopify-theme` onto the live theme. Connect can lag a minute or two. GitHub Action `Deploy Shopify theme` runs on the `v9` push and **skips** CLI `theme push` unless Action secrets are set.

Store: Numa Mattress (`7dbr1b-1q`). Storefront is password-protected: https://7dbr1b-1q.myshopify.com/

## Why they were blank

`valtora-theme/assets/reviews.json` was `{ "reviews": [] }` on purpose (launch spec). Theme settings → Reviews and Customize → Social proof only unhide the fetch. An empty asset still paints “Reviews will appear here shortly”. The 500 written entries lived unused in `share/v3/assets/reviews.json`.

## What shipped

- Copied the 500 v3 entries into `valtora-theme/assets/reviews.json` and `preview/assets/reviews.json`.
- Schema matches the Social proof loader (`rating`, `title`, `body`, `author`, `location`, `size`, `date`, `verified`) plus `published` / `visible` true and `source: "seed"`.
- Theme settings `reviews_enabled` true. Homepage and landing Social proof: `enable_section` true, `enable_reviews` true, `page_size` 12 with existing **Show more reviews**.
- Social proof sits on a dark band so neighbouring grounds do not collide.
- Toggle off hides only the seed pack; customer-sourced entries would still show.

## Left out

- Checkout files were not edited.
- CTA 11.1.0, MarketShown tokenizer, and Journal-off-home were not touched.
- No VERSION bump.

Checkout was not modified. Legal name **Valtora FZE**.
