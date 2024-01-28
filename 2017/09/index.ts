import stream from "./input.txt";

interface Group {
  score: number;
  char: string;
}

function getScore(groups: Group[]) {
  return groups.map((g) => g.score).reduce((score, s) => score + s, 0);
}

let stack: string[][] = [];
let groups: Group[] = [];

for (let i = 0; i < stream.length; i++) {
  let c = stream[i];
  if (c == "<") {
    stack.push([]);
    let d = stream[i];
    while (d != ">") {
      i++;
      d = stream[i];
      if (d == ">") {
        groups.push({
          score: 0,
          char: stack.pop()!.join(""),
        });
        break;
      } else if (d == "!") {
        i++;
      } else {
        stack[stack.length - 1].push(d);
      }
    }
  } else if (c == "{") {
    stack.push(["{"]);
  } else if (c == "}") {
    stack[stack.length - 1].push("}");
    groups.push({
      score: stack.length,
      char: stack.pop()!.join(""),
    });
  } else if (c == "!") {
    stack[stack.length - 1].push(stream[i + 1]);
    i++;
  } else {
    stack[stack.length - 1].push(c);
  }
}

console.log("Part 1:", getScore(groups));

let garbage = groups.filter((g) => g.score == 0);
let part2 = garbage.reduce((sum, g) => sum + g.char.length, 0);

console.log("Part 2:", part2);
