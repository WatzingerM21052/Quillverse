import { Location } from '../state/models/location.model';

/** Loose terrain association per location type — informs the landscape, never a labelled building. */
const TERRAIN_BY_TYPE: Record<string, string> = {
  farm: 'open farmland with hedgerows and pasture',
  market: 'a small village with a cluster of rooftops',
  city: 'a dense town skyline',
  estate: 'a wooded estate with formal grounds',
};

const SECTOR_NAMES = ['im Nordwesten', 'im Nordosten', 'im Südwesten', 'im Südosten'];

/** Which quadrant of the map a location's percent coordinates fall into. */
function sectorOf(location: Location): number {
  const north = location.mapPosition.y < 50;
  const west = location.mapPosition.x < 50;
  if (north && west) return 0;
  if (north && !west) return 1;
  if (!north && west) return 2;
  return 3;
}

/**
 * Terrain-only hints derived from where the pins already sit, never their
 * names — the generated image must never contain text or labelled places,
 * only landscape features roughly matching what's already positioned there
 * (§ Map §"pins and locations on the map must correspond").
 */
function terrainHints(locations: Location[]): string {
  const bySector = new Map<number, string[]>();
  for (const location of locations) {
    const terrain = TERRAIN_BY_TYPE[location.type];
    if (!terrain) continue;
    const sector = sectorOf(location);
    const list = bySector.get(sector) ?? [];
    list.push(terrain);
    bySector.set(sector, list);
  }

  const lines: string[] = [];
  for (const [sector, terrains] of bySector) {
    lines.push(`${SECTOR_NAMES[sector]} ${[...new Set(terrains)].join(' and ')}`);
  }
  return lines.length > 0 ? `The terrain should loosely suggest: ${lines.join('; ')}.` : '';
}

/**
 * §Map — a terrain-only base map (no place names, no labels, no roads with
 * writing on them) so the app-rendered pins layered on top can never be
 * contradicted by the artwork. Alignment holds by construction: this image
 * encodes no coordinates of its own.
 *
 * Deliberately does NOT reuse the world pack's visualStyleBible — that bible
 * ("cinematic realism", "painterly finish") is tuned for character/location
 * establishing shots and actively fights a top-down map (tried it: the model
 * kept rendering a perspective landscape painting instead of a flat map).
 * The cartographic framing below has to lead the prompt, not follow it.
 */
export function buildMapPrompt(locations: Location[]): string {
  return [
    'A FLAT TOP-DOWN CARTOGRAPHIC MAP, like a page from an antique atlas viewed straight from above — explicitly NOT a landscape painting, NOT a scenic vista, NOT an angled or perspective view of the countryside.',
    'Hand-drawn antique map illustration on aged parchment: fine pen-and-ink hatching for hills, small tree-symbol clusters for woodland, a thin winding line for a river or road, patchwork field boundaries — the classic bird\'s-eye map style used in old English county atlases, a touch fantastical in linework but the geography stays plausible.',
    terrainHints(locations),
    'The full canvas is covered edge to edge with terrain drawn from directly overhead — no blank margins, no picture frame, no compass rose, no decorative border, no sky, no horizon line.',
    'Absolutely no text, no labels, no place names, no legends, no numbers, no lettering of any kind anywhere in the image.',
    'No people, no close-up buildings, nothing large enough to read as a single labelled landmark.',
  ]
    .filter(Boolean)
    .join(' ');
}
