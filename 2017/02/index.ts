import input from "./input.txt";

function parse(): number[][] {
  let parsed: number[][] = [];
  for (let line of input.split("\n")) {
    let numbers = line.split(/\s+/).map((n) => parseInt(n));
    parsed.push(numbers);
  }
  return parsed;
}

function checksum(input: number[][]): number {
  let diffs = input.map((n) => Math.max(...n) - Math.min(...n));
  return diffs.reduce((sum, diff) => sum + diff, 0);
}

function part2(input: number[][]): number {
  let results: number[] = [];
  for (let numbers of input) {
    result: for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        let a = numbers[j];
        let b = numbers[i];
        if (a % b == 0) {
          results.push(Math.floor(a / b));
          break result;
        }
        if (b % a == 0) {
          results.push(Math.floor(b / a));
          break result;
        }
      }
    }
  }
  return results.reduce((sum, result) => sum + result, 0);
}

let parsed = parse();
console.log("Part 1:", checksum(parsed));
console.log("Part 2:", part2(parsed));
