# Core Brand Refinement Round — 2026-08-21

This review round creates exactly three variants for each of four approved
refinement targets. Existing favorites remain unchanged, every output stays
under `pictures/review-required/`, and nothing is integrated into the app.

Built-in `image_gen` is used once per distinct variant. Reference images are
project-local files and are inspected before generation.

## Outputs

| Prompt ID | Output |
|---|---|
| A1-ICON-R1-01 | `review-required/refinement-2026-08-21/a1-icons/a1-icon-book-doorway-quill.png` |
| A1-ICON-R1-02 | `review-required/refinement-2026-08-21/a1-icons/a1-icon-q-portal.png` |
| A1-ICON-R1-03 | `review-required/refinement-2026-08-21/a1-icons/a1-icon-page-window.png` |
| A-BANNER1-R1-01 | `review-required/refinement-2026-08-21/a-banner-1-organic/organic-page-doorway.png` |
| A-BANNER1-R1-02 | `review-required/refinement-2026-08-21/a-banner-1-organic/ink-ribbon-portal.png` |
| A-BANNER1-R1-03 | `review-required/refinement-2026-08-21/a-banner-1-organic/living-pages-horizon.png` |
| A-BANNER2-R1-01 | `review-required/refinement-2026-08-21/a-banner-2-calm/two-worlds-clear-path.png` |
| A-BANNER2-R1-02 | `review-required/refinement-2026-08-21/a-banner-2-calm/three-worlds-paper-ribbons.png` |
| A-BANNER2-R1-03 | `review-required/refinement-2026-08-21/a-banner-2-calm/single-horizon-storyflow.png` |
| B-OMEGA-R1-01 | `review-required/refinement-2026-08-21/b-omega-logos/omega-book-faithful.png` |
| B-OMEGA-R1-02 | `review-required/refinement-2026-08-21/b-omega-logos/omega-negative-space.png` |
| B-OMEGA-R1-03 | `review-required/refinement-2026-08-21/b-omega-logos/omega-archive-simplified.png` |

## A1 icon variants

Reference inputs for all three prompts:

- Image 1: A1 master-logo reference — semantic and palette anchor.
- Image 2: icon-study board — the top-center treatment is the simplification
  reference, not an edit target or board layout to reproduce.

### A1-ICON-R1-01 — Book doorway and quill

```text
Use case: logo-brand
Asset type: square app-icon and favicon mark derived from the approved A1 Living Manuscript identity
Input images: Image 1 is the A1 master-logo semantic and palette reference; Image 2 is an icon-study board whose top-center treatment is the simplification reference only, not an edit target
Primary request: create one new isolated icon where two bold open-book pages form a simple arched doorway and one compact muted-gold quill stands in the threshold; preserve A1's story-to-world meaning without literal landscape detail
Style/medium: ultra-clean flat vector-friendly glyph, three solid colors, premium literary software identity
Composition/framing: one centered square icon mark, strong compact silhouette, few shapes, generous transparent padding, readable at 16px
Color palette: deep ink blue, warm ivory, one restrained muted-gold accent
Technical requirement: return an RGBA PNG; every pixel outside the mark must have alpha 0; no drawn checkerboard, tile, white square, gray square, black background, or icon-study board
Constraints: no text; no wordmark; no separate Q letter; no scenery; no stars; no crown; no flowers; no mockup; no device; no 3D; no gradients; no shadow; no watermark
Avoid: copying the detailed A1 illustration, tiny feather barbs, architectural blocks, generic mobile-game icon styling
```

### A1-ICON-R1-02 — Q portal

```text
Use case: logo-brand
Asset type: square app-icon and favicon mark derived from the approved A1 Living Manuscript identity
Input images: Image 1 is the A1 master-logo semantic and palette reference; Image 2 is an icon-study board whose top-center treatment is the simplification reference only, not an edit target
Primary request: create one new isolated icon where two broad page arcs form a subtle circular Q-shaped portal, the Q tail resolves into a tiny fountain-pen nib, and one ivory doorway opening remains at the center
Style/medium: minimal flat vector-friendly symbol, bold geometry softened by one literary curve
Composition/framing: centered compact mark, strong outer contour, balanced negative space, generous transparent padding, unmistakable at favicon size
Color palette: deep ink blue dominant, warm ivory opening, tiny muted-gold nib accent
Technical requirement: return an RGBA PNG; every pixel outside the mark and in intended openings must have alpha 0; no drawn checkerboard or any background surface
Constraints: no text; no wordmark; no extra letters; no literal landscape; no standalone feather; no stars; no crest; no crown; no mockup; no 3D; no gradients; no shadow; no watermark
Avoid: ornate monogram, thin hairlines, generic circular tech logo, luxury-fashion imitation
```

