import UPNG from "upng-js";

// Palette verte (4 tons fixes)
const PALETTE: [number, number, number, number][] = [
  [  0,  34,   0, 255], // vert très sombre
  [ 64, 120,  64, 255], // sombre
  [144, 186, 144, 255], // moyen
  [210, 235, 210, 255], // clair
];

// Trouve l’index du vert le plus proche
function nearestPaletteIndex(r: number, g: number, b: number): number {
  let best = 0, bestD = Infinity;
  for (let i = 0; i < PALETTE.length; i++) {
    const [pr, pg, pb] = PALETTE[i];
    const dr = r - pr, dg = g - pg, db = b - pb;
    const d = dr * dr + dg * dg + db * db;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

// Convertit une image RGBA → indices palette (Uint8Array)
function indexImage(
  rgba: Uint8ClampedArray,
  width: number,
  height: number
): Uint8Array {
  const idx = new Uint8Array(width * height);
  for (let p = 0, i = 0; p < rgba.length; p += 4, i++) {
    const r = rgba[p], g = rgba[p + 1], b = rgba[p + 2];
    idx[i] = nearestPaletteIndex(r, g, b);
  }
  return idx;
}

// Encode en PNG-8 palette
export function encodePNG8(
  rgba: Uint8ClampedArray,
  width: number,
  height: number
): Uint8Array {
  // table palette RGBA aplatie
  const plte = new Uint8Array(PALETTE.length * 4);
  for (let i = 0; i < PALETTE.length; i++) {
    const [r, g, b, a] = PALETTE[i];
    const o = i * 4;
    plte[o] = r;
    plte[o + 1] = g;
    plte[o + 2] = b;
    plte[o + 3] = a;
  }

  const indexed = indexImage(rgba, width, height);

const png = UPNG.encode([indexed], width, height, PALETTE.length, 0, {
  pLTE: plte,
});

  return new Uint8Array(png);
}
