# Regency seed-world test pack

Concrete review imagery derived from the current `sim_default` seed: the four
Hale characters, four known/planned locations, the seeded regional layout, and
one identity-locked story scene.

Each asset type uses a dated `review-2026-08-21/` folder. The complete output
matrix, exact prompts, constraints, and audit are in
`../../docs/regency-test-pack-round-2026-08-21.md`.

The user's visual age lock is Matthias 18 / Grace 16. Grace's original portrait
remains active. Matthias's corrected portrait and story scene live in dated
`refinement-2026-08-21/` folders; the superseded older-looking versions are
preserved under `pictures/Experimentelles/world-packs/bridgerton/`.

The circle/background-removal pass is documented in
`../../docs/final-light-dark-map-cutout-round-2026-08-21.md`. Matthias has one
genuine-alpha cutout draft under `characters/cutouts-2026-08-21/`, currently
marked `needs-refinement` because of edge contamination. Anne, Grace, and Thomas
remained opaque checkerboard renders after four strategies; those files are
preserved only under the matching `pictures/Experimentelles/` path and must not
be treated as usable cutouts.

The current selected family set is now gathered under
`final-family-2026-08-21/`. It contains byte-identical copies of all four
accepted portraits and Matthias's accepted scene/cutout draft, three new
identity-locked individual scenes, and `story-scenes/hale-family-together.png`
with exactly all four Hales. Anne/Grace/Thomas real-alpha cutouts are still
missing; the package README and
`../../docs/hale-final-family-round-2026-08-21.md` document the limitation.

This folder may use Regency-specific visual language. Those motifs must not
leak into the universal Quillverse master brand. All files remain review-only
and are not wired into the application.
