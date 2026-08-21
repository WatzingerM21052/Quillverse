# Visual Asset Library — Design Specification

Date: 2026-08-20  
Status: completed image library; final completion audit 2026-08-21
Scope: project-local image library and review workflow, not app integration

Implementation closure: all Gate 1 concepts, selected brand derivatives,
universal composition functions, the Hale/Regency test pack, the 66-image
expansion, both ornament directions, presentation art, icon PNG families, and
the final image fixes were generated and documented. The only excluded work is
application integration, which was never part of this image-only specification.

## 1. Goal

Create an original, coherent image library that makes Quillverse feel like a
premium living-world product instead of an Angular prototype. The library must
serve two distinct needs without mixing them:

1. **Universal Quillverse assets** — reusable composition, brand, map,
   character, location, scene, texture, frame, ornament, and placeholder
   references that are not tied to Bridgerton or any one future world pack.
2. **Bridgerton test assets** — concrete images for the current seeded world,
   used to prove that the same system can produce a coherent Regency pack.

The project already defines its intended experience as an interactive novel,
visual novel, living-world simulation, diary, and dynamic storybook. The asset
library must support that experience; it must not turn the UI into a fantasy HUD
or a generic dashboard.

## 2. Brand architecture

Quillverse itself is a universal living-world brand. Its core identity must
remain valid for future worlds such as school fantasy, nature shapeshifting,
mermaid, mystery, or historical settings. Regency motifs belong to the current
world pack, not to the master brand.

### Primary direction: A — Living Manuscript

The approved primary direction combines:

- an abstract quill;
- an open book or narrative portal;
- an optional subtle `Q` construction;
- ink blue, warm ivory, and restrained muted gold;
- an elegant literary rather than heraldic or overtly magical character.

The mark should still read at favicon size. Fine detail must be removable
without destroying its silhouette.

### Comparison direction: B — Celestial Archive

Produce one logo example and one small banner/mood example using a book or
portal with restrained stars/constellations. This is a comparison concept only:
it demonstrates a more overtly multiversal/magical alternative, but is not the
chosen direction.

### Comparison direction: C — Storybook Crest

Produce one logo example and one small banner/mood example using a seal or crest
with a quill and monogram. This is a comparison concept only: it demonstrates a
more heraldic/premium alternative, but is not the chosen direction because it
leans too strongly toward Regency and aristocracy.

## 3. Existing visual language to preserve

The current UI and specs already establish a strong base:

- mahogany and dark-library chrome;
- parchment and warm cream for in-world documents;
- Regency blue and oxblood accents;
- muted gold only for thin frames, active elements, seals, and ornaments;
- Cormorant Garamond / EB Garamond literary typography;
- restrained floral lines, wisteria, roses, leaves, feathers, wax seals, and
  letter ornaments;
- a manuscript/library direction added by the Design Rework;
- world-pack image style: elegant romantic Regency illustration, soft
  cinematic realism, warm natural light, refined painterly finish,
  historically inspired clothing, and no modern elements.

Generated assets must feel compatible with these decisions. They must not
introduce neon colors, excessive gold, generic high-fantasy UI, glossy mobile-
game rendering, or copied television marketing art.

## 4. Directory structure

All deliverables live under a new project-root `pictures/` directory:

```text
pictures/
  README.md
  review-required/
    direction-a-living-manuscript/
      logos/
      favicons/
      banners/
    direction-b-celestial-archive/
    direction-c-storybook-crest/
  universal/
    maps/
    characters/
    locations/
    story-scenes/
    textures/
    frames-and-ornaments/
    placeholders/
  world-packs/
    bridgerton/
      maps/
      characters/
      locations/
      story-scenes/
  docs/
    asset-catalog.md
    visual-style-bible.md
    prompts.md
```

The root `pictures/README.md` explains review status and the rule that files in
`review-required/` are not approved production assets.

## 5. Review gates

The work is deliberately split into two stages.

### Gate 1 — brand concepts

Generate only:

- A: three logo/mark concepts, two banner concepts, one favicon/app-icon
  preview sheet;
- B: one logo example and one small banner/mood example;
- C: one logo example and one small banner/mood example.

Then stop and present all candidates to the user. Do not replace
`apps/web/public/favicon.ico`, PWA icons, the shell brand, manifest metadata, or
any live UI asset.

### Gate 2 — final brand derivatives

Only after explicit user approval:

- refine the chosen A mark;
- derive a wordmark, compact mark, monochrome mark, app icon, favicon family,
  and production banner;
- construct exact `Quillverse` typography deterministically rather than
  trusting raster image-generation text;
- keep final files in `pictures/` until a separate app-integration request.

Universal and Bridgerton libraries follow after Gate 1 approval. Their files
are catalogued as `draft` until visually inspected.

## 6. Universal asset library

“Universal” means reusable **visual function and composition**, not that one
finished castle or person must fit every world.

### Maps

Create three text-free, label-free composition references:

1. clean atlas terrain with clear pin-safe zones;
2. painterly terrain with restrained organic detail;
3. manuscript/ink terrain suitable for recoloring per world pack.

They contain no place names, legends, numbers, logos, baked pins, or specific
world lore. They are flat/top-down and avoid horizon or perspective views.

### Characters

Create reusable portrait-composition references:

- head-and-shoulders neutral portrait;
- half-body conversational portrait;
- compact oval/cameo crop matching the current Story screen;
- four-expression reference sheet with a consistent anonymous identity.

These establish crop, camera height, light direction, background simplicity,
and negative space. They are not canonical characters.

### Locations

Create composition references for:

- wide exterior establishing shot;
- intimate interior;
- urban/street environment;
- natural landscape;
- major landmark/event location.

Avoid era-specific world lore in these references. Their job is to establish
framing, scale, depth, and safe overlay zones.

### Story scenes

Create stage-composition references matching the architecture spec:

- background/environment;
- optional weather/time layer;
- safe left/right character zones;
- unobstructed lower dialogue region;
- no baked dialogue or UI text.

### Supporting assets

Create restrained paper/ink textures, subtle frames/ornaments, and premium
placeholder imagery. Universal ornaments may use abstract pages, quills,
portals, ink flourishes, and simple botanical geometry; wisteria, crowns, and
wax-seal Regency specifics stay in the Bridgerton pack.

## 7. Bridgerton test pack

The test pack proves consistency against actual seed data.

### Character portrait series

- Matthias Hale, age 22: wiry farm-built, weathered face, dark-blond hair,
  grey-green eyes, reserved, simple tenant-farmer work clothing, small scar on
  left hand;
- Anne Hale, age 47: slim and work-worn, kind tired eyes, greying tied-back
  hair, simple repaired dress, practical and warm;
- Grace Hale, age 16: small, youthful, lively, dark-blond hair, grey-green
  eyes, simple dress, curious expression;
- Thomas Hale, age 51: tall and strong, weathered, greying hair, brown eyes,
  merchant/travel clothing, hearty but restrained.

The four images must share painterly finish, crop, light direction, background,
historical plausibility, and family resemblance where the data supports it.
They must depict original fictional people, not actors or series characters.

### Location series

- Hale farm: modest tenant farm, thatched farmhouse, barn, hedgerows, pasture;
- village market: small English market square, stalls, timber buildings,
  cobbles, restrained everyday activity;
- Regency London: elegant but lived-in street, townhouses, carriages, no
  modern elements;
- Aubrey Hall: grand English country estate, columned façade, formal grounds,
  long drive.

### Map and story scene

- one Hale-region map base aligned conceptually with the existing pin sectors:
  farm/village in the southwest, London in the northeast, estate/formal grounds
  in the southeast;
- no text, labels, pins, compass rose, decorative frame, sky, or horizon;
- one test story scene combining a generated location, one Hale character, and
  restrained atmosphere while leaving the app’s dialogue area readable.

## 8. File formats and dimensions

Concept and project-bound image generation uses the built-in image-generation
tool. Each distinct asset receives its own prompt/call rather than treating
different assets as variants of one prompt.

Preferred masters:

- logo concept/mark: square high-resolution PNG, transparent background where
  the generator preserves alpha;
- favicon preview: square contact sheet plus later deterministic 16/32/48/192/
  512 derivatives after approval;
- banner: landscape, preferably 3:1 or 16:9 with intentional safe text space;
- portrait: 1:1 master, composed to survive oval/cameo cropping;
- location/story scene: 3:2 or 16:9 landscape;
- map: wide landscape, flat/top-down;
- textures: seamless-looking square master where practical.

Do not overwrite an existing file. Revisions use `-v2`, `-v3`, or a short
direction suffix.

## 9. Documentation and provenance

`pictures/docs/asset-catalog.md` records for every file:

- stable asset id and filename;
- family (`brand`, `universal`, `bridgerton`);
- intended use;
- dimensions and format;
- status (`draft`, `needs-review`, `approved`, `rejected`, `superseded`);
- exact final prompt;
- generation mode (`built-in image_gen`);
- date and relevant source descriptions;
- possible future app path or state field;
- notes about identity/style consistency.

`pictures/docs/visual-style-bible.md` separates the universal Quillverse brand
bible from the Bridgerton world-pack bible. `pictures/docs/prompts.md` preserves
the normalized prompt set so future sessions can recreate or extend the work.

## 10. Validation

Every generated image is visually inspected for:

- subject and composition accuracy;
- compatibility with the current UI palette;
- historical/world consistency where applicable;
- no accidental text, watermark, logo, or modern object;
- correct safe zones and crop behavior;
- no copied actor likeness or recognizable television promotional composition;
- identity consistency across a character series;
- correct top-down map perspective;
- readable silhouette at intended display size.

Logo, favicon, and banner candidates require explicit user approval before any
final derivative or app integration. No asset is wired into Angular, D1, R2,
the manifest, or production as part of this design task.

## 11. Execution order

1. Scaffold `pictures/` and documentation templates.
2. Generate A/B/C review concepts only.
3. Inspect outputs, record prompts/status, and present them to the user.
4. Stop for Gate 1 approval.
5. After approval, refine A and create brand derivatives.
6. Generate universal visual templates.
7. Generate the Bridgerton test pack using the locked visual references.
8. Inspect/catalog everything, update project docs/worklog, commit, and push.
9. Integrate approved assets into the app only under a separate explicit task.
