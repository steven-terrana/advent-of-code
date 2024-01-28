import input from "./input.txt";

interface Scanner {
  depth: number;
  range: number;
}

function parse(): Scanner[] {
  let scanner: Scanner[] = [];
  for (let line of input.split("\n")) {
    let [depth, range] = line.split(": ");
    scanner.push({
      depth: parseInt(depth),
      range: parseInt(range),
    });
  }
  return scanner;
}

function idx(t: number, n: number): number {
  // Calculate the period of the snaking pattern
  const period = (n - 1) * 2;

  // Find the distance to the nearest multiple of the period
  const distanceToNearestMultiple = t % period;

  // The snaking index is the minimum of this distance and its "mirror" in the period
  return Math.min(
    distanceToNearestMultiple,
    period - distanceToNearestMultiple
  );
}

function calculateSeverity(offset: number = 0): {
  sev: number;
  caught: boolean;
} {
  let severity = 0;
  let t = 0;
  let caught = false;
  while (t <= max) {
    let s = scanners.find((s) => s.depth == t);
    if (s != undefined) {
      if (idx(offset + t, s.range) == 0) {
        caught = true;
        severity += s.depth * s.range;
      }
    }
    t++;
  }
  return { sev: severity, caught: caught };
}

let scanners = parse();
let max = scanners.reduce((m, s) => Math.max(m, s.depth), -Infinity);

console.log("Part 1:", calculateSeverity(0).sev);

let t = 0;
while (calculateSeverity(++t).caught) {}

console.log("Part 2:", t);
