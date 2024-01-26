import { test, expect } from "bun:test";
import { findSteps } from ".";

test("Data from square 1 is carried 0 steps, since its at the access port.", () => {
  expect(findSteps(1)).toBe(0);
});
test("Data from square 12 is carried 3 steps, such as: down, left, left.", () => {
  expect(findSteps(12)).toBe(3);
});
test("Data from square 23 is carried only 2 steps: up twice.", () => {
  expect(findSteps(23)).toBe(2);
});
test("Data from square 1024 must be carried 31 steps.", () => {
  expect(findSteps(1024)).toBe(31);
});
