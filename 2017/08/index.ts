import input from "./input.txt";

class Memory extends Map<string, number> {
  maxValue: number = -Infinity;
  get(k: string): number {
    if (!this.has(k)) {
      this.set(k, 0);
    }
    return super.get(k)!;
  }
  set(k: string, v: number): this {
    if (v > this.maxValue) {
      this.maxValue = v;
    }
    super.set(k, v);
    return this;
  }
}

let memory = new Memory();

const conditions = [
  (c: string, r: number, v: number) => c == "<" && r >= v,
  (c: string, r: number, v: number) => c == "<=" && r > v,
  (c: string, r: number, v: number) => c == ">" && r <= v,
  (c: string, r: number, v: number) => c == ">=" && r < v,
  (c: string, r: number, v: number) => c == "==" && r != v,
  (c: string, r: number, v: number) => c == "!=" && r == v,
];

for (let line of input.split("\n")) {
  let parts = line.split(" ");
  let comparator = parts[5];
  let register = memory.get(parts[4]);
  let value = parseInt(parts[6]);
  if (conditions.some((c) => c(comparator, register, value))) {
    continue;
  }
  let op = parts[1];
  let r = parts[0];
  let v = parseInt(parts[2]);
  if (op == "inc") {
    memory.set(r, memory.get(r)! + v);
  } else if (op == "dec") {
    memory.set(r, memory.get(r)! - v);
  }
}

let part1 = [...memory.values()].reduce(
  (max, v) => Math.max(max, v),
  -Infinity
);
console.log("Part 1:", part1);
console.log("Part 2:", memory.maxValue);
