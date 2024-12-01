import { test, expect } from "bun:test";
import { isMatch, parseEnhancement } from ".";

let case1 = `.#.
..#
###`;

let case2 = `.#.
#..
###`;

let case3 = `#..
#.#
##.`;

let case4 = `###
..#
.#.`;

let case5 = `###
.##
.#.`;

const parseCase = (c: string) => {
  return c.split("\n").map((l: string) => Array.from(l));
};

let enhancement = parseEnhancement(".#./..#/### => #..#/..../..../#..#");

test("case 1", () => {
  expect(isMatch(parseCase(case1), enhancement)).toBe(true);
});

test("case 2", () => {
  expect(isMatch(parseCase(case2), enhancement)).toBe(true);
});

test("case 3", () => {
  expect(isMatch(parseCase(case3), enhancement)).toBe(true);
});

test("case 4", () => {
  expect(isMatch(parseCase(case4), enhancement)).toBe(true);
});

test("case 5", () => {
  expect(isMatch(parseCase(case5), enhancement)).toBe(false);
});
