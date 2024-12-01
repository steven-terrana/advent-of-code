import input from "./input.txt";
import chalk from "chalk";

let network = input.split("\n").map((line) => Array.from(line));

interface Packet {
  row: number;
  col: number;
  direction: [number, number];
}

let queue: Packet[] = [
  {
    row: 0,
    col: network[0].indexOf("|"),
    direction: [1, 0],
  },
];

const print = (p: Packet) => {
  for (let i = 0; i < network.length; i++) {
    let row = [];
    for (let j = 0; j < network[i].length; j++) {
      if (p.row == i && p.col == j) {
        row.push(chalk.blueBright.bold(network[i][j]));
      } else {
        row.push(chalk.dim(network[i][j]));
      }
    }
    console.log(row.join(""));
  }
};

const inBounds = (r: number, c: number): boolean => {
  return r >= 0 && r < network.length && c >= 0 && c < network[r].length;
};

const nextNode = (p: Packet): Packet | undefined => {
  steps++;
  let row = p.row + p.direction[0];
  let col = p.col + p.direction[1];
  let c = network[row][col];
  if (c == "+") {
    steps++; // we're gonna skip past the "+" so add another step
    if (Math.abs(p.direction[0]) == 1) {
      if (inBounds(row, col + 1) && /[-a-zA-z]/.test(network[row][col + 1])) {
        return {
          row: row,
          col: col + 1,
          direction: [0, 1],
        };
      } else if (
        inBounds(row, col - 1) &&
        /[-a-zA-z]/.test(network[row][col - 1])
      ) {
        return {
          row: row,
          col: col - 1,
          direction: [0, -1],
        };
      } else {
        throw new Error("... idk");
      }
    } else {
      if (inBounds(row + 1, col) && /[|a-zA-z]/.test(network[row + 1][col])) {
        return {
          row: row + 1,
          col: col,
          direction: [1, 0],
        };
      } else if (
        inBounds(row - 1, col) &&
        /[|a-zA-z]/.test(network[row - 1][col])
      ) {
        return {
          row: row - 1,
          col: col,
          direction: [-1, 0],
        };
      } else {
        throw new Error("... idk");
      }
    }
  } else {
    if (!inBounds(row, col) || c == " ") {
      return undefined;
    }
    return {
      row: row,
      col: col,
      direction: p.direction,
    };
  }
};

let encountered: string[] = [];
let steps = 0;
while (queue.length > 0) {
  let packet = queue.shift()!;
  let c = network[packet.row][packet.col];
  if (/[a-zA-Z]/.test(c)) {
    encountered.push(c);
  }
  let next = nextNode(packet);
  if (next) {
    queue.push(next);
  }
}

console.log("Part 1:", encountered.join(""));
console.log("Part 2:", steps);
