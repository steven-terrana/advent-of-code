import input from "./input.txt";

import * as math from "mathjs";

interface Vector {
  id: number;
  p: number[];
  v: number[];
  a: number[];
}

const getAttribute = (a: string, v: string) =>
  v
    .match(new RegExp(`${a}=<(-?\\d+),(-?\\d+),(-?\\d+)>`))
    ?.slice(1)
    .map((n) => parseInt(n));

let vectors: Vector[] = input.split("\n").map((v, id) => {
  return {
    id: id,
    p: getAttribute("p", v)!,
    v: getAttribute("v", v)!,
    a: getAttribute("a", v)!,
  };
});

// sorts vectors based on how far away they'll be at t = Infinity.
const comparator = (x: Vector, y: Vector) => {
  const magnitude = (attr: number[]) =>
    Math.sqrt(attr.reduce((sum, d) => sum + d ** 2, 0));

  if (magnitude(x.a) != magnitude(y.a)) {
    return magnitude(x.a) - magnitude(y.a);
  } else if (magnitude(x.v) != magnitude(y.v)) {
    return magnitude(x.v) - magnitude(y.v);
  } else {
    return magnitude(x.p) - magnitude(y.p);
  }
};

vectors.sort(comparator);
console.log("Part 1:", vectors[0].id);

let lastCollision = 0;
let t = 0;
while (true) {
  let positionCount = new Map<string, number>();
  let position2Vector = new Map<string, number[]>();
  for (let v of vectors) {
    v.v = v.v.map((x, idx) => x + v.a[idx]);
    v.p = v.p.map((x, idx) => x + v.v[idx]);
    let key = JSON.stringify(v.p);
    if (!positionCount.has(key)) {
      positionCount.set(key, 1);
      position2Vector.set(key, [v.id]);
    } else {
      positionCount.set(key, positionCount.get(key)! + 1);
      position2Vector.get(key)?.push(v.id);
    }
  }
  let collisionPoints = Array.from(positionCount)
    .filter((c) => c[1] > 1)
    .map((c) => c[0]);
  if (collisionPoints.length > 0) {
    lastCollision = t;
    let remove = collisionPoints.map((p) => position2Vector.get(p)).flat();
    vectors = vectors.filter((v) => !remove.includes(v.id));
  }
  if (t - lastCollision > 10) {
    break;
  }
  t++;
}

console.log("Part 2:", vectors.length);
