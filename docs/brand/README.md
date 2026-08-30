# Brand guidelines — source of truth

**Always use the brand guidelines zip.** Do not invent tokens, do not fall back to the retired navy/gold *type* system, and do not use the older e144 pack unless this zip is byte-identical.

## Path others must use

| What | Path |
|---|---|
| **Canonical zip (this pack)** | `docs/brand/Brand_guidelines_a1e2.zip` |
| Upload that produced it | `/home/ubuntu/.cursor/projects/workspace/uploads/Brand_guidelines_a1e2.zip` |
| Extracted files | `docs/brand-guidelines-a1e2/Brand guidelines/` |
| Complete written spec (supersedes the other files in the zip) | `docs/brand-guidelines-a1e2/Brand guidelines/BRAND-GUIDELINES.md` |
| Token cheat-sheet for agents | `docs/brand/TOKENS.md` |
| Live CSS overlay | `valtora-theme/assets/brand.css` (loaded last) |

SHA-256 of this zip: `14380bb765d1e76a50a866e77627a36517d5c5a2580b8f55c348d3ee8b627b79`

`Brand_guidelines_e144.zip` is **not** identical (different zip hash). Markdown/DOCX payloads match; still treat **a1e2** as the pack to open. Do not use e144 when a1e2 is present.

## Which document wins inside the zip

`BRAND-GUIDELINES.md` says it supersedes `brand-guidelines.html`, `13-BRAND-VOICE.md`, and `14-COMPONENT-SPEC.md`.

The visual-assets DOCX still describes an older navy (`#1F3A5F`) / gold wordmark system. The complete spec **rejects that**: Version 2 navy + gold type was a mismatch with the product (white quilt + charcoal base). Live tokens are **Carbon / Snow / Ember**.

User readability rule (always): **on-dark type is cream/snow. Gold is 1px ornament only.** Even if a figure in the visual DOCX shows a gold wordmark on navy, do not paint gold fill text on a dark ground.

Legal entity: **Valtora FZE**. Brand name remains a theme setting (never hard-code it).
