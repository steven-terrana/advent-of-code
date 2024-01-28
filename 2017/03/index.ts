export function findSteps(target: number): number {
  let i = 1;
  let r = 0;
  while (i ** 2 < target) {
    i += 2;
    r += 1;
  }
  let x = r;
  let y = r;
  let current = i ** 2;
  let s = 1;
  let sideLength = 2 * r + 1;
  let dirIdx = 0;
  let dirs = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ];
  while (current > target) {
    if (s == sideLength) {
      s = 1;
      dirIdx++;
    }
    x += dirs[dirIdx][0];
    y += dirs[dirIdx][1];
    s++;
    current--;
  }
  return Math.abs(x) + Math.abs(y);
}

function part2(target: number) {
  const pad = (g: number[][]): number[][] => {
    let length = g[0].length;
    let empty = Array(length + 2).fill(0);
    return [empty.slice(), ...g.map((row) => [0, ...row, 0]), empty.slice()];
  };

  const getValue = (g: number[][], r: number, c: number): number => {
    let s = 0;
    let dirs = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    for (let dir of dirs) {
      let nR = r + dir[0];
      let nC = c + dir[1];
      if (nR < 0 || nC < 0 || nR >= g.length || nC >= g[0].length) {
        continue;
      }
      s += g[nR][nC];
    }
    return s;
  };

  const fill = (g: number[][]): number | undefined => {
    // find the bottom right value
    let row = g.findLastIndex((r) => r.some((n) => n != 0));
    let col = g[row].findLastIndex((r) => r != 0) + 1;
    // fill right edge from bottom to top
    for (; row >= 0; row--) {
      let v = getValue(g, row, col);
      if (v > target) {
        return v;
      }
      g[row][col] = v;
    }
    row++;
    col--;

    // fill top edge from right to left
    for (; col >= 0; col--) {
      let v = getValue(g, row, col);
      if (v > target) {
        return v;
      }
      g[row][col] = v;
    }
    col++;
    row++;

    // fill left edge from top to bottom
    for (; row < g.length; row++) {
      let v = getValue(g, row, col);
      if (v > target) {
        return v;
      }
      g[row][col] = v;
    }
    row--;
    col++;

    // fill bottom edge from left to right
    for (; col < g[0].length; col++) {
      let v = getValue(g, row, col);
      if (v > target) {
        return v;
      }
      g[row][col] = v;
    }
    col--;
    return undefined;
  };

  let grid: number[][] = [[1]];
  while (true) {
    grid = pad(grid);
    let result = fill(grid);
    if (result != undefined) {
      return result;
    }
  }
}

if (import.meta.main == true) {
  console.log("Part 1:", findSteps(347991));
  console.log("Part 2:", part2(347991));
}
