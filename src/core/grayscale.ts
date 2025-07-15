export function toGrayscale(
  input: Uint8ClampedArray, // clamped array of RGBA values
  levels: number = 4 // number of gray levels we will quantize to (4 by default, can be 2, 4, 8, etc.)
): Uint8ClampedArray {
  const output = new Uint8ClampedArray(input.length); // create a new array to hold the output, good practice to avoid modifying the input directly

  const step = 255 / (levels - 1); // what grey we will step by, e.g., for 4 levels, step will be 85 (0, 85, 170, 255)

  for (let i = 0; i < input.length; i += 4) { // iterate over each pixel, 4 values per pixel (RGBA)
    const r = input[i];
    const g = input[i + 1];
    const b = input[i + 2];
    const a = input[i + 3];

    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b); // we define the grey for a pixel using the standard formula for luminance
    // https://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
    const quantized = Math.round(gray / step) * step; // we put this gray on our quantization scale (the step thingy)

    output[i] = output[i + 1] = output[i + 2] = quantized; // set the RGB values to the quantized gray value (a pixel with all channels equal is a gray pixel)
    output[i + 3] = a; // keep the alpha channel unchanged
  }

  return output;
}