import input from "./input.txt";

const spin = (s: string[], n: number) => {
  for (let i = 0; i < n; i++) {
    s.unshift(s.pop()!);
  }
};

const exchange = (s: string[], a: number, b: number) => {
  let tmp = s[a];
  s[a] = s[b];
  s[b] = tmp;
};

const partner = (s: string[], a: string, b: string) => {
  let x = s.indexOf(a);
  let y = s.indexOf(b);
  exchange(s, x, y);
};

const dance = (o: string[], inst: string[]) => {
  let s = o.slice();
  let seen = new Map<number, string>();
  let t = 0;
  while (true) {
    for (let i of inst) {
      if (i.startsWith("s")) {
        let n = parseInt(i.slice(1));
        spin(s, n);
      }
      if (i.startsWith("x")) {
        let [a, b] = i
          .slice(1)
          .split("/")
          .map((n) => parseInt(n));
        exchange(s, a, b);
      }
      if (i.startsWith("p")) {
        let [a, b] = i.slice(1).split("/");
        partner(s, a, b);
      }
    }
    if (!Array.from(seen.values()).includes(s.join(""))) {
      seen.set(++t, s.join(""));
    } else {
      break;
    }
  }
  return seen;
};

let s = Array.from("abcdefghijklmnop");
let inst = input.split(",");

let cycles = dance(s, inst);

console.log("Part 1:", cycles.get(1));
console.log("Part 2:", cycles.get(1000000000 % cycles.size));
