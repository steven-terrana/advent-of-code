import input from "./input.txt";

/*
see: https://www.redblobgames.com/grids/hexagons/
         _____
        /  0  \
  _____/   N   \_____
 / -1  \+1   -1/ +1  \
/  NW   \_____/  NE   \
\+1    0/  q  \0    -1/
 \_____/       \_____/
 / -1  \ s   r / +1  \
/  SW   \_____/  SE   \
\0    +1/  0  \-1    0/
 \_____/   S   \_____/
       \-1   +1/
        \_____/
*/
const directions = {
  //  s  q   r
  n: [1, 0, -1],
  ne: [0, 1, -1],
  se: [-1, 1, 0],
  s: [-1, 0, 1],
  sw: [0, -1, 1],
  nw: [1, -1, 0],
};

const chebyshev = (s: number, q: number, r: number) =>
  Math.max(Math.abs(s), Math.abs(q), Math.abs(r));

let s = 0;
let q = 0;
let r = 0;
let maxDist = -Infinity;
for (let step of input.split(",")) {
  let [ds, dq, dr] = directions[step];
  s += ds;
  q += dq;
  r += dr;
  let dist = chebyshev(s, q, r);
  if (dist > maxDist) {
    maxDist = dist;
  }
}

console.log("Part 1:", chebyshev(s, q, r));
console.log("Part 2:", maxDist);
