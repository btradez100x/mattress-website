# Journal

The storefront Journal link prefers a Blog handle `journal` (`/blogs/journal`) if it exists, then a Page handle `journal` (`/pages/journal`). Create the **Page** first - same path as Order status and Manufacturing.

## 1. Create the Journal page (do this first)

1. Shopify Admin → **Online Store** → **Pages** → **Add page**
2. Title: **Journal**
3. Theme template: **journal**
4. Handle: **journal** (Search engine listing / URL handle) → `/pages/journal`
5. Save

Header and footer then resolve to that page. No blog is required for the URL to stop 404ing.

## 2. Optional: add a Journal blog so the page lists articles

1. Shopify Admin → **Content** (or **Online Store**) → **Blog posts** → **Manage blogs**
2. Create blog **Journal**
3. Handle: **journal** → `/blogs/journal`
4. Add a post and publish
5. The Journal page lists `blogs.journal.articles` automatically. Header/footer then prefer `/blogs/journal`.

Article bodies for paste live in `docs/blog/articles/*.json` + `*.html` (title, excerpt, tags, SEO).

## Theme files

- Page template: `valtora-theme/templates/page.journal.json`
- Section: `valtora-theme/sections/main-journal.liquid`
- Blog index (if they open `/blogs/journal`): `templates/blog.json` + `sections/main-blog.liquid`

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
