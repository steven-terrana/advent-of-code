import input from "./input.txt";

function jumpAround(offset: (n: number) => number): number {
  let jumps = input.split("\n").map((n) => parseInt(n));
  let idx = 0;
  let steps = 0;
  while (idx >= 0 && idx < jumps.length) {
    let jump = jumps[idx];
    jumps[idx] = offset(jump);
    idx += jump;
    steps++;
  }
  return steps;
}

console.log(
  "Part 1:",
  jumpAround((j: number) => j + 1)
);

console.log(
  "Part 2:",
  jumpAround((j: number) => (j >= 3 ? j - 1 : j + 1))
);