### A1-ICON-R1-03 — Page window

```text
Use case: logo-brand
Asset type: square app-icon and favicon mark derived from the approved A1 Living Manuscript identity
Input images: Image 1 is the A1 master-logo semantic and palette reference; Image 2 is an icon-study board whose top-center treatment is the simplification reference only, not an edit target
Primary request: create one new isolated icon shaped like a compact closed-book block with a large rounded page-window cut through its center; a single minimal quill stroke crosses the window and suggests a path into a story
Style/medium: very simple flat vector-friendly glyph, editorial and software-ready
Composition/framing: centered near-square silhouette, large readable cutout, minimal interior detail, generous transparent padding
Color palette: deep ink blue, warm ivory, one small muted-gold stroke
Technical requirement: return an RGBA PNG; all canvas pixels outside the mark must have alpha 0; do not draw transparency as a checkerboard or place the glyph on a tile
Constraints: no text; no wordmark; no literal scenery; no stars; no crown; no flowers; no mockup; no 3D; no bevel; no gradient; no shadow; no watermark
Avoid: generic book clip art, library-app imitation, tiny decoration, rigid Minecraft-like block perspective
```

## Organic A banner-1 replacements

Reference input for all three prompts:

- Image 1: A1 master-logo reference — identity, palette, and doorway language.

The old banner is deliberately not a reference because its rigid architectural
geometry must not carry into the replacements.

### A-BANNER1-R1-01 — Organic page doorway

```text
Use case: stylized-concept
Asset type: wide universal Quillverse brand banner replacing the blocky first Living Manuscript banner
Input images: Image 1 is the approved A1 master-logo reference for palette, book, quill, Q-curve, and story-doorway language; do not paste the logo into the scene
Primary request: an open manuscript on the right grows into one softly luminous arched doorway made entirely from curling organic page edges; one restrained quill line leads toward the opening
Scene/backdrop: abstract world-neutral literary darkness with layered paper and ink washes, no room or constructed architecture
Style/medium: premium editorial illustration, soft painterly paper realism with clean graphic hierarchy
Composition/framing: wide cinematic banner, one clear focal doorway right of center, generous calm ink-blue negative space across the left half for later deterministic typography
Lighting/mood: warm ivory page light, contemplative, inviting, handcrafted rather than digital
Color palette: deep ink blue, warm ivory, parchment, restrained muted gold
Constraints: no text; no letters; no logo pasted into image; no people; no franchise motifs; no stars; no crown; no watermark
Avoid: cubes, bricks, rectangular wall panels, corridors, rigid architecture, Minecraft-like perspective, busy bookshelves, fantasy portal spectacle, particles
```

### A-BANNER1-R1-02 — Ink-ribbon portal

```text
Use case: stylized-concept
Asset type: wide universal Quillverse brand banner replacing the blocky first Living Manuscript banner
Input images: Image 1 is the approved A1 master-logo reference for palette and living-manuscript semantics; do not paste the logo into the scene
Primary request: one broad ivory manuscript ribbon sweeps organically from an open book at the lower right, loops once like a subtle Q, and becomes a glowing paper portal; a muted-gold quill stroke follows the same curve
Scene/backdrop: deep ink-blue field with only soft paper grain and faint ink bloom, entirely world-neutral
Style/medium: sophisticated editorial storybook illustration, fluid calligraphic composition, restrained painterly depth
Composition/framing: wide banner with a single easy-to-read gesture; focal loop and book on the right third; uncluttered left safe area
Lighting/mood: quiet wonder, warm paper glow, elegant and immediate
Color palette: ink blue, ivory, parchment, very restrained muted gold
Constraints: no text; no people; no literal landscape; no extra portals; no stars; no crown; no watermark
Avoid: block architecture, rooms, corridors, cuboids, Minecraft-like geometry, multiple focal points, glitter, neon, fantasy-game loading screen
```

### A-BANNER1-R1-03 — Living pages horizon

```text
Use case: stylized-concept
Asset type: wide universal Quillverse brand banner replacing the blocky first Living Manuscript banner
Input images: Image 1 is the approved A1 master-logo reference for palette and story-doorway meaning; do not paste the logo into the scene
Primary request: soft sheets of living parchment rise from a book on the right like fabric or gentle waves, parting to reveal one simple luminous horizon beyond; one elegant quill rests along the opening
Scene/backdrop: abstract ink-and-paper atmosphere with no identifiable era or genre
Style/medium: refined painterly editorial illustration with tactile paper fibers and graceful organic folds
Composition/framing: wide, one dominant opening right of center, broad quiet left half, large simple shapes and no tiny details
Lighting/mood: serene, warm, spacious, emotionally inviting
Color palette: deep ink blue shadows, warm ivory light, parchment, restrained gold
Constraints: no text; no letters; no people; no buildings; no stars; no crown; no watermark
Avoid: hard surfaces, rectangular panels, architecture, Minecraft-like blocks, clutter, magical particles, photorealistic room, overt fantasy spectacle
```

## Calmer A banner-2 variants

Reference inputs for all three prompts:

- Image 1: A1 master-logo reference — identity and palette anchor.
- Image 2: original pages-into-worlds banner — concept reference whose density
  must be reduced, not an edit target to reproduce literally.

### A-BANNER2-R1-01 — Two worlds, clear path

```text
Use case: stylized-concept
Asset type: wide universal Quillverse brand banner simplifying the original pages-into-worlds concept
Input images: Image 1 is the approved A1 identity reference; Image 2 is the original pages-into-worlds concept reference whose idea should be simplified, not copied in detail
Primary request: one open book on the right unfolds into exactly two large paper horizons only — a calm woodland and a calm coast — connected by one obvious ivory path and one restrained quill line
Style/medium: sophisticated editorial storybook illustration, soft cinematic painterly depth, large readable shapes
Composition/framing: wide banner; one immediate right-side story flow from book to two horizons; generous uncluttered left half for later typography
Lighting/mood: luminous warm paper, calm possibility, understandable in one glance
Color palette: ink blue, ivory, parchment, muted sage, dusty blue, restrained gold
Constraints: exactly two world horizons; no text; no people; no logos; no castle; no prominent city; no stars; no watermark
Avoid: tiny landmarks, many ribbons, decorative foliage, collage seams, competing focal points, visual puzzle, fantasy-game loading screen
```

### A-BANNER2-R1-02 — Three broad world ribbons

```text
Use case: stylized-concept
Asset type: wide universal Quillverse brand banner simplifying the original pages-into-worlds concept
Input images: Image 1 is the approved A1 identity reference; Image 2 is the original pages-into-worlds concept reference whose concept should be clarified and reduced
Primary request: three broad and clearly separated manuscript ribbons rise from one book on the right; the ribbons suggest only forest, water, and a distant world-neutral town silhouette, with one quill line linking them in a simple upward rhythm
Style/medium: premium editorial illustration, restrained painterly finish, paper-cut clarity without collage seams
Composition/framing: wide banner, three large ribbons confined to the right half, calm deep-ink left safe area, no overlapping focal points
Lighting/mood: quietly wondrous, orderly, readable immediately
Color palette: ink blue, warm ivory, parchment, muted sage, dusty blue, minimal muted gold
Constraints: exactly three broad ribbons; no text; no people; no franchise imagery; no crown; no stars; no watermark
Avoid: tiny buildings, waves with spray, ornamental vines, many layers, excessive detail, chaos, neon, sparkles
```

### A-BANNER2-R1-03 — Single horizon storyflow

```text
Use case: stylized-concept
Asset type: wide universal Quillverse brand banner simplifying the original pages-into-worlds concept
Input images: Image 1 is the approved A1 identity reference; Image 2 is the original pages-into-worlds concept reference whose emotional promise should remain while its complexity is removed
Primary request: one continuous sheet of parchment flows from an open book on the right into a single panoramic horizon that gently transitions from water to woodland to one distant abstract arch; one quill stroke traces the transition
Style/medium: elegant painterly editorial illustration with strong negative space and one continuous visual sentence
Composition/framing: wide banner, simple right-side panorama, large calm left area, one dominant path and no secondary vignettes
Lighting/mood: warm, expansive, serene, immediately comprehensible
Color palette: deep ink blue, ivory, parchment, muted sage and dusty blue, restrained gold
Constraints: one continuous horizon only; no text; no people; no castle; no detailed skyline; no stars; no watermark
Avoid: stacked layers, multiple worlds, tiny landmarks, collage, clutter, ornate borders, magic particles, dramatic waves
```

## B V1 / omega logo regenerations

Reference inputs for all three prompts:

- Image 1: original B V1 form reference — preferred book silhouette, circular
  interior, and indirect omega impression; its checkerboard is a defect and must
  never be reproduced.
- Image 2: clean B logo — palette and genuine-alpha technical reference only;
  its composition is secondary to Image 1.

### B-OMEGA-R1-01 — Faithful V1 form

```text
Use case: logo-brand
Asset type: square Celestial Archive comparison logo regenerated from the user-preferred original V1 form
Input images: Image 1 is the preferred V1 form reference; preserve its circular book silhouette, heart-like open pages, dark inner archive field, three-star constellation, and violet quill arc, but never reproduce its checkerboard; Image 2 is a clean-alpha palette and technical reference only
Primary request: create a fresh, faithful but cleaner interpretation of Image 1 where the outer book subtly reads as an omega without becoming a literal Greek letter
Style/medium: flat vector-friendly literary emblem, elegant and slightly magical, bold favicon-readable silhouette
Composition/framing: centered isolated mark, circular balance, generous fully transparent padding
Color palette: midnight ink blue, warm ivory, muted gold, one restrained dusty-violet quill accent
Technical requirement: return an RGBA PNG with alpha 0 in all four corners and every intended exterior opening; no visible canvas, checkerboard, tile, or background surface
Constraints: exactly three constellation stars; no text; no wordmark; no extra letters; no crown; no crest shield; no mockup; no 3D; no gradient; no watermark
Avoid: copying checkerboard pixels, astrology logo, galaxy effects, excessive sparkles, generic fantasy-game emblem
```

### B-OMEGA-R1-02 — Stronger omega negative space

```text
Use case: logo-brand
Asset type: square Celestial Archive comparison logo exploring the user-liked indirect omega idea
Input images: Image 1 is the preferred V1 form reference for book and constellation character, but its checkerboard must not appear; Image 2 is a clean-alpha palette reference only
Primary request: two broad open-book pages curve upward into one nearly circular archive portal whose lower negative space quietly suggests omega; a single dusty-violet quill follows the right arc and exactly three muted-gold stars form a sparse constellation inside
Style/medium: minimal flat vector-friendly emblem with a premium literary silhouette
Composition/framing: centered, symmetrical enough to feel stable but not heraldic, bold outer contour, generous transparent padding
Color palette: midnight ink blue, warm ivory, muted gold, dusty violet
Technical requirement: genuine RGBA transparency with alpha 0 outside the symbol and in all intended openings; no drawn checkerboard, white tile, gray tile, or background
Constraints: no literal Greek letter pasted into the mark; no text; no wordmark; no crown; no shield; no mockup; no 3D; no gradient; no watermark
Avoid: astrology brand, university seal, excessive stars, thin fragile lines, fantasy-game styling
```

### B-OMEGA-R1-03 — Simplified archive omega

```text
Use case: logo-brand
Asset type: square Celestial Archive comparison logo simplifying the user-preferred V1 concept
Input images: Image 1 is the preferred V1 form reference for its book/omega impression; ignore and remove its checkerboard; Image 2 is a clean-alpha palette reference only
Primary request: reduce the idea to one bold midnight-blue omega-like book ring, two warm-ivory page tips at the bottom, one simple dusty-violet quill stroke, and one tiny three-node muted-gold constellation
Style/medium: ultra-clean flat vector-friendly software mark, few shapes, strong small-size recognition
Composition/framing: centered isolated icon, balanced circular silhouette, large transparent openings, generous transparent padding
Color palette: midnight ink blue dominant, warm ivory, muted gold, dusty violet
Technical requirement: return an RGBA PNG; all pixels outside the mark must have alpha 0; no checkerboard, canvas, icon tile, or background color
Constraints: no text; no wordmark; no literal omega character; no extra stars; no crown; no crest; no mockup; no 3D; no shadows; no gradients; no watermark
Avoid: generic astrology app icon, ornate feather detail, fantasy-game badge, luxury-fashion monogram
```
