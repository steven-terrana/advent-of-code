import input from "./input.txt";
import { std, mean, floor } from "mathjs";
import { MinPriorityQueue } from "@datastructures-js/priority-queue";

interface Point {
  x: number;
  y: number;
}

interface Node extends Point {
  used: number;
  size: number;
  fixed?: boolean;
}

interface Step1State {
  empty: Point;
  steps: number;
}

interface Step2State extends Step1State {
  target: Point;
}

function parse(): Node[][] {
  let regex =
    /\/dev\/grid\/node-x(?<x>\d+)-y(?<y>\d+)\s+(?<size>\d+)T\s+(?<used>\d+)/;
  let nodes: Node[] = [];
  let df = input.split("\n").slice(2);
  for (let file of df) {
    let result = regex.exec(file);
    nodes.push({
      x: parseInt(result!.groups!.x),
      y: parseInt(result!.groups!.y!),
      used: parseInt(result!.groups!.used),
      size: parseInt(result!.groups!.size),
    });
  }
  let COLS = Math.max(...nodes.map((n) => n.x));
  let ROWS = Math.max(...nodes.map((n) => n.y));
  let grid: Node[][] = [];
  for (let y = 0; y <= ROWS; y++) {
    grid.push([]);
    for (let x = 0; x <= COLS; x++) {
      grid[y].push(nodes.find((n) => n.x == x && n.y == y)!);
    }
  }
  return grid;
}

function viablePairs(grid: Node[][]): number {
  let nodes = grid.flat();
  let viable = 0;
  for (let a of nodes) {
    for (let b of nodes) {
      if (a.x == b.x && a.y == b.y) {
        continue;
      }
      if (a.used > 0 && a.used <= b.size - b.used) {
        viable++;
      }
    }
  }
  return viable;
}

/*
  there are 3 points of interest in the graph:
  1. origin{0,0} - where we need to get the data to
  2. target{0,max} - where the data to steal is
  3. empty{x,y} - where the empty tile is

  this is essentially a two step A* search.

  Step 1: Get the empty slot next to the target on the side
          that minimizes the distance from empty to origin

          if we evaluate which neighbor of the target has the
          shortest manhattan distance to the origin then we can
          set that as the endpoint of the path in the search and
          use a simple manhattan distance heuristic to get to that
          spot.

          we'll evaluate next possible states based on which neighbor
          nodes of the empty tile can we swap data with

  Step 2: Walk the target data towards the origin

          this is still basically pathfinding but the heuristic is
          minimum steps taken + the manhattan distance of the target 
          to the origin.

          here, we'll prune states that involve where the empty tile
          stops being a neighbor (including diagnols) of the target
*/

function annotateFixedNodes(grid: Node[][]) {
  // first things first, the puzzle indicates that some of the nodes
  // are significantly bigger than the rest and aren't going anywhere
  // so let's process the nodes to find those and mark them as such.
  // if this were a "maze" - these nodes are essentially the walls.
  let nodes = grid.flat();
  let avg = mean(...nodes.map((n) => n.size));
  let sigma = std(...nodes.map((n) => n.size));
  nodes.forEach((n) => (n.fixed = n.size > avg + sigma));
}

function findKeyPoints(grid: Node[][]) {
  let origin = {
    x: 0,
    y: 0,
  };

  let target = {
    x: grid[0].length - 1,
    y: 0,
  };

  let emptyNode = grid.flat().find((n) => n.used == 0)!;
  let empty = {
    x: emptyNode.x,
    y: emptyNode.y,
  };
  return { origin: origin, target: target, empty: empty };
}

function manhattan(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function determineStep1EndPoint(grid: Node[][]): Point {
  let step1Target: Point | undefined = undefined;

  let DtoO = Infinity;
  for (let d of directions) {
    let p = {
      x: target.x + d[1],
      y: target.y + d[0],
    };
    if (p.x < 0 || p.y < 0 || p.x >= grid[0].length || p.y >= grid.length) {
      continue;
    }
    let dist = manhattan(p, origin);
    if (dist < DtoO && !grid[p.y][p.x].fixed) {
      step1Target = p;
      DtoO = dist;
    }
  }
  if (step1Target == undefined) {
    throw new Error("unable to determine step 1 target");
  }
  return step1Target;
}

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

function Step1FindNextStates(s: Step1State): Step1State[] {
  let next: Step1State[] = [];
  for (let d of directions) {
    let p = {
      x: s.empty!.x + d[1],
      y: s.empty!.y + d[0],
    };
    // out of bounds
    if (p.x < 0 || p.y < 0 || p.x >= grid[0].length || p.y >= grid.length) {
      continue;
    }
    // no walls
    if (grid[p.y][p.x].fixed) {
      continue;
    }
    next.push({
      empty: p,
      steps: s.steps + 1,
    });
  }
  return next;
}

function step1(empty: Point, target: Point): Step1State {
  let state = {
    empty: empty,
    steps: 0,
  };

  let queue = new MinPriorityQueue<Step1State>({
    priority: (s: Step1State) => {
      return manhattan(s.empty, target) + s.steps!;
    },
  });

  queue.enqueue(state);
  let visited = new Set<string>();
  const key = (p: Point) => `${p.x},${p.y}`;
  while (queue.size() > 0) {
    state = queue.dequeue().element;
    if (manhattan(state.empty, target) == 0) {
      return state;
    }
    visited.add(key(state.empty));
    let next = Step1FindNextStates(state);
    next.forEach((s) => !visited.has(key(s.empty)) && queue.enqueue(s));
  }
  throw new Error("no path found");
}

function Step2FindNextStates(s: Step2State): Step2State[] {
  let next: Step2State[] = [];
  for (let d of directions) {
    let p = {
      x: s.empty.x + d[1],
      y: s.empty.y + d[0],
    };
    // out of bounds
    if (p.x < 0 || p.y < 0 || p.x >= grid[0].length || p.y >= grid.length) {
      continue;
    }
    // no walls
    if (grid[p.y][p.x].fixed) {
      continue;
    }
    // prune anything where the empty tile gets too far from the target
    if (Math.abs(s.target!.x - p.x) > 1 || Math.abs(s.target!.y - p.y) > 1) {
      continue;
    }
    next.push({
      target:
        s.target.x == p.x && s.target.y == p.y
          ? { x: s.empty.x, y: s.empty.y }
          : s.target,
      empty: p,
      steps: s.steps + 1,
    });
  }
  return next;
}

function step2(step1Result: Step1State): Step2State {
  let queue = new MinPriorityQueue<Step2State>({
    priority: (s: Step2State) => {
      return manhattan(s.target, origin) + s.steps;
    },
  });

  let state = {
    ...step1Result,
    target: target,
  };
  queue.enqueue(state);
  let visited = new Set<string>();
  const key = (p: Point[]) =>
    p.reduce((key, point) => (key += `|${point.x}${point.y}`), "");
  while (queue.size() > 0) {
    state = queue.dequeue().element;
    if (manhattan(state.target, origin) == 0) {
      return state;
    }
    visited.add(key([state.empty, state.target]));
    let next = Step2FindNextStates(state);
    next.forEach(
      (s) => !visited.has(key([s.empty, s.target])) && queue.enqueue(s)
    );
  }
  throw new Error("path not found");
}

let grid = parse();
console.log("Part 1:", viablePairs(grid));

annotateFixedNodes(grid);

let { origin, empty, target } = findKeyPoints(grid);
let step1Target = determineStep1EndPoint(grid);

let step1Result = step1(empty, step1Target);
let step2Result = step2(step1Result);

console.log("Part 2:", step2Result.steps);
