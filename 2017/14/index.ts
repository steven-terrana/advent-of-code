import { knotHash } from "../10";

const hexToBin = (hash: string): string => {
  return Array.from(hash).reduce(
    (s, c) => s + parseInt(c, 16).toString(2).padStart(4, "0"),
    ""
  );
};

// build the grid
const key = "stpzcrnm";
let grid: string[][] = [];
for (let i = 0; i < 128; i++) {
  let hash = knotHash(`${key}-${i}`);
  let row = hexToBin(hash);
  grid.push(Array.from(row));
}

// find all the coordinates of used cells
let remaining = new Set<string>();
for (let i = 0; i < grid.length; i++) {
  for (let j = 0; j < grid[0].length; j++) {
    if (grid[i][j] == "1") {
      remaining.add(JSON.stringify([i, j]));
    }
  }
}

console.log("Part 1:", remaining.size);

let regions = 0;
while (remaining.size > 0) {
  regions++;
  let nodeKey = remaining.entries().next().value[0];
  let node = JSON.parse(nodeKey);
  let queue = [node];
  remaining.delete(nodeKey);
  while (queue.length > 0) {
    let node = queue.shift();
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    for (let dir of directions) {
      let i = node[0] + dir[0];
      let j = node[1] + dir[1];
      if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length) {
        continue;
      }
      let neighborKey = JSON.stringify([i, j]);
      if (remaining.has(neighborKey)) {
        queue.push([i, j]);
        remaining.delete(neighborKey);
      }
    }
  }
}

console.log("Part 2:", regions);
