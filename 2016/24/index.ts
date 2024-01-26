import input from "./input.txt";

interface Point {
  row: number;
  col: number;
}
interface State extends Point {
  steps: number;
}
interface Spot extends Point {
  n: string;
}

function parse() {
  let lines = input.split("\n");
  let grid: string[][] = [];
  let spots = [];
  for (let row = 0; row < lines.length; row++) {
    let line = lines[row];
    let r = [];
    for (let col = 0; col < lines[0].length; col++) {
      let c = line[col];
      if (!isNaN(parseInt(c))) {
        spots.push({
          n: c,
          row,
          col,
        });
      }
      r.push(c == "#" ? "#" : ".");
    }
    grid.push(r);
  }
  return { grid, spots };
}

// heaps algorithm: https://en.wikipedia.org/wiki/Heap%27s_algorithm
function permute<T>(arr: T[]): T[][] {
  let result: T[][] = [];

  function swap(array: T[], index1: number, index2: number): void {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
  }

  function generate(n: number, heapArray: T[]): void {
    if (n === 1) {
      result.push([...heapArray]);
      return;
    }

    generate(n - 1, heapArray);

    for (let i = 0; i < n - 1; i++) {
      if (n % 2 === 0) {
        swap(heapArray, i, n - 1);
      } else {
        swap(heapArray, 0, n - 1);
      }
      generate(n - 1, heapArray);
    }
  }

  generate(arr.length, arr.slice());
  return result;
}

function bfs(
  grid: string[][],
  o: Spot,
  spots: Spot[],
  dist: Map<string, Map<string, number>>
) {
  if (dist.get(o.n) == undefined) {
    dist.set(o.n, new Map<string, number>());
  }
  let queue: State[] = [
    {
      row: o.row,
      col: o.col,
      steps: 0,
    },
  ];
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  const next = (s: State): State[] => {
    let n: State[] = [];
    for (let d of directions) {
      let row = s.row + d[0];
      let col = s.col + d[1];
      if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
        continue;
      }
      if (grid[row][col] == "#") {
        continue;
      }
      if (visited.some((v) => v.row == row && v.col == col)) {
        continue;
      }
      let newState = {
        row: row,
        col: col,
        steps: s.steps + 1,
      };
      n.push(newState);
      visited.push(newState);
    }
    return n;
  };
  const visited: State[] = [];
  const getSpot = (s: State) =>
    spots.find((spot) => spot.row == s.row && spot.col == s.col);

  while (queue.length > 0) {
    let state = queue.shift()!;
    // printMaze(grid, state, visited);
    visited.push(state);
    let spot = getSpot(state);
    if (spot != undefined && !dist.get(o.n)?.get(spot.n)) {
      dist.get(o.n)?.set(spot.n, state.steps);
      if (dist.get(spot.n) == undefined) {
        dist.set(spot.n, new Map<string, number>());
      }
      dist.get(spot.n)?.set(o.n, state.steps);
    }
    if (dist.get(o.n)!.size == spots.length) {
      break;
    }
    queue.push(...next(state));
  }
}

function shortestPath(
  paths: Spot[][],
  distances: Map<string, Map<string, number>>
): number {
  let shortestDistance = Infinity;
  search: for (let path of paths) {
    let dist = 0;
    for (let i = 0; i < path.length - 1; i++) {
      let d = distances.get(path[i]!.n)?.get(path[i + 1]!.n);
      if (d == undefined) {
        continue search;
      }
      dist += d;
      if (dist >= shortestDistance) {
        break;
      }
    }
    if (dist < shortestDistance) {
      shortestDistance = dist;
    }
  }
  return shortestDistance;
}

let { grid, spots } = parse();

// 2D map of maps for shortest distance between nodes
let distances = new Map<string, Map<string, number>>();
spots.forEach((s) => bfs(grid, s, spots, distances));

let s0 = spots.find((s) => s.n == "0");
let otherSpots = spots.filter((s) => s.n != "0");

let part1Paths = permute(otherSpots).map((p) => [s0, ...p]);
let part2Paths = permute(otherSpots).map((p) => [s0, ...p, s0]);

console.log("Part 1:", shortestPath(part1Paths, distances));
console.log("Part 2:", shortestPath(part2Paths, distances));
