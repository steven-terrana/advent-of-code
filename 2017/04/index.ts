import input from "./input.txt";

let part1 = 0;
let part2 = 0;
for (let line of input.split("\n")) {
  let words = line.split(" ");

  // dedupe with a Set and if the lengths
  // match then each word was unique
  let unique = new Set(words);
  if (words.length == unique.size) {
    part1++;
  }

  // two words can be rearranged to be equal
  // if when you sort their characters alphabetically
  // you end up with the same string
  let sorted = words.map((w) => Array.from(w).sort().join(""));
  let sortedUnique = new Set(sorted);
  if (sorted.length == sortedUnique.size) {
    part2++;
  }
}

console.log("Part 1:", part1);
console.log("Part 2:", part2);
