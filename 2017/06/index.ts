let blocks = [11, 11, 13, 7, 0, 15, 5, 5, 4, 4, 1, 1, 7, 1, 15, 11];
let seen = new Set<string>();

let part1;
let part2 = 0;
let key;

while (true) {
  let k = JSON.stringify(blocks);
  if (key != undefined) {
    part2++;
    if (key == k) {
      break;
    }
  }
  if (seen.has(k) && part1 == undefined) {
    part1 = seen.size;
    console.log("key is", k);
    key = k;
  }
  seen.add(k);
  let max = Math.max(...blocks);
  let idx = blocks.indexOf(max);
  blocks[idx++] = 0;
  for (let i = 0; i < max; i++) {
    blocks[(idx + i) % blocks.length]++;
  }
}

console.log("Part 1:", part1);
console.log("Part 2:", part2);
