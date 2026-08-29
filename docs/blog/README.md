# Journal

Journal is storefront content. The six notes are baked into the theme so they cannot disappear when Shopify Admin has no blog posts.

The header prefers a **Blog** handle `journal` **when it has published articles**, then a **Page** handle `journal` (`/pages/journal`). Create the Page if the URL 404s.

Checkout is not part of Journal. Do not change checkout.

## 1. Create the Journal page

1. Shopify Admin → **Online Store** → **Pages** → **Add page**
2. Title: **Journal**
3. Theme template: **journal**
4. Handle: **journal** → `/pages/journal`
5. Save

The page lists the six notes immediately. Nav then resolves to that page unless a Journal blog already has posts.

## 2. Optional: publish as a Shopify blog

If a Journal blog already has articles, the header uses `/blogs/journal` so that live content stays visible. An empty Journal *page* must not hide those posts.

1. **Content** → **Blog posts** → **Manage blogs**
2. Blog **Journal**, handle `journal`
3. Add or paste posts from `docs/blog/articles/*.json` + `*.html`
4. Published posts replace the matching baked card. Other baked notes stay.

## 3. Optional: standalone article URLs

Theme templates already exist for each note (`page.how-to-choose-a-mattress`, and so on). Create a Page with the same handle and pick that template for `/pages/<handle>`. If the Page does not exist, the index opens the article in place (`/pages/journal#<handle>`).

Default pages with those handles also render the baked article via `main-page`.

## Theme files

- Index: `templates/page.journal.json` + `sections/main-journal.liquid`
- Baked notes: `snippets/journal-article-body.liquid`, `snippets/journal-baked-index.liquid`
- Article pages: `sections/main-journal-article.liquid` + `templates/page.<handle>.json`
- Blog index: `templates/blog.json` + `sections/main-blog.liquid`
- Re-bake after editing `docs/blog/articles`: `python3 scripts/bake-journal-articles.py`

## SEO clusters covered

| Article | Primary intent |
|---|---|
| How to choose a mattress | Buying guide / choose mattress |
| Firmness guide | Soft vs medium vs firm |
| Cooler sleep & materials | Cooling mattress / sleeping hot |
| Support & back comfort | Back comfort (non-medical) |
| When to replace | Mattress lifespan / replacement |
| Hybrid vs foam vs innerspring | Mattress types |

## Compliance

- No medical claims (no treat/cure/prevent).
- No unverified cooling °C or % figures.
- Educational tone; soft CTA to reserve.
