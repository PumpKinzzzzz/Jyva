export function toGrayscale(
  image: Uint8ClampedArray, // clamped array of RGBA values
  levels: number = 4 // number of gray levels we will quantize to (4 by default, can be 2, 4, 8, etc.)
): Uint8ClampedArray {
  const output = new Uint8ClampedArray(image.length); // create a new array to hold the output, good practice to avoid modifying the input directly
  const step = 255 / (levels - 1); // what grey we will step by, e.g., for 4 levels, step will be 85 (0, 85, 170, 255)

  for (let i = 0; i < image.length; i += 4) { // iterate over each pixel, 4 values per pixel (RGBA)
    const r = image[i];
    const g = image[i + 1];
    const b = image[i + 2];
    const a = image[i + 3];

    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b); // we define the grey for a pixel using the standard formula for luminance
    // https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale

    output[i] = output[i + 1] = output[i + 2] = gray; // set the RGB values to the computed gray value
    output[i + 3] = a; // keep the alpha channel unchanged
  }

  return output;
}