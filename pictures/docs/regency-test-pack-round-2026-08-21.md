# Gate 2B — Regency seed-world test pack

Date: 2026-08-21
Status: generation complete; every output requires visual review
Mode: built-in `image_gen`, one call per distinct image

This pack is derived from the current `sim_default` seed data and the approved
visual-asset-library design. It is intentionally world-pack-specific; none of
its Regency motifs belong to the universal Quillverse master brand. All people
are original fictional Hale-family characters, never actor or series likenesses.

No output is integrated into the application.

## Output matrix

| Prompt ID | Output |
|---|---|
| REG-CHAR-01 | `world-packs/bridgerton/characters/review-2026-08-21/matthias-hale.png` |
| REG-CHAR-02 | `world-packs/bridgerton/characters/review-2026-08-21/anne-hale.png` |
| REG-CHAR-03 | `world-packs/bridgerton/characters/review-2026-08-21/grace-hale.png` |
| REG-CHAR-04 | `world-packs/bridgerton/characters/review-2026-08-21/thomas-hale.png` |
| REG-LOC-01 | `world-packs/bridgerton/locations/review-2026-08-21/hale-farm.png` |
| REG-LOC-02 | `world-packs/bridgerton/locations/review-2026-08-21/village-market.png` |
| REG-LOC-03 | `world-packs/bridgerton/locations/review-2026-08-21/regency-london.png` |
| REG-LOC-04 | `world-packs/bridgerton/locations/review-2026-08-21/aubrey-hall.png` |
| REG-MAP-01 | `world-packs/bridgerton/maps/review-2026-08-21/hale-region.png` |
| REG-SCENE-01 | `world-packs/bridgerton/story-scenes/review-2026-08-21/matthias-at-dawn.png` |

## Character portrait series

REG-CHAR-02 through REG-CHAR-04 use the generated REG-CHAR-01 image as a
family-style reference. Preserve lighting, crop, medium, and plausible family
traits while making every relative unmistakably distinct.

### REG-CHAR-01 — Matthias Hale

```text
Use case: stylized-concept
Asset type: canonical head-and-shoulders portrait reference for an original fictional player character in a Regency living-world simulation
Primary request: Matthias Hale, age 22, a modest English tenant-farmer's son; medium height, wiry and field-strong rather than muscular, angular weathered face, dark-blond slightly unruly hair, grey-green observant eyes, calm reserved expression with dry intelligence; clean but sun-worn skin; simple 1813 work shirt, muted waistcoat, and plain neckcloth in repaired natural fabrics
Scene/backdrop: softly painted rural blue-grey and warm umber background with no objects
Style/medium: elegant romantic Regency editorial illustration, soft cinematic realism, refined painterly finish, natural skin and fabric texture
Composition/framing: square head-and-shoulders portrait, eye-level, shoulders fully visible, identical crop template suitable for a four-character family series, generous oval-mask safety
Lighting/mood: warm natural key from upper left, cool soft fill, quiet dignity without aristocratic glamour
Color palette: weathered ivory, muted oat, dusty ink blue, soft umber, restrained sage-grey
Constraints: one adult only; original fictional identity; no actor or franchise-character likeness; historically plausible 1813 tenant-farmer clothing; no text; no logo; no hat; no jewelry; no weapon; no modern element; no watermark
Avoid: fashion-model beauty, nobleman's costume, costume-drama glamour, exaggerated dirt, fantasy styling, busy farm backdrop
```

### REG-CHAR-02 — Anne Hale

```text
Use case: identity-preserve
Asset type: canonical head-and-shoulders portrait reference for an original fictional Hale-family character in a Regency living-world simulation
Input images: Image 1 is Matthias Hale; use it only to preserve the exact painterly medium, square crop, upper-left lighting, rural palette, and subtle family resemblance in grey-green eyes and facial structure; Anne must be a clearly distinct older woman, not a transformed or aged copy
Primary request: Anne Hale, age 47, Matthias's mother; slim and work-worn, kind tired grey-green eyes, fine lines from worry and outdoor labor, greying dark-blond hair neatly tied back, warm practical expression with quiet determination; simple clean 1813 everyday dress in muted slate-blue with visibly repaired seams and a plain warm-ivory kerchief
Scene/backdrop: same softly painted rural blue-grey and warm umber atmosphere as Image 1, no objects
Style/medium: exactly the same elegant romantic Regency editorial illustration, soft cinematic realism, and refined painterly finish as Image 1
Composition/framing: same square head-and-shoulders crop, scale, camera height, and oval-mask safety as Image 1
Lighting/mood: same warm upper-left natural key and cool soft fill; she feels like the steady center of a hard-working household
Constraints: one adult woman only; original fictional identity; no actor likeness; historically plausible modest 1813 clothing; no text; no logo; no jewelry; no bonnet; no glamour makeup; no modern element; no watermark
Avoid: face cloning, aristocratic gown, severe misery, fantasy peasant stereotype, busy interior
```

### REG-CHAR-03 — Grace Hale

```text
Use case: identity-preserve
Asset type: canonical head-and-shoulders portrait reference for an original fictional Hale-family character in a Regency living-world simulation
Input images: Image 1 is Matthias Hale; use it only for the exact painterly medium, square crop, upper-left lighting, rural palette, and believable sibling resemblance in dark-blond hair, grey-green eyes, and cheek structure; Grace must be a clearly distinct sixteen-year-old sister, never an adult glamour portrait
Primary request: Grace Hale, age 16, small and slender, youthful lively face, dark-blond hair simply pinned back with a few loose strands, bright grey-green curious eyes, restrained half-smile as if eager to see beyond the farm; simple historically plausible 1813 day dress in faded sage and warm ivory, modest neckline and no ornament
Scene/backdrop: same softly painted rural blue-grey and warm umber atmosphere as Image 1, no objects
Style/medium: exactly the same elegant Regency editorial illustration, soft cinematic realism, and refined painterly finish as Image 1
Composition/framing: same square head-and-shoulders crop, camera height, scale, and oval-mask safety as Image 1
Lighting/mood: same warm upper-left natural key and cool fill; curious, lively, grounded, and entirely non-romanticized
Constraints: one sixteen-year-old fictional character only; age-appropriate nonsexual depiction; no actor likeness; modest 1813 rural clothing; no text; no logo; no jewelry; no makeup; no low neckline; no modern element; no watermark
Avoid: adult appearance, glamour pose, aristocratic debutante styling, childish cartoon proportions, fantasy costume, busy background
```

### REG-CHAR-04 — Thomas Hale

```text
Use case: identity-preserve
Asset type: canonical head-and-shoulders portrait reference for an original fictional Hale-family character in a Regency living-world simulation
Input images: Image 1 is Matthias Hale; use it only for the exact painterly medium, square crop, upper-left lighting, rural palette, and a restrained family resemblance in brow and jaw; Thomas must be a clearly distinct older uncle with brown eyes, not an aged copy
Primary request: Thomas Hale, age 51, tall and strongly built, weathered face, greying dark hair, brown eyes, hearty but restrained expression; a reliable Bristol corn merchant used to roads and warehouses; practical 1813 travel coat, simple waistcoat, linen neckcloth, and sturdy natural fabrics, prosperous enough to be maintained but never aristocratic
Scene/backdrop: same softly painted blue-grey and warm umber atmosphere as Image 1, no objects
Style/medium: exactly the same elegant Regency editorial illustration, soft cinematic realism, and refined painterly finish as Image 1
Composition/framing: same square head-and-shoulders crop, camera height, scale, and oval-mask safety as Image 1
Lighting/mood: same warm upper-left natural key and cool fill; dependable, businesslike warmth held in reserve
Constraints: one adult man only; original fictional identity; no actor likeness; historically plausible 1813 merchant clothing; no text; no logo; no top hat; no weapon; no aristocratic jewelry; no modern element; no watermark
Avoid: face cloning, pirate styling, nobleman glamour, Victorian costume, exaggerated jovial grin, busy harbor background
```

## Location series

### REG-LOC-01 — Hale farm

```text
Use case: stylized-concept
Asset type: canonical wide location reference for the Hale family's modest tenant farm in an 1813 Regency living-world simulation
Primary request: a small working English tenant farm with a weathered thatched stone farmhouse, one timber barn, low hedgerows, kitchen garden, pasture, stacked tools, and a muddy cart track; cared for through hard work but visibly short of money, no picturesque luxury
Scene/backdrop: rolling southern-English farmland and distant tree line in early spring, historically plausible agricultural details
Style/medium: elegant romantic Regency environment illustration, soft cinematic realism, refined painterly finish, natural material texture
Composition/framing: wide eye-level establishing shot, farmhouse in middle distance, path entering from lower foreground, barn offset to one side, open left and right character zones, lower fifth calm enough for dialogue UI
Lighting/mood: pale dawn light after light rain, fragile hope, ordinary labor, family warmth
Color palette: wet earth, weathered limestone, straw, muted sage, dusty blue-grey, parchment morning light
Constraints: no people; no text; no sign; no logo; no modern machinery; no electric utility; no palace; no manicured estate garden; no fantasy element; no watermark
Avoid: luxury cottage, idyllic tourism poster, medieval farm cliché, dramatic castle landscape, excessive clutter
```

### REG-LOC-02 — Village market

```text
Use case: stylized-concept
Asset type: canonical wide location reference for the discovered village market near the Hale farm in an 1813 Regency living-world simulation
Primary request: a small English village market square with uneven cobbles, a restrained cluster of canvas produce stalls, timber-and-plaster buildings, baskets, grain sacks, a handcart, and modest everyday trade; lived-in and socially useful rather than quaint or theatrical
Scene/backdrop: compact rural village under soft morning cloud, historically plausible 1813 materials and scale
Style/medium: elegant Regency editorial environment illustration, soft cinematic realism, refined painterly finish and readable depth planes
Composition/framing: wide eye-level square, open central meeting area, stalls pushed mostly to the sides, clear foreground for character overlays, calm lower fifth for dialogue UI
Lighting/mood: bright overcast daylight, low-key bustle suggested through objects but no visible people, approachable and observant
Color palette: warm plaster, aged timber, muted canvas, soft clay, dusty ink blue, restrained vegetable greens
Constraints: no people; no text; no stall names; no signs; no logo; no modern packaging; no cars; no electric wires; no royal or franchise symbol; no watermark
Avoid: crowded festival, Christmas market, generic fantasy RPG market, luxurious shopping street, excessive produce detail
```

### REG-LOC-03 — Regency London

```text
Use case: stylized-concept
Asset type: canonical wide London location reference for an 1813 Regency living-world simulation
Primary request: an elegant but genuinely lived-in London street at the beginning of the social Season: pale stucco and brick townhouses, black iron railings, shallow steps, wet cobbles, one distant period carriage, discreet service activity implied by open doors and parcels; refined society exists here but the street is not a palace set
Scene/backdrop: early-nineteenth-century London with soft haze and layered townhouse depth, no identifiable real address or franchise location
Style/medium: elegant romantic Regency environment illustration, soft cinematic realism, refined painterly finish with controlled architectural detail
Composition/framing: wide eye-level street, strong diagonal leading line, broad foreground and side zones for character overlays, lower fifth visually calm for dialogue UI
Lighting/mood: luminous late morning after rain, social promise with a trace of distance and hierarchy
Color palette: warm cream stucco, soft brick, wet slate, ink-blue shadows, restrained sage and muted carriage burgundy
Constraints: no prominent people; no readable text; no signs; no logo; no modern object; no electric lamp; no motor vehicle; no palace; no actor or series character; no watermark
Avoid: pristine film set, Victorian London, Dickensian slum, fantasy city, row of identical toy façades, excessive carriage traffic
```

### REG-LOC-04 — Aubrey Hall

```text
Use case: stylized-concept
Asset type: canonical wide location reference for Aubrey Hall as a grand English country estate in an 1813 Regency living-world simulation
Primary request: a dignified honey-stone country house with restrained classical columns, long symmetrical façade, broad gravel drive, formal lawn, clipped hedges, mature cedar trees, and distant parkland; materially grand but emotionally believable, designed as an original interpretation rather than copying any filmed property
Scene/backdrop: expansive English estate grounds in late spring, layered countryside and soft sky haze
Style/medium: elegant romantic Regency environment illustration, soft cinematic realism, refined painterly finish, premium but not fantastical
Composition/framing: wide eye-level establishing shot from the long approach, estate centered slightly above midline, open foreground and calm lower fifth for UI, clear side zones for later characters or carriages
Lighting/mood: warm late-afternoon light, inherited grandeur, invitation mixed with social pressure
Color palette: honey stone, parchment light, deep ink-blue shadows, muted lawn green, restrained dusty lavender blossoms
Constraints: no people; no text; no crest; no logo; no modern object; no copied TV location; no palace scale; no fantasy architecture; no watermark
Avoid: Versailles grandeur, wedding venue advertisement, gothic castle, perfect CGI symmetry, excessive flowers, franchise recreation
```

## Map and story scene

### REG-MAP-01 — Hale region

```text
Use case: stylized-concept
Asset type: text-free top-down regional map background for the current Hale-family Regency simulation
Primary request: create one coherent southern-English region with modest farm country and a nearby village concentrated in the southwest, a major London-like urban mass in the northeast, and grand estate parkland with formal grounds in the southeast; connect them by restrained pale roads, hedgerows, woodland, streams, and open agricultural fields while leaving generous pin-safe clearings at all four target sectors
Style/medium: refined Regency book-atlas cartography, elegant watercolor and ink on warm paper, clear enough for an interactive UI
Composition/framing: wide full-bleed strict overhead map, no horizon, southwest farm/village sector, northeast city sector, southeast estate sector, quieter northwest woodland and fields, clear travel hierarchy
Color palette: warm parchment, muted sage, dusty blue water, soft ochre fields, ink-blue linework, tiny restrained oxblood route accents only
Materials/textures: fine paper grain, controlled watercolor washes, crisp broad geographic masses
Constraints: no text; no letters; no numbers; no labels; no legend; no compass rose; no border; no baked pins; no icons; no coat of arms; no logo; no sky; no horizon; no watermark
Avoid: exact real-world geography, fantasy-map ornament, isometric buildings, crowded tiny trees, treasure-map styling, satellite realism
```

### REG-SCENE-01 — Matthias at dawn

```text
Use case: identity-preserve
Asset type: wide in-game story-scene test artwork for the Hale-family Regency living-world simulation
Input images: Image 1 is Matthias Hale's canonical portrait and Image 2 is the Hale farm canonical location; preserve Matthias's exact fictional identity, age, hair, eyes, clothing class, and painterly finish, and preserve the farm's farmhouse, barn, terrain, weathered materials, dawn palette, and overall spatial identity
Primary request: Matthias stands beside the muddy farm track at pale dawn, three-quarter figure seen from a respectful distance, holding a folded unopened letter loosely in one work-worn hand while looking toward the farmhouse; his posture is reserved and thoughtful, as if weighing family duty against a distant opportunity
Scene/backdrop: the same Hale farm after light rain, soft mist over pasture, no other people
Style/medium: elegant romantic Regency story illustration, soft cinematic realism, refined painterly finish consistent with both references
Composition/framing: wide landscape; Matthias occupies the left third without blocking the farmhouse; right side and lower fifth remain calm and dark enough for dialogue UI; clear foreground-to-house visual path
Lighting/mood: pale gold dawn from upper left, cool wet earth reflections, restrained hope and responsibility rather than melodrama
Constraints: one adult only; preserve identity and farm design; historically plausible 1813 clothing; no readable writing on the folded letter; no text; no logo; no modern object; no actor likeness; no fantasy effect; no watermark
Avoid: heroic poster pose, romance-cover glamour, dramatic storm, oversized letter prop, close-up crop, busy UI-hostile foreground
```

## Output audit

Generation completed on 2026-08-21. Every output was copied to its matrix path,
opened locally, and inspected. No hard-constraint failure or discarded
Regency-generation attempt occurred.

| Prompt ID | Dimensions | Technical / visual result |
|---|---:|---|
| REG-CHAR-01 | 1254x1254 | Matthias is distinct, field-worn, reserved, and non-aristocratic; strong canonical family-series anchor |
| REG-CHAR-02 | 1254x1254 | Anne is clearly distinct and age-appropriate while sharing plausible Hale eyes/structure and the exact series treatment |
| REG-CHAR-03 | 1254x1254 | Grace is an age-appropriate nonsexual sixteen-year-old portrait with believable sibling resemblance and simple rural dress |
| REG-CHAR-04 | 1254x1254 | Thomas is a distinct older uncle with brown eyes and merchant/travel clothing; style and crop remain locked |
| REG-LOC-01 | 1536x1024 | Hale farm reads as cared-for but financially constrained; farmhouse, barn, hedges, pasture, mud, and dialogue-safe foreground all present |
| REG-LOC-02 | 1536x1024 | Village market has restrained side stalls and an open social center; no people, signage, text, or modern objects |
| REG-LOC-03 | 1536x1024 | London is elegant but lived-in, with wet cobbles and one distant period carriage; no readable text or modern object |
| REG-LOC-04 | 1536x1024 | Aubrey Hall conveys inherited grandeur without palace scale or copied franchise geography |
| REG-MAP-01 | 1536x1024 | Label-free overhead map matches the seeded sector logic: village/farm southwest, city northeast, estate southeast |
| REG-SCENE-01 | 1536x1024 | Matthias and the farm retain their canonical identities in one restrained dawn scene; folded letter has no readable writing and the right/lower areas remain UI-friendly |

The pack is internally coherent enough to test future asset pipelines, but every
file remains `needs-review` and has not been integrated into the application.
