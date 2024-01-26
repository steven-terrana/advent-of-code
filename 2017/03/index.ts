export function findSteps(target: number): number {
  let i = 1;
  let r = 0;
  while (i ** 2 < target) {
    i += 2;
    r += 1;
  }

  let x = r;
  let y = r;
  let sideLength = 2 * r + 1;

  let current = i ** 2;
  let offset = 0;
  while (current != target) {
    if (Math.floor(offset / sideLength) == 0) {
      x--;
    }
    if (Math.floor(offset / sideLength) == 1) {
      y--;
    }
    if (Math.floor(offset / sideLength) == 2) {
      x++;
    }
    if (Math.floor(offset / sideLength) == 3) {
      y++;
    }
    offset++;
    current--;
  }
  return Math.abs(x) + Math.abs(y);
}
