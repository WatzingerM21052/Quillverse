# Final Light/Dark, Lush Map, and Hale Cutout Round — 2026-08-21

Status: generation and local audit complete. Image-only review round; no
application integration is authorized.

## Scope and invariants

- Preserve every existing source asset. All outputs use new dated folders.
- Build one coherent three-file I2 family: transparent master, light tile, dark
  tile. The recognizable Q/book/doorway/quill geometry must remain stable.
- Preserve Map 3's dynamic geography and ink energy while testing three greener,
  more inhabited temperate palettes.
- For the four current Hale portraits, remove only the circular presentation and
  every painted background pixel. Do not redesign, beautify, age-shift, extend,
  recrop, or otherwise retouch the people.
- Transparent outputs must contain genuine PNG alpha, never a painted checkerboard.
- Everything remains review-only under `pictures/`; no file under `apps/` changes.

## Output matrix

| Prompt ID | Source role | Planned output |
|---|---|---|
| I2-FINAL-PAIR-01 | I2 master mark + app tile: geometry/style references | `review-required/finalization-2026-08-21/02-light-dark-pair/quillverse-mark-transparent.png` |
| I2-FINAL-PAIR-02 | I2 master mark + app tile: geometry/style references | `review-required/finalization-2026-08-21/02-light-dark-pair/quillverse-app-tile-light.png` |
| I2-FINAL-PAIR-03 | I2 master mark + app tile: geometry/style references | `review-required/finalization-2026-08-21/02-light-dark-pair/quillverse-app-tile-dark.png` |
| UNI-MAP-03-R1-A | manuscript map: edit target | `universal/maps/refinement-2026-08-21/manuscript-terrain-lush-sage.png` |
| UNI-MAP-03-R1-B | manuscript map: edit target | `universal/maps/refinement-2026-08-21/manuscript-terrain-temperate-green.png` |
| UNI-MAP-03-R1-C | manuscript map: edit target | `universal/maps/refinement-2026-08-21/manuscript-terrain-rainwashed.png` |
| REG-CHAR-CUTOUT-01 | Matthias age-18 portrait: edit target | `world-packs/bridgerton/characters/cutouts-2026-08-21/matthias-hale-age-18-cutout.png` |
| REG-CHAR-CUTOUT-02 | Anne portrait: edit target | `world-packs/bridgerton/characters/cutouts-2026-08-21/anne-hale-cutout.png` |
| REG-CHAR-CUTOUT-03 | Grace age-16 portrait: edit target | `world-packs/bridgerton/characters/cutouts-2026-08-21/grace-hale-age-16-cutout.png` |
| REG-CHAR-CUTOUT-04 | Thomas portrait: edit target | `world-packs/bridgerton/characters/cutouts-2026-08-21/thomas-hale-cutout.png` |

## Frozen prompts

### I2-FINAL-PAIR-01 — transparent master

```text
Use case: logo-brand
Asset type: clean transparent master mark for Quillverse
Input images: Image 1 is the current transparent I2 master geometry reference; Image 2 is the current dark app-tile style and proportion reference
Primary request: redraw the same recognizable Quillverse symbol as one production-clean transparent master: an open book forming a broad Q-like circular portal, a calm central doorway/page opening, and a fountain-pen nib completing the lower-right tail
Style/medium: extremely clean flat vector-like raster artwork with crisp antialiased edges and three solid colors only
Composition/framing: centered square symbol, balanced symmetry, identical visual weight to the references, generous even transparent padding
Color palette: deep ink blue symbol, warm ivory central doorway/page, restrained muted-gold nib
Constraints: preserve the reference symbol's identity, geometry, proportions, negative spaces, and lower-right nib placement; genuine RGBA transparency outside the symbol and in intended openings; no fringe pixels; no texture; no gradients; no glow; no shadow; no bevel; no text; no watermark
Avoid: checkerboard, paper background, black canvas, cyan edge speckles, ornate detail, new symbols, altered Q silhouette
```

