# Changelog

All notable changes to the Onni London trade site (`trade/`) are recorded here.

The format is [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

Release-please updates this file and bumps `package.json` when a conventional
commit lands on `main`. Tags look like `onni-london-trade-vX.Y.Z`.

## [Unreleased]

## [1.2.2] - 2026-09-22

Saved live snapshot on `mattress.valtoraholdings.com` before the wording and
URL pack. Same pages and auth as 1.2.1, with the live trade email.

### Changed

- Trade contact is `trade@onnlondon.co.uk` (same local part, domain only)

This is the production freeze of what was live on 22 September 2026. Retrieve
it with git tag `onni-london-trade-v1.2.2`.

## [1.2.1] - 2026-09-18

Saved live snapshot on `mattress.valtoraholdings.com`. Same content as 1.2.0
plus the Carbon-band door CTA fix that went live with that pass.

Superseded as the live freeze by 1.2.2 (email domain).

## [1.2.0] - 2026-09-18

Updates 6 pack. Size chart on The bed, dimensions under price-list size names,
nav in Instrument Sans, and table headings that share alignment with their cells.

### Added

- Size chart on `the-bed.html` (15 UK, US and Australian sizes)
- `span.dim` under each size name on specification, retail and contract lists

### Changed

- Nav links use Instrument Sans (`--display`), same family as the wordmark
- Text column headings are left-aligned with the cells they label
- Numeric column headings stay right-aligned with their figures
- The bed “3 ways to buy it” CTAs are three matching outlined buttons
- Filled buttons on Carbon bands stay visible (Snow fill, not ember text)

## [1.1.0] - 2026-09-18

Updates 5 pack. Adds The bed and Training, refreshes partner copy and glance
panels, and keeps Ben's live rules on top of the zip.

### Added

- Open page `the-bed.html` (construction, adjustment, videos)
- Internal page `training.html` (objection handling)
- `nav-auth.js` so Strategy and Training appear only for internal and master

### Changed

- Partner pages include The bed in a single shared nav treatment
- Door, table, contrast, numeral, and How it works rules from 1.0.0 still apply

## [1.0.0] - 2026-09-18

Live snapshot of the seven-page Onni London trade site on
`mattress.valtoraholdings.com` before updates 5.

### Added

- Seven-page trade site from the 8bff / b47f source pack
- `node build.mjs --check` plus a Node regression suite
- GitHub Actions CI and release-please versioning
- Inlined `site.css` and self-hosted latin Instrument Sans, Inter, and Geist Mono

### Changed

- Body copy uses numerals rather than spelled-out numbers
- Nav label is How it works
- Door prices share one baseline; dark-section cards keep readable type
- Table headings stay on one line; text columns left, numbers right
