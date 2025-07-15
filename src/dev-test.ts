import fs from "fs";
import { PNG } from "pngjs";
import { toGrayscale } from "./core/grayscale";

// Lis un fichier image PNG (à mettre à la racine) look for mononoke picture in Jyva/testpictures
const input = PNG.sync.read(fs.readFileSync("testpictures/mononoke.png"));

// Transforme l'image
const gray = toGrayscale(
  new Uint8ClampedArray(input.data.buffer, input.data.byteOffset, input.data.byteLength),
  4
);
// Prépare un nouveau PNG avec les mêmes dimensions
const out = new PNG({ width: input.width, height: input.height });
out.data.set(gray);

// Sauvegarde le résultat
fs.writeFileSync("output.png", PNG.sync.write(out));