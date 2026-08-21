# Quillverse Picture Library

Project-local original visual assets and visual references.

## Approval rule

Everything under `review-required/` is a draft. It must not replace an app icon,
favicon, logo, banner, manifest entry, Angular asset, D1/R2 asset, or production
image until the user explicitly approves it.

## Families

- `review-required/`: active A/B/C brand concepts, the 12-image refinement
  comparison set, and the three I2 derivative candidates, all under review.
- `Experimentelles/`: retained non-final alternatives, useful form references,
  and technical generation failures. These files are preserved deliberately but
  are not active production candidates.
- `universal/`: reusable Quillverse composition and style references.
- `world-packs/bridgerton/`: concrete Regency test assets.
- `docs/`: catalog, style bible, and exact prompts.

Gate 2A now contains three world-neutral maps, one identity-consistent
three-image character set, and three reusable location-composition references.
Gate 2B contains the current seed-derived Hale/Regency test pack: four
characters, four locations, one regional map, and one story scene. Exact prompts
and audits are in `docs/universal-template-round-2026-08-21.md` and
`docs/regency-test-pack-round-2026-08-21.md`.

Gate 2C locks the visual ages to Matthias 18 / Grace 16. Grace remains unchanged;
the active corrected Matthias portrait and dawn scene are versioned under the
Regency pack's `refinement-2026-08-21/` folders. The older-looking originals are
preserved under `Experimentelles/`. Exact prompts and audit:
`docs/age-correction-round-2026-08-21.md`.

The final image-only mini-pass lives in the dated `02-light-dark-pair/`,
`universal/maps/refinement-2026-08-21/`, and Regency
`characters/cutouts-2026-08-21/` folders. Exact prompts, alpha validation, and
the preserved failure log are in
`docs/final-light-dark-map-cutout-round-2026-08-21.md`. The icons and maps are
active review candidates. Matthias's cutout needs edge refinement; failed
Anne/Grace/Thomas alpha attempts live only under `Experimentelles`.

The selected Hale-family review package is grouped under
`world-packs/bridgerton/final-family-2026-08-21/`: four accepted portraits, four
real-alpha character cutouts, all four individual story scenes, and one scene
with the complete family together. Anne, Grace, and Thomas were finished with
the user-authorized deterministic alpha pass after built-in generation returned
painted checkerboards; all failed and intermediate versions remain preserved
under `Experimentelles`. Exact prompts and audit:
`docs/hale-final-family-round-2026-08-21.md`.

The complete follow-up visual expansion lives under
`world-packs/bridgerton/expansion-2026-08-21/`,
`universal/ornaments/expansion-2026-08-21/`, and
`review-required/presentation/expansion-2026-08-21/`. It adds 66 images: 20 Hale
expressions, 12 location variants, 8 interiors, 7 key scenes, 8 transparent
objects, 7 universal UI artworks, and 4 review-gated presentation pieces. The 16
opaque expression sources remain under the matching `Experimentelles` tree.
Exact prompts, dimensions, validation results, and handoff:
`docs/visual-expansion-round-2026-08-21.md`. Nothing from this expansion is wired
into the application.

The user selected `universal/ornaments/expansion-2026-08-21/` as the primary
Quillverse ornament direction. A separate, deliberately quieter fallback lives
under `universal/ornaments/historical-neutral-2026-08-21/`: seven realistic
aged-parchment, ink, wax, engraving, map, and archive assets without fantasy,
botanical romance, branding, or world-specific motifs. It is an alternative,
not a replacement. Exact direction and audit:
`docs/historical-neutral-ornaments-round-2026-08-21.md`.

The first user review is recorded in
`docs/review-feedback-2026-08-21.md`. A1 is the current preferred master-logo
concept, while the top-center treatment on the icon study is the current favicon/
app-icon favorite. This preference is not permission to modify the application.

The resulting three-variants-per-target comparison round lives under
`review-required/refinement-2026-08-21/`. Its exact prompt ledger, output matrix,
technical-failure log, and local visual audit are in
`docs/refinement-round-2026-08-21.md`. Numbered group folders preserve review
order; their status subfolders (`preferred`, `strong-alternatives`,
`alternatives`, `needs-refinement`) make the current ranking visible without
opening the catalog. Rejected studies and generation failures use matching
numbered groups under `Experimentelles/` with `not-preferred` and
`technical-failures` status folders. No refinement candidate is approved for
app integration yet.

The same approval rule applies to every Gate 2 asset. Their dated `review-*`
folders make that status explicit; none has been copied into an application
asset folder.
