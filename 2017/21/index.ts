import input from "./input.txt";
import { chunk, zip } from "lodash";

export interface Enhancement {
  pattern: string[][];
  numOn: number;
  output: string[][];
}

export function parseEnhancement(e: string): Enhancement {
  let [pattern, output] = e
    .split(" => ")
    .map((part) => part.split("/").map((l) => Array.from(l)));

  return { pattern, output, numOn: countOn(pattern) };
}

function countOn(pixel: string[][]): number {
  return pixel.flat().join("").replaceAll(".", "").length;
}

function parse(): Enhancement[] {
  let enhancements: Enhancement[] = [];
  for (let line of input.split("\n")) {
    enhancements.push(parseEnhancement(line));
  }
  return enhancements;
}

export function isMatch(pixel: string[][], enhancement: Enhancement): boolean {
  // only test rules with same dimension as pixel
  if (pixel.length != enhancement.pattern.length) {
    return false;
  }

  // quick check, if the number of on pixels don't match, the pattern wont match
  if (countOn(pixel) != enhancement.numOn) {
    return false;
  }

  const matches = (pixel: string[][], pattern: string[][]): boolean => {
    return pixel.flat().join("") == pattern.flat().join("");
  };

  const flip = () => {
    // reverse each row
    for (let row of pattern) {
      row.reverse();
    }
  };

  const rotate = (pattern: string[][]) => {
    // transpose the pattern
    for (let i = 0; i < pattern.length; i++) {
      for (let j = i; j < pattern.length; j++) {
        [pattern[i][j], pattern[j][i]] = [pattern[j][i], pattern[i][j]];
      }
    }
    flip();
  };

  // deep copy
  let pattern = enhancement.pattern.map((line) => [...line]);

  // default - check
  // rotate clockwise - check
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 4; j++) {
      rotate(pattern);
      if (matches(pixel, pattern)) {
        return true;
      }
    }
    flip();
  }
  return false;
}

function pixelize(display: string[][], n: number): string[][][] {
  let pixels = [];
  let size = display.length;

  // Check if the display can be evenly divided into pixels of the specified size
  if (size % n !== 0) {
    throw new Error("display size is not a multiple of subarray size.");
  }

  for (let row = 0; row < size; row += n) {
    for (let col = 0; col < size; col += n) {
      const subarray = [];

      for (let subRow = 0; subRow < n; subRow++) {
        const rowContent = [];
        for (let subCol = 0; subCol < n; subCol++) {
          rowContent.push(display[row + subRow][col + subCol]);
        }
        subarray.push(rowContent);
      }

      pixels.push(subarray);
    }
  }

  return pixels;
}

function enhance(display: string[][], enhancements: Enhancement[]): string[][] {
  let pixelSize = [2, 3].find((n) => display.length % n == 0);
  if (!pixelSize) {
    throw new Error("display is not divisible into 2 or 3 sized pixels");
  }

  let pixels = pixelize(display, pixelSize).map(
    (p) => enhancements.find((e) => isMatch(p, e))!.output
  );

  if (pixels.length == 1) return pixels[0];

  return chunk(pixels, Math.sqrt(pixels.length))
    .map((row: string[][][]) => zip(...row))
    .flat()
    .map((row: string[][]) => row.reduce((r, p) => r.concat(p), []));
}

let display = `
.#.
..#
###
`
  .trim()
  .split("\n")
  .map((line) => Array.from(line));

let enhancements = parse();
let enhanced = display;
for (let i = 0; i < 18; i++) {
  enhanced = enhance(enhanced, enhancements);
  if (i == 4) {
    console.log("Part 1:", countOn(enhanced));
  }
  if (i == 17) {
    console.log("Part 1:", countOn(enhanced));
  }
}
