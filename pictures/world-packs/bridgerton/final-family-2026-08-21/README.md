# Final Hale family review package — 2026-08-21

This folder groups the currently selected Hale-family visual references for
easy review. `final-family` means selected package, not permission to integrate
anything into the application.

## Complete now

- `portraits/`: Matthias 18, Anne 47, Grace 16, and Thomas 51. These are
  byte-identical copies of the user-accepted portraits.
- `story-scenes/`: one individual scene per family member plus
  `hale-family-together.png`, containing exactly all four family members. The
  user has visually confirmed that all five scenes look good.
- `cutouts/anne-hale.png`, `cutouts/grace-hale-age-16.png`, and
  `cutouts/thomas-hale.png`: genuine 32-bit ARGB cutouts created with the
  user-authorized deterministic alpha pass and checked on light and dark
  backgrounds.
- `cutouts/matthias-hale-age-18.png`: the user visually accepted this draft;
  its known edge contamination and imperfect lower-right alpha remain.

## Preserved technical history

Built-in image generation initially produced opaque RGB files with a painted
transparency pattern for Anne, Grace, and Thomas. Those attempts, plus Grace's
first deterministic pass with one enclosed checker region, are preserved under
the matching
`pictures/Experimentelles/world-packs/bridgerton/final-family-2026-08-21/`
folder and must not be used as final cutouts.

Exact prompts, measurements, visual audit, and the documented fallback option:
`../../../docs/hale-final-family-round-2026-08-21.md`.
