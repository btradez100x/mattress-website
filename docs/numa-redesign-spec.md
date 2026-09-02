# Numa — Redesign, Media and Tracking Spec

Nine pages rebuilt. One is a full copy rewrite, the rest are design and media only.

**Assets are supplied in `/assets/`.** 24 images, 2 videos, 6.3MB total.

---

## 1. What changed on each page

| Page | Route | Change |
|---|---|---|
| `c-specification.html` | `/pages/specification` | **Full rewrite.** New copy, new structure |
| `g-manufacturing.html` | `/pages/manufacturing` | Full replacement. Factory video, materials, process |
| `f-about.html` | `/pages/about` | Design and media only. Copy unchanged |
| `h-support.html` | `/pages/support` | **New page.** Health and back pain positioning |
| `a-large-sizes.html` | `/pages/large-sizes` | Media added, spec figures corrected |
| `b-european-king.html` | `/pages/european-king` | Media added |
| `i-cooling.html` | `/pages/cooling` | Media added, cooling mechanism expanded |
| `j-split-king.html` | `/pages/split-king` | Media added |
| `d-what-it-buys.html` | `/what-it-buys` | Media added, spec figures corrected |

---

## 2. The specification rewrite

The old page listed features. This one sells eight layers, in the order you meet them, each with what it is and what it does for you.

**Structure:** hero with product, a five-figure summary strip, then eight numbered layers, then the argument, then Adjust to Desire.

**Every layer follows the same shape.** What it is in our terms, then what it does for the sleeper. Never a spec on its own.

> **Wave-profile foam** — 2.5cm, 20 density
> Cut into a wave rather than left flat. The profile creates channels through the middle of the comfort stack.
> **Air moves sideways through those channels instead of being trapped between two solid layers. It is a structural answer to heat, not a coating.**

The bold second paragraph is the benefit. It carries `.layer-benefit` and renders in Carbon at weight 500 while the technical paragraph sits in Graphite. That contrast is the whole design of the section.

### Specification figures corrected across every page

The old pages said 30cm core and 5cm comfort layer. The real build is:

| | |
|---|---|
| Cover | 400g cool-knit, zip access all the way round |
| Gel memory foam | 1cm, 28 density |
| Comfort foam | 1.5cm, 20 density |
| Wave-profile foam | 2.5cm, 20 density |
| Flippable comfort layer | 10cm — 2cm at 2540 over 8cm at 2580 |
| Pocket spring core | 20cm, 7 zones, 1.8 and 2.0mm wire |
| Encased perimeter | 7cm, 35 density |
| Underside | Anti-slip |
| **Finished depth** | **35cm** |

**20cm core, 15cm of comfort above it.** Every page now states it that way.

---

## 3. Media

### Manifest

| File | Use | Size |
|---|---|---|
| `cutout.webp` | Product cutout, transparent-ready | 119 KB |
| `product-floating.webp` | Spec hero, support page | 36 KB |
| `product-floating-2.webp` | What it buys | 18 KB |
| `product-profile.webp` | Support hero | 38 KB |
| `product-plain.webp` | What it buys hero | 21 KB |
| `coolknit-macro.webp` | Cooling hero, spec layer 01 | 133 KB |
| `coolknit-handle.webp` | Spec layer 07, perimeter | 167 KB |
| `coolknit-corner.webp` | About, full bleed | 151 KB |
| `coolknit-side.webp` | Spec layer 06, support core | 184 KB |
| `quilt-macro.webp` | Spec layer 02 | 121 KB |
| `quilt-macro-2.webp` | Spec, what it adds up to | 64 KB |
| `quilt-edge.webp` | Spec layer 04, cooling | 80 KB |
| `room-*.webp` × 9 | Landing page heroes and full bleeds | 43–166 KB |
| `stack-sizes.webp` | Split king hero | 53 KB |
| `spring.mp4` + poster | Manufacturing hero | 2.0 MB |
| `compression.mp4` + poster | Manufacturing, compression section | 2.1 MB |

### Optimisation already applied

- All stills converted to **WebP at quality 80**, resized to 1400–1800px on the long edge
- Original PNGs were 20–47MB each. Now 18–184KB
- Videos re-encoded to **H.264, 800–1280px, CRF 28–30, audio stripped, `+faststart`**
- Video posters extracted as WebP so nothing loads until play

### Loading rules — implement these, they are not optional

**Hero images carry `loading="eager"`.** Everything else is `loading="lazy"`. Both are already set in the markup; do not strip them when converting to Liquid.

