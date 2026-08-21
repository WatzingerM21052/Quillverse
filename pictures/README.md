# Quillverse Picture Library

Complete project-local visual library for Quillverse. All paths below are
relative to this `pictures/` directory.

## Where to look first

| Need | Folder |
|---|---|
| Final logo, wordmark, or favicon sizes | `brand/final/` |
| Reviewed banner and logo alternatives | `brand/concepts/` |
| README covers, posters, and showcase art | `brand/presentation/` |
| Reusable maps, characters, places, ornaments, textures, and placeholders | `universal/` |
| Hale family and Regency test-world images | `world-packs/bridgerton/` |
| Rejected, superseded, reference-only, or technically invalid generations | `archive/` |
| Prompts, review history, style rules, and the complete asset catalog | `docs/` |

## Stable top-level structure

```text
pictures/
├── brand/
│   ├── final/          # production-ready image derivatives, not app-integrated
│   ├── concepts/       # positively reviewed alternatives and favorites
│   └── presentation/   # covers, posters, and README/GitHub hero art
├── universal/          # world-neutral reusable visual templates
├── world-packs/
│   └── bridgerton/     # concrete Hale/Regency reference world
├── archive/
│   ├── alternatives/
│   ├── references/
│   ├── superseded/
│   └── technical-failures/
└── docs/
```

The former `review-required/` and `Experimentelles/` trees no longer exist.
Review is complete, so their contents are now filed by function and actual
status rather than by an outdated workflow stage.

## Current decisions

- **Primary visual direction:** Living Manuscript.
- **Alternative ornament direction:** historical-neutral parchment and ink.
- **Preferred universal map:** `universal/maps/atlas-terrain.png`.
- **Preferred lush manuscript map:**
  `universal/maps/manuscript-variants/manuscript-terrain-lush-sage.png`.
- **Visual ages:** Matthias 18, Grace 16.
- **Hale package:** four portraits, four genuine-alpha cutouts, expression
  sets, individual scenes, and the complete family scene are finished.
- **Image review:** complete; no image currently awaits user feedback.
- **Application integration:** intentionally not performed. Approval of an
  image for this library is not permission to replace an application asset.

## Documentation

Start with `docs/asset-catalog.md` for individual files and
`docs/visual-style-bible.md` for design rules. The dated round documents retain
generation prompts, decisions, and validation evidence. `docs/README.md`
provides the compact documentation index.

Current inventory: **217 PNG files** — 42 under `brand/`, 31 under
`universal/`, 73 under `world-packs/`, and 71 under `archive/`.
