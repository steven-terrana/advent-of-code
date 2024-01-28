import raw from "./input.txt";

function getInput(n: number) {
  let input: number[] = [];
  for (let i = 0; i < n; i++) {
    input.push(i);
  }
  return input;
}

function hash(input: number[], lengths: number[], n: number = 1): number[] {
  let currentPosition = 0;
  let skipSize = 0;
  const idx = (i: number) => i % input.length;
  for (let iter = 0; iter < n; iter++) {
    for (let l of lengths) {
      // Reverse the order of that length of elements in the list, starting with the element at the current position.
      let sub: number[] = [];
      for (let i = 0; i < l; i++) {
        sub.push(input[idx(currentPosition + i)]);
      }
      sub.reverse();
      for (let i = 0; i < l; i++) {
        input[idx(currentPosition + i)] = sub[i];
      }
      // Move the current position forward by that length plus the skip size.
      currentPosition += l + skipSize;
      // Increase the skip size by one.
      skipSize++;
    }
  }
  return input;
}

export function knotHash(input: string) {
  let nums = getInput(256);
  let lengths2 = Array.from(input).map((l, idx) => input.charCodeAt(idx));
  lengths2.push(17, 31, 73, 47, 23);

  let sparse = hash(nums, lengths2, 64);

  let dense: number[] = [];
  let xor = sparse[0];
  for (let i = 1; i < nums.length; i++) {
    if (i % 16 == 0) {
      dense.push(xor);
      xor = sparse[i];
    } else {
      xor ^= sparse[i];
    }
  }
  dense.push(xor);

  return dense.map((d) => d.toString(16).padStart(2, "0")).join("");
}

if (import.meta.main) {
  let lengths = raw.split(",").map((l) => parseInt(l));
  let h = hash(getInput(256), lengths);
  let part1 = h[0] * h[1];
  console.log("Part 1:", part1);
  console.log("Part 2:", knotHash(raw));
}
