// RGBA -> tableau de gris (on lit R, mais R=G=B)
export function rgbaArrayToGrayscaleArray(image: Uint8ClampedArray): Uint8ClampedArray {
  const gray = new Uint8ClampedArray(image.length / 4);
  for (let i = 0, j = 0; i < image.length; i += 4, j++) {
    gray[j] = image[i];
  }
  return gray;
}

// Matrices Bayer usuelles
function getBayerMatrix(size: number): number[][] {
  if (size === 2) return [
    [0, 2],
    [3, 1],
  ];
  if (size === 4) return [
    [0,  8,  2, 10],
    [12, 4, 14,  6],
    [3, 11,  1,  9],
    [15, 7, 13,  5],
  ];
  if (size === 8) return [
    [0,32, 8,40, 2,34,10,42],
    [48,16,56,24,50,18,58,26],
    [12,44, 4,36,14,46, 6,38],
    [60,28,52,20,62,30,54,22],
    [3,35,11,43, 1,33, 9,41],
    [51,19,59,27,49,17,57,25],
    [15,47, 7,39,13,45, 5,37],
    [63,31,55,23,61,29,53,21],
  ];
  throw new Error("Bayer non supporté : choisis 2, 4 ou 8.");
}

// Ordered Bayer simple (multi-niveaux)
export function bayerDither(
  image: Uint8ClampedArray, // RGBA, déjà en N&B
  width: number,
  levels: number = 4,
  matrixSize: number = 8     // 4 = look plus “pixel”, 8 = transitions plus douces
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(image.length);
  const gray = rgbaArrayToGrayscaleArray(image);
  const M = getBayerMatrix(matrixSize);
  const h = Math.floor(gray.length / width);
  const denom = matrixSize * matrixSize;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;

      // intensité normalisée
      const v = gray[i] / 255;

      // position dans l’échelle de niveaux (continu)
      const g = v * (levels - 1);
      const base = Math.floor(g);         // niveau de base
      const frac = g - base;              // fraction 0..1

      // seuil local Bayer normalisé
      const T = (M[y % matrixSize][x % matrixSize] + 0.5) / denom;

      // si la fraction dépasse le seuil, on monte d’un niveau
      const L = Math.min(levels - 1, base + (frac >= T ? 1 : 0));
      const newPix = Math.round((L / (levels - 1)) * 255);

      const o = i * 4;
      out[o] = out[o + 1] = out[o + 2] = newPix;
      out[o + 3] = 255;
    }
  }
  return out;
}

// Teinte verte douce (optionnelle)
export function makeGreen(image: Uint8ClampedArray): Uint8ClampedArray {
  const output = new Uint8ClampedArray(image.length);
  for (let i = 0; i < image.length; i += 4) {
    const g = image[i];
    output[i]     = Math.round(g * 0.85);
    output[i + 1] = g;
    output[i + 2] = Math.round(g * 0.75);
    output[i + 3] = image[i + 3];
  }
  return output;
}