**Videos are `preload="none"` with a poster.** They autoplay muted and loop, but nothing downloads until the element is in view. On a page with two videos that is the difference between a 4MB and a 100KB initial load.

**Add `width` and `height` attributes** when converting to Liquid, using the real pixel dimensions. Without them every image causes layout shift, and Core Web Vitals is a ranking factor.

**Serve responsive sizes.** Shopify's `image_url` filter with `width:` gives you 800/1200/1600 variants. Use `srcset`. The supplied files are the largest variant.

---

## 4. Design system additions

New components. All use existing tokens; nothing new was introduced to the palette.

| Class | Purpose |
|---|---|
| `.hero-split` | Two-column hero, copy left and image right. Collapses at 900px |
| `.figure` / `.full-bleed` | Image with optional mono caption. Full-bleed caps at 76vh |
| `.layer` | The specification row: number, body, image. Collapses to two columns at 900px |
| `.stack` | The five-figure summary strip |
| `.grid-3` | Three-column hairline grid, used for feature triples |
| `.split` / `.split.rev` | Image and text side by side, reversible |
| `.matgrid` | Materials grid on the manufacturing page |
| `.step` | Numbered process rows |
| `.reveal` | Fade and rise on scroll, via IntersectionObserver |

**`.reveal` respects `prefers-reduced-motion`.** The transition is inside a media query. Do not move it out.

**The Line remains one per page** and is still the meeting of two tones — the Snow to Carbon transition at the outcome section. It is never a coloured stroke.

**Ember appears only** in layer numbers, kicker accents on dark grounds, and links. Never a fill, never a button, never above 2% of a view.

---

## 5. Tracking additions

The existing eight events still apply. These are new and specific to the redesign.

| Event | Fires when | Parameters |
|---|---|---|
| `video_start` | A factory video begins playing | `video_id` (`spring` or `compression`), `page_path` |
| `video_complete` | Video reaches its end | `video_id`, `page_path` |
| `spec_layer_view` | A `.layer` row enters the viewport | `layer_number`, `layer_name` |
| `spec_scroll_complete` | Layer 08 enters the viewport | `page_path` |
| `media_gallery_view` | Any `.full-bleed` figure enters the viewport | `image_id` |

### Why these matter

**`spec_layer_view` is the one to build properly.** The specification page is the product argument. Knowing that visitors stop at layer 03 tells you the page is too long or the early layers are not earning attention, and that is not visible in scroll depth alone because the layers are unevenly sized.

**`spec_scroll_complete` is a strong qualification signal.** Anyone who reaches layer 08 has read a specification for a £3,299 mattress. Build an audience from it for remarketing, and check its add-to-basket rate against the page average.

**`video_start` measures whether the factory footage earns its 2MB.** If fewer than 20% of manufacturing page visitors start a video, the videos are decoration and should move below the fold or come out.

### Implementation

Use one IntersectionObserver for all viewport-triggered events, at `rootMargin: '-40px'`, firing once per element per session. The `.reveal` observer already exists in the page — extend it rather than adding a second.

All five events carry `lp_variant` and `session_id` from `sessionStorage`, same as every other event.

### Regression additions

Add to the existing suite:

| # | Check | Pass |
|---|---|---|
| E1 | Scroll the spec page slowly to the bottom | Eight `spec_layer_view` events, in order, no duplicates |
| E2 | Scroll fast to the bottom | Still eight events, none skipped |
| E3 | Play a factory video to the end | `video_start` then `video_complete` |
| E4 | Load the manufacturing page, do not scroll | **No video bytes downloaded.** Check the network tab |
| E5 | Reload the spec page | Layer events fire again, same `session_id` |
| E6 | `prefers-reduced-motion: reduce` | No fade animation. Events still fire |

**E4 is the one that usually fails.** If `preload` is dropped or set to `metadata`, the page downloads 4MB before anyone asks for it.

---

## 6. Checklist

- [ ] `/assets/` uploaded, all 26 files
- [ ] Nine pages built at the routes above
- [ ] `loading="eager"` on hero images only, `lazy` everywhere else
- [ ] `preload="none"` on both videos, posters set
- [ ] `width` and `height` on every image
- [ ] `srcset` via Shopify `image_url` for 800/1200/1600
- [ ] Specification figures updated everywhere: 20cm core, 15cm comfort, 35cm total
- [ ] Five new events firing with `lp_variant`
- [ ] E1 to E6 regression passing
- [ ] Navigation updated: The mattress, How it is made, Support, About, Trade
