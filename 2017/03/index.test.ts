import { test, expect } from "bun:test";
import { findSteps } from ".";

const cases = [
  [1, 0],
  [2, 1],
  [3, 2],
  [2, 1],
  [5, 2],
  [6, 1],
  [7, 2],
  [8, 1],
  [9, 2],
  [12, 3],
  [23, 2],
  [1024, 31],
];

test.each(cases)("%p -> %p", (a, b) => {
  expect(findSteps(a)).toBe(b);
});
