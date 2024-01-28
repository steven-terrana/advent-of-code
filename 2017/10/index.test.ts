import { test, expect } from "bun:test";
import { knotHash } from ".";

const cases = [
  ["", "a2582a3a0e66e6e86e3812dcb672a272"],
  ["AoC 2017", "33efeb34ea91902bb2f59c9920caa6cd"],
  ["1,2,3", "3efbe78a8d82f29979031a4aa0b16a9d"],
  ["1,2,4", "63960835bcdc130f0b66d7ff4f6a5a8e"],
];

test.each(cases)("%p -> %p", (a, b) => {
  expect(knotHash(a)).toBe(b);
});