### I2-FINAL-PAIR-02 — light tile

```text
Use case: logo-brand
Asset type: Quillverse light-mode app-icon tile
Input images: Image 1 is the current transparent I2 master geometry reference; Image 2 is the current dark app-tile style and proportion reference
Primary request: create the light-surface counterpart of the same Quillverse icon family: preserve the exact recognizable open-book Q portal, central doorway, and lower-right fountain-pen nib composition, presented on one warm-ivory rounded-square tile
Style/medium: premium flat vector-like app icon, clean and restrained
Composition/framing: centered symbol with the same scale and padding as the dark reference tile; softly rounded square corners
Color palette: warm ivory tile, deep ink-blue book/Q/doorway geometry, muted-gold nib accent
Constraints: geometry and proportions must match the reference family; crisp antialiased edges; flat solid colors; no text; no watermark; no extra ornament
Avoid: gradients, paper grain, shadows, bevels, glow, cyan fringe, mockup, additional symbols
```

### I2-FINAL-PAIR-03 — dark tile

```text
Use case: logo-brand
Asset type: Quillverse dark-mode app-icon tile
Input images: Image 1 is the current transparent I2 master geometry reference; Image 2 is the current dark app-tile style and proportion reference
Primary request: clean and normalize the dark Quillverse app tile while preserving the exact recognizable open-book Q portal, central doorway, and lower-right fountain-pen nib composition
Style/medium: premium flat vector-like app icon, clean and restrained
Composition/framing: centered symbol with generous even padding on one softly rounded square tile
Color palette: deep ink-blue tile, warm-ivory book/Q/doorway geometry, muted-gold nib accent
Constraints: keep the geometry and proportions consistent with the light counterpart and reference family; crisp antialiased edges; flat solid colors; no text; no watermark; no extra ornament
Avoid: gradients, paper grain, shadows, bevels, glow, cyan fringe, mockup, additional symbols
```

### UNI-MAP-03-R1-A — lush sage manuscript

```text
Use case: lighting-weather
Asset type: universal top-down map background, lush sage manuscript variant
Input images: Image 1 is the manuscript-ink terrain edit target
Primary request: change only the terrain palette and vegetation richness so the same dynamic map feels like a fertile temperate spring landscape instead of a dry desert
Style/medium: preserve the exact hand-inked antique manuscript-map linework and parchment texture
Color palette: warm light parchment, muted sage and moss fields, varied leafy woodland greens, deep dusty-blue water, tiny restrained ochre farmland accents
Constraints: preserve coastline, river and delta paths, islands, mountain ridges, roads, field boundaries, forest locations, top-down camera, composition, and all negative space; no labels; no text; no pins; no borders; no compass; no UI; no settlements added; no watermark
Avoid: desert sand dominance, tropical saturation, neon greens, photorealism, horizon view, altered geography
```

### UNI-MAP-03-R1-B — temperate green manuscript

```text
Use case: lighting-weather
Asset type: universal top-down map background, rich temperate variant
Input images: Image 1 is the manuscript-ink terrain edit target
Primary request: change only the terrain palette and vegetation richness; keep the map's dynamic geography but make it read as a healthy inhabited temperate countryside with stronger land contrast
Style/medium: preserve the exact antique pen-and-ink manuscript character and fine cartographic hatching
Color palette: ivory parchment, forest green and olive woodland masses, soft meadow green plains, muted ochre cultivated fields, slate-blue rivers and sea
Constraints: preserve every major geographic feature, road, field, forest placement, coastline, river delta, mountain ridge, top-down composition, and pin-safe open areas; no labels; no text; no pins; no compass; no decorative frame; no UI; no watermark
Avoid: bleak sepia, arid terrain, emerald oversaturation, fantasy landmarks, changed geography, 3D perspective
```

### UNI-MAP-03-R1-C — rain-washed manuscript

```text
Use case: lighting-weather
Asset type: universal top-down map background, rain-washed verdant variant
Input images: Image 1 is the manuscript-ink terrain edit target
Primary request: change only color, moisture, and vegetation density so the same map feels cool, green, rain-fed, and alive while retaining its energetic hand-drawn geography
Style/medium: antique manuscript map with preserved ink contours, hatching, and tactile paper
Color palette: pale parchment, cool sage, blue-green forests, subdued moss fields, steel and dusty-blue water, restrained warm farm patches for balance
Lighting/mood: fresh after light rain, atmospheric but readable, not dark or gloomy
Constraints: preserve coastline, waterways, delta, islands, mountains, paths, plots, forests, camera, scale, and composition exactly; no rain streaks; no clouds; no labels; no text; no pins; no compass; no UI; no watermark
Avoid: desert palette, tropical jungle, muddy low contrast, altered geography, horizon, dramatic weather effects
```

### REG-CHAR-CUTOUT template — applies individually to prompts 01–04

```text
Use case: background-extraction
Asset type: transparent Quillverse character portrait cutout
Input images: Image 1 is the sole edit target and identity source
Primary request: remove only the entire circular/oval portrait presentation and every background pixel behind and around the person, leaving the person alone on a genuinely transparent canvas
Constraints: preserve the person's exact face, age, expression, gaze, hair, fine hair strands, skin texture, clothing, pose, shoulders, lighting, painterly brushwork, crop, scale, and canvas position; do not regenerate, retouch, beautify, age-shift, extend, or recrop the person; preserve the original visible person pixels as faithfully as possible; all non-person pixels must have alpha 0; clean natural edges with no halo; no text; no watermark
Avoid: circular border, oval mask, painted backdrop, taupe outer canvas, checkerboard, solid-color background, drop shadow, glow, outline, newly invented body parts, altered clothing or facial features
```

Identity locks applied to the shared template:

- `REG-CHAR-CUTOUT-01`: Matthias Hale, visually exactly 18.
- `REG-CHAR-CUTOUT-02`: Anne Hale, unchanged adult identity.
- `REG-CHAR-CUTOUT-03`: Grace Hale, visually exactly 16.
- `REG-CHAR-CUTOUT-04`: Thomas Hale, unchanged adult identity.

### REG-CHAR-CUTOUT-R2 — alpha correction for Anne, Grace, and Thomas

The R1 Matthias output returned genuine alpha. The R1 Anne, Grace, and Thomas
outputs instead painted a white/light-gray checkerboard into opaque RGB pixels.
Those three are preserved under the matching
`Experimentelles/world-packs/bridgerton/characters/cutouts-2026-08-21/technical-failures/`
folder and are used only as isolated-figure edit targets for this correction.

```text
Use case: background-extraction
Asset type: corrected transparent Quillverse character cutout
Input images: Image 1 is the isolated-person edit target whose checkerboard background is technically opaque
Primary request: remove only every white and light-gray checkerboard square behind and around the person; leave the isolated person unchanged
Technical requirement: return a genuine RGBA PNG; every non-person pixel must have alpha 0, including all four corners; no checkerboard pixels may remain
Constraints: preserve the person's face, age, expression, gaze, hair, fine strands, skin, clothing, pose, shoulders, crop, scale, position, colors, lighting, and painterly texture exactly; do not redraw, retouch, beautify, age-shift, extend, or recrop the person; clean natural alpha edge with no halo; no text; no watermark
Avoid: solid background, checkerboard, painted canvas, circle, outline, shadow, glow, new body parts, changed facial or clothing details
```

R2 again returned opaque RGB checkerboards for all three targets. These outputs
are preserved with `-r2-opaque-checkerboard` filenames. The final R3 strategy
returns to each original circular portrait as the sole identity reference and
requests a fresh cutout on a transparent void rather than editing a checkerboard.

### REG-CHAR-CUTOUT-R3 — fresh transparent reconstruction

```text
Create one new transparent-background character cutout, not a transparency preview. Do not draw or simulate a checkerboard.

Use case: identity-preserve
Asset type: Quillverse character portrait cutout
Input images: Image 1 is the sole identity, clothing, pose, crop, lighting, and painterly-style reference
Primary request: reproduce the same visible person faithfully as an isolated bust on a transparent void; omit the original circular/oval frame, the painted blue-brown background inside it, and the taupe canvas outside it
Technical requirement: return a genuine RGBA PNG; every pixel outside the person must have alpha 0, including all four corners; there must be no visible canvas, white field, gray field, or checkerboard
Constraints: preserve the exact recognizable face, age, expression, gaze, hairstyle, loose strands, skin character, clothing design and colors, pose, shoulder angle, scale, placement, lighting direction, and painterly finish from Image 1; no beauty retouching; no age shift; no added accessories; no text; no watermark
Avoid: circular crop, oval border, backdrop, checkerboard, solid background, drop shadow, glow, outline, full-body extension, changed face or outfit
```

R3 again returned opaque RGB images with a painted checkerboard for Anne,
Grace, and Thomas. The three results are preserved with
`-r3-opaque-checkerboard` filenames. Because Matthias succeeded when generated
alone, the final controlled attempt runs each remaining portrait sequentially
from its original source and states the alpha contract in literal pixel terms.

### REG-CHAR-CUTOUT-R4 — sequential alpha-isolation attempt

```text
Create one isolated [CHARACTER] character bust on a transparent void. Return a real RGBA PNG, not an image depicting transparency. Do not draw a checkerboard, white field, gray field, black field, or any canvas.

Use case: background-extraction
Input images: Image 1 is the original circular portrait and identity target
Primary request: remove the entire taupe outer canvas, circular/oval boundary, and blue-brown painted backdrop. Keep only the already-visible person.
Technical output: every non-person pixel alpha 0; all four corners alpha 0.
Identity lock: preserve exact face, age, expression, eyes, hair, skin, clothes, pose, shoulder angle, crop, scale, light, colors, and painterly medium. Do not beautify, age-shift, invent, extend, or redesign.
No circle, no background, no checkerboard, no shadow, no glow, no outline, no text, no watermark.
```

Character-specific locks:

- Anne Hale: unchanged adult identity.
- Grace Hale: visually exactly 16.
- Thomas Hale: unchanged adult identity.

R4 was run sequentially, one portrait at a time. Anne, Grace, and Thomas still
returned `Format24bppRgb` files with corner alpha `255,255,255,255`; the visible
checkerboard is painted into the image. Those results are preserved with
`-r4-opaque-checkerboard` filenames. Further stochastic retries were stopped to
avoid creating more technically identical failures.

## Final result and local audit

| Output | Dimensions | Pixel format / alpha | Status | Audit |
|---|---:|---|---|---|
| `quillverse-mark-transparent.png` | 1254x1254 | ARGB; corners `0,0,0,0` | needs-review | Recognizable I2 open-book/Q/doorway/nib geometry; genuine transparent master; minor colored edge fringe remains visible at close zoom |
| `quillverse-app-tile-light.png` | 1254x1254 | RGB; full-bleed ivory | needs-review | Coherent light counterpart; clean square edge-to-edge tile for later platform masking |
| `quillverse-app-tile-dark.png` | 1254x1254 | RGB; full-bleed ink blue | needs-review | Coherent dark counterpart; previous smear and black-corner defects removed |
| `manuscript-terrain-lush-sage.png` | 1536x1024 | RGB | needs-review | Best-balanced greener Map-3 continuation; dynamic manuscript geography retained |
| `manuscript-terrain-temperate-green.png` | 1536x1024 | RGB | needs-review | Strongest fertile-green reading; roads and cultivated land remain legible |
| `manuscript-terrain-rainwashed.png` | 1536x1024 | RGB | needs-review | Coolest, moodiest treatment; still readable and not desert-like |
| `matthias-hale-age-18-cutout.png` | 1230x1278 | ARGB; corners `0,0,3,223` | needs-refinement | Real transparency and correct age-18 identity, but edge color contamination and a nontransparent lower-right corner prevent production use |
| Anne / Grace / Thomas cutouts | 1254x1254 each | RGB; corners `255,255,255,255` | technical-failure | R1-R4 all painted the checkerboard; no false cutout is promoted to the review folder |

All three icon candidates and all three maps were opened from their final local
paths. The maps contain no labels, pins, compass, borders, UI, or text. The icon
pair is internally coherent and the master contains real alpha. Matthias was
also opened from the final path; the visible fringe and lower-right alpha defect
are explicitly retained as review evidence rather than hidden or integrated.

## Preserved failures

- Five icon-family failures are stored under
  `Experimentelles/finalization-2026-08-21/02-light-dark-pair/technical-failures/`:
  opaque checkerboard, geometry drift, render smear, and two black-corner files.
- Twelve Anne/Grace/Thomas cutout failures (R1-R4 for each character) are stored
  under
  `Experimentelles/world-packs/bridgerton/characters/cutouts-2026-08-21/technical-failures/`.
- No source portrait was overwritten or deleted. Universal character references
  were intentionally left unchanged.

## Validation checklist

- Open every copied output from its final project path.
- Record dimensions and byte size.
- For the transparent master and all four portraits, verify alpha exists, all four
  corners are alpha 0, and no checkerboard is baked into RGB pixels.
- Compare each portrait side by side with its source for face, age, clothing,
  crop, and pose drift.
- Compare all map variants with Map 3 for geography drift and forbidden labels.
- Keep any failed generation under a matching
  `pictures/Experimentelles/.../technical-failures/` folder; never overwrite it.

## Generation corrections

### I2-FINAL-PAIR-01-R1 — opaque-checkerboard failure

The first reference-based master output baked the transparency checkerboard into
an opaque RGB image (`corner alpha 255`). It is preserved as
`Experimentelles/finalization-2026-08-21/02-light-dark-pair/technical-failures/quillverse-mark-transparent-r1-opaque-checkerboard.png`.

Fresh correction prompt, frozen before regeneration:

```text
Create one new isolated Quillverse logo symbol from first principles on a transparent void. Do not create a transparency preview and do not draw a checkerboard.

Use case: logo-brand
Asset type: production-clean transparent master mark
Symbol: one broad open book forms a calm circular Q-like portal; two tall curved page shapes rise symmetrically; a simple warm-ivory arched doorway/page opening stands in the center; the lower-right book stroke becomes one restrained muted-gold fountain-pen nib
Style/medium: extremely clean flat vector-like geometry, three solid colors, strong favicon-readable silhouette
Composition/framing: centered square symbol with even generous transparent padding
Color palette: deep ink blue, warm ivory, muted gold
Technical requirement: return an RGBA PNG; every pixel outside the symbol and every intended opening is genuinely transparent with alpha 0, including all four corners; crisp antialiased edges with no colored fringe
Constraints: no visible canvas; no checkerboard; no background color; no texture; no gradient; no glow; no shadow; no bevel; no text; no watermark; no extra symbols
```

### I2-FINAL-PAIR-03-R1 — dark-tile artifact failure

The first dark tile developed a large black/blue render artifact at the lower
edge. It is preserved as
`Experimentelles/finalization-2026-08-21/02-light-dark-pair/technical-failures/quillverse-app-tile-dark-r1-render-artifact.png`.

Correction prompt, frozen before regeneration using the successful light tile
as the sole geometry reference:

```text
Use case: precise-object-edit
Asset type: matched Quillverse dark-mode app-icon tile
Input images: Image 1 is the successful light-mode tile and exact geometry reference
Primary request: create its exact dark-mode counterpart by changing only the color assignment: replace the warm-ivory tile with one uniform deep ink-blue rounded-square tile; change the deep ink-blue book/Q/doorway symbol to uniform warm ivory; keep the muted-gold fountain-pen nib gold
Constraints: preserve symbol geometry, scale, placement, padding, corner radius, negative spaces, and proportions exactly; one clean uninterrupted tile surface; flat solid colors; crisp antialiased edges; no text; no watermark
Avoid: black patches, holes, smears, transparent gaps inside the tile, gradients, texture, grain, shadows, glow, bevel, fringe, new geometry, additional symbols
```

The R2 dark tile removed the large smear but rendered opaque black pixels in all
four corners outside its rounded blue tile. The otherwise strong R1 light tile
has the same opaque-corner issue. Both are preserved as
`quillverse-app-tile-dark-r2-black-corners.png` and
`quillverse-app-tile-light-r1-black-corners.png`. The fresh transparent R2 master
passed alpha validation but changed the symbol into a different circular crest;
it is preserved as `quillverse-mark-transparent-r2-geometry-drift.png`.

Final correction strategy: use the successful light-tile symbol as the sole
geometry reference, but make both tiles full-bleed squares so an operating
system or UI can apply its own corner mask without baked corner pixels.

### I2-FINAL-PAIR-01-R3 — extract matching transparent master

```text
Use case: background-extraction
Asset type: transparent master matching the Quillverse light/dark tile family
Input images: Image 1 is the successful light-tile geometry reference
Primary request: remove only the entire warm-ivory rounded-square tile and every pixel outside the Quillverse symbol; preserve the deep ink-blue open-book Q portal, its central doorway outline/negative space, and the muted-gold fountain-pen nib as one isolated symbol
Constraints: preserve the symbol geometry, proportions, scale, position, color assignment, and crisp edges exactly; genuine RGBA transparency with alpha 0 everywhere outside the symbol and in its intended negative spaces, including all corners; no checkerboard; no background; no text; no watermark
Avoid: redesign, circle crest, added book outlines, changed doorway, new ornament, glow, shadow, gradient, fringe, solid canvas
```

### I2-FINAL-PAIR-02-R2 — full-bleed light tile

```text
Use case: precise-object-edit
Asset type: Quillverse light-mode full-bleed app-icon tile
Input images: Image 1 is the successful light-tile geometry reference
Primary request: preserve the Quillverse symbol exactly and change only the tile boundary: extend the same uniform warm-ivory background cleanly to all four square canvas edges so there are no rounded outer corners and no black corner pixels
Constraints: preserve symbol geometry, colors, scale, placement, padding, proportions, and negative spaces exactly; every canvas-edge and corner pixel must be warm ivory; flat clean surface; no text; no watermark
Avoid: black pixels, transparent corners, rounded tile boundary, gradient, paper grain, shadow, glow, bevel, fringe, changed symbol
```

### I2-FINAL-PAIR-03-R3 — full-bleed dark tile

```text
Use case: precise-object-edit
Asset type: Quillverse dark-mode full-bleed app-icon tile
Input images: Image 1 is the successful light-tile geometry reference
Primary request: preserve the Quillverse symbol geometry exactly while swapping the main colors: fill the entire square canvas edge-to-edge with uniform deep ink blue; render the complete book/Q/doorway symbol in uniform warm ivory; keep only the fountain-pen nib muted gold
Constraints: preserve symbol scale, placement, padding, proportions, and negative spaces exactly; every canvas-edge and corner pixel must be deep ink blue; no rounded outer boundary; one clean uninterrupted background; no text; no watermark
Avoid: black patches, transparent corners, holes, smears, gradients, texture, shadow, glow, bevel, fringe, changed geometry, additional symbols
```
