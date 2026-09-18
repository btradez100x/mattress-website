# Changelog

All notable changes to the Onni London trade site (`trade/`) are recorded here.

The format is [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

Release-please updates this file and bumps `package.json` when a conventional
commit lands on `main`. Tags look like `onni-london-trade-vX.Y.Z`.

## [Unreleased]

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
