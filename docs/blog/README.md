# Journal / Blog (SEO)

Shopify blog handle recommended: `journal` → `/blogs/journal`

## Publish in Admin

1. **Online Store → Blog posts → Manage blogs** → create blog **Journal** (handle `journal`).
2. For each file in `docs/blog/articles/*.json` + `*.html`:
   - Create article with **Title** from JSON
   - Paste HTML body from the `.html` file into the article editor (HTML view)
   - Set **Search engine listing** title + description from `seo_title` / `meta`
   - Add tags from JSON
   - Set excerpt from JSON
   - Author: brand or founder name
3. Theme templates `blog.json` / `article.json` are already in the theme.
4. Add **Journal** to the header menu pointing to `/blogs/journal` (fallback nav already includes it).

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
