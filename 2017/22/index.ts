import input from "./input.txt";

type Shift = -1 | 0 | 1;
interface Direction {
  move: [Shift, Shift];
  left: () => Direction;
  right: () => Direction;
  reverse: () => Direction;
}

/*
      UP
  LEFT  RIGHT
     DOWN
*/
const Directions: Record<string, Direction> = {
  UP: {
    move: [-1, 0],
    left: () => Directions.LEFT,
    right: () => Directions.RIGHT,
    reverse: () => Directions.DOWN,
  },
  DOWN: {
    move: [1, 0],
    left: () => Directions.RIGHT,
    right: () => Directions.LEFT,
    reverse: () => Directions.UP,
  },
  LEFT: {
    move: [0, -1],
    left: () => Directions.DOWN,
    right: () => Directions.UP,
    reverse: () => Directions.RIGHT,
  },
  RIGHT: {
    move: [0, 1],
    left: () => Directions.UP,
    right: () => Directions.DOWN,
    reverse: () => Directions.LEFT,
  },
};

interface Node {
  position: [number, number];
  direction: Direction;
}

function parse(): { infected: Set<string>; node: Node } {
  let map = input
    .split("\n")
    .map((line: string) => Array.from(line))
    .map((row: string[]) => row.map((char) => char == "#"));

  let infected = new Set<string>();

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j]) {
        infected.add(JSON.stringify([i, j]));
      }
    }
  }

  let coordinate = (map.length - 1) / 2;
  let node: Node = {
    direction: Directions.UP,
    position: [coordinate, coordinate],
  };

  return { infected, node };
}

function part1() {
  let { infected, node } = parse();
  let part1 = 0;
  for (let burst = 0; burst < 10000; burst++) {
    let pos = JSON.stringify(node.position);
    if (infected.has(pos)) {
      node.direction = node.direction.right();
      infected.delete(pos);
    } else {
      node.direction = node.direction.left();
      infected.add(pos);
      part1++;
    }
    node.position = [
      node.position[0] + node.direction.move[0],
      node.position[1] + node.direction.move[1],
    ];
  }

  console.log("Part 1:", part1);
}

function part2() {
  let { infected, node } = parse();
  let weakened = new Set<string>();
  let flagged = new Set<string>();
  let part2 = 0;
  for (let burst = 0; burst < 10000000; burst++) {
    let pos = JSON.stringify(node.position);
    if (infected.has(pos)) {
      node.direction = node.direction.right();
      infected.delete(pos);
      flagged.add(pos);
    } else if (weakened.has(pos)) {
      weakened.delete(pos);
      infected.add(pos);
      part2++;
    } else if (flagged.has(pos)) {
      node.direction = node.direction.reverse();
      flagged.delete(pos);
    } else {
      node.direction = node.direction.left();
      weakened.add(pos);
    }
    node.position = [
      node.position[0] + node.direction.move[0],
      node.position[1] + node.direction.move[1],
    ];
  }

  console.log("Part 2:", part2);
}

part1();
part2();
