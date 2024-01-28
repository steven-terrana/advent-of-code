class Generator {
  previous: number;
  factor: number;
  criteria: number;
  constructor(initial: number, factor: number, criteria: number = 1) {
    this.previous = initial;
    this.factor = factor;
    this.criteria = criteria;
  }
  generate(): string {
    do {
      this.previous = (this.previous * this.factor) % 2147483647;
    } while (this.previous % this.criteria != 0);
    let bin = this.previous.toString(2);
    return bin.substring(bin.length - 16);
  }
}

let a = new Generator(722, 16807);
let b = new Generator(354, 48271);
let part1 = 0;
for (let i = 0; i < 40e6; i++) {
  if (a.generate() == b.generate()) {
    part1++;
  }
}
console.log("Part 1:", part1);

let c = new Generator(722, 16807, 4);
let d = new Generator(354, 48271, 8);
let part2 = 0;
for (let i = 0; i < 5e6; i++) {
  if (c.generate() == d.generate()) {
    part2++;
  }
}
console.log("Part 2:", part2);
