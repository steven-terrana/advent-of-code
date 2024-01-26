import operations from "./input.txt";

// swap position X with position Y means that the letters at indexes X and Y (counting from 0) should be swapped.
// inverse is the same function with the x and y parameters swapped
const swapPosition = (s: string, x: number, y: number): string => {
  let copy = Array.from(s);
  let tmp = copy[x];
  copy[x] = copy[y];
  copy[y] = tmp;
  return copy.join("");
};

// swap letter X with letter Y means that the letters X and Y should be swapped (regardless of where they appear in the string).
// inverse is the same function with the x and y parameteres reversed
const swapLetter = (s: string, x: string, y: string): string => {
  let copy = Array.from(s);
  return copy
    .map((c) => {
      if (c == x) {
        return y;
      } else if (c == y) {
        return x;
      } else {
        return c;
      }
    })
    .join("");
};

// rotate left/right X steps means that the whole string should be rotated; for example, one right rotation would turn abcd into dabc.
// inverse is the same function with the right parameter inverted
const rotate = (s: string, right: boolean, x: number): string => {
  let copy = Array.from(s);
  for (let i = 0; i < x; i++) {
    if (right) {
      copy.unshift(copy.pop()!);
    } else {
      copy.push(copy.shift()!);
    }
  }
  return copy.join("");
};

// rotate based on position of letter X means that the whole string should be rotated to the right based on the index of letter X (counting from 0) as determined before this instruction does any rotations.
// Once the index is determined rotate the string to the right one time plus a number of times equal to that index, plus one additional time if the index was at least 4.
const rotateRelative = (s: string, letter: string): string => {
  let index = s.indexOf(letter);
  let steps = 1 + index + (index >= 4 ? 1 : 0);
  return rotate(s, true, steps);
};

/*
  start index -> steps -> end index
  so inverting just needs a map of
  end index to reverse steps to take
  0 -> 1 + 0 + 0 = 1 -> 1 
  1 -> 1 + 1 + 0 = 2 -> 3
  2 -> 1 + 2 + 0 = 3 -> 5
  3 -> 1 + 3 + 0 = 4 -> 7
  4 -> 1 + 4 + 1 = 6 -> 2
  5 -> 1 + 5 + 1 = 7 -> 4
  6 -> 1 + 6 + 1 = 8 -> 6
  7 -> 1 + 7 + 1 = 9 -> 0
*/
const inverseRotateRelative = (s: string, letter: string): string => {
  const inverter = new Map<number, number>([
    [1, 1],
    [3, 2],
    [5, 3],
    [7, 4],
    [2, 6],
    [4, 7],
    [6, 8],
    [0, 9],
  ]);

  let index = s.indexOf(letter);
  return rotate(s, false, inverter.get(index)!);
};

// reverse positions X through Y means that the span of letters at indexes X through Y (including the letters at X and Y) should be reversed in order.
// inverse is the same function with the same arguments
const substringReverse = (s: string, x: number, y: number): string => {
  let copy = Array.from(s);
  return [
    ...copy.slice(0, x),
    ...copy.slice(x, y + 1).reverse(),
    ...copy.slice(y + 1),
  ].join("");
};

// move position X to position Y means that the letter which is at index X should be removed from the string, then inserted such that it ends up at index Y.
// inverse is the same function with x and y parameters swapped
const move = (s: string, x: number, y: number): string => {
  let copy = Array.from(s);
  let letter = copy[x];
  copy.splice(x, 1);
  if (y >= copy.length) {
    copy.push(letter);
  } else {
    copy = copy.map((c, i) => (i == y ? letter + c : c));
  }
  return copy.join("");
};

function scramble(original: string, operations: string): string {
  let s = original;
  for (let line of operations.split("\n")) {
    let parts = line.split(" ");
    if (parts[0] == "rotate") {
      if (parts[1] == "right") {
        let steps = parseInt(parts[2]);
        s = rotate(s, true, steps);
      } else if (parts[1] == "left") {
        let steps = parseInt(parts[2]);
        s = rotate(s, false, steps);
      } else if (parts[1] == "based") {
        let letter = parts[6];
        s = rotateRelative(s, letter);
      }
    } else if (parts[0] == "swap") {
      if (parts[1] == "letter") {
        let x = parts[2];
        let y = parts[5];
        s = swapLetter(s, x, y);
      } else if (parts[1] == "position") {
        let x = parseInt(parts[2]);
        let y = parseInt(parts[5]);
        s = swapPosition(s, x, y);
      }
    } else if (parts[0] == "reverse") {
      let x = parseInt(parts[2]);
      let y = parseInt(parts[4]);
      s = substringReverse(s, x, y);
    } else if (parts[0] == "move") {
      let x = parseInt(parts[2]);
      let y = parseInt(parts[5]);
      s = move(s, x, y);
    }
  }
  return s;
}

function unscramble(original: string, operations: string): string {
  let s = original;
  let ops = operations.split("\n").reverse();
  for (let line of ops) {
    let parts = line.split(" ");
    if (parts[0] == "rotate") {
      if (parts[1] == "right") {
        let steps = parseInt(parts[2]);
        s = rotate(s, false, steps);
      } else if (parts[1] == "left") {
        let steps = parseInt(parts[2]);
        s = rotate(s, true, steps);
      } else if (parts[1] == "based") {
        let letter = parts[6];
        s = inverseRotateRelative(s, letter);
      }
    } else if (parts[0] == "swap") {
      if (parts[1] == "letter") {
        let x = parts[2];
        let y = parts[5];
        s = swapLetter(s, y, x);
      } else if (parts[1] == "position") {
        let x = parseInt(parts[2]);
        let y = parseInt(parts[5]);
        s = swapPosition(s, y, x);
      }
    } else if (parts[0] == "reverse") {
      let x = parseInt(parts[2]);
      let y = parseInt(parts[4]);
      s = substringReverse(s, x, y);
    } else if (parts[0] == "move") {
      let x = parseInt(parts[2]);
      let y = parseInt(parts[5]);
      s = move(s, y, x);
    }
  }
  return s;
}

let _scrambled = scramble("abcdefgh", operations);
console.log("Part 1:", _scrambled);
console.log("Part 2:", unscramble("fbgdceah", operations));
