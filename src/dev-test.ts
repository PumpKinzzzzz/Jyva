// dev-test.ts (Ai generated test)
import fs from "fs";
import { PNG } from "pngjs";
import { toGrayscale } from "./core/grayscale.js";
import { bayerDither, makeGreen } from "./core/floyds_steinberg.js";
import { encodePNG8 } from "./core/palette.js";

function savePNG(path: string, data: Uint8ClampedArray, width: number, height: number) {
  const out = new PNG({ width, height });
  out.data.set(data);
  fs.writeFileSync(path, PNG.sync.write(out));
}

const input = PNG.sync.read(fs.readFileSync("testpictures/desert.png"));
const rgba = new Uint8ClampedArray(input.data.buffer, input.data.byteOffset, input.data.byteLength);

// 1) Niveaux de gris (R=G=B, alpha conservé)
const gray = toGrayscale(rgba);
savePNG("testpictures/desert-gray.png", gray, input.width, input.height);

// 2) Bayer 8×8 vers 4 niveaux
const dithered = bayerDither(gray, input.width, 4, 8);
savePNG("testpictures/desert-dither.png", dithered, input.width, input.height);

// 3) Teinte verte douce
const tinted = makeGreen(dithered);
savePNG("testpictures/desert-green.png", tinted, input.width, input.height);

// 4) Palettisation + export PNG-8
const png8bytes = encodePNG8(tinted, input.width, input.height);
fs.writeFileSync("testpictures/desert-green-palette.png", png8bytes);
console.log("✅ PNG-8 exporté :", (png8bytes.length / 1024).toFixed(1), "KB");