let buffer = [0];
let currentPosition = 0;
let step = 354;
for (let i = 1; i <= 2017; i++) {
  let idx = (currentPosition + step) % buffer.length;
  buffer.splice(idx + 1, 0, i);
  currentPosition = idx + 1;
}

let a = buffer.indexOf(2017);
console.log("Part 1:", buffer[a + 1]);

// for part two, we don't actually _need_ a buffer
// we just need to keep track of the number that
// would be inserted next to zero. so we can simulate
// the spinlock by incrementing the buffer length,
// updating the index of zero if an insertion would
// happen to the left of zero, and updating the neighbor
// if the current position lands on zero.
let zeroIndex = buffer.indexOf(0);
let zeroNeighbor = buffer[zeroIndex + 1];
let bufferLength = buffer.length;

for (let i = 2018; i <= 50e6; i++) {
  let idx = (currentPosition + step) % bufferLength++;
  currentPosition = idx + 1;
  if (idx == zeroIndex) zeroNeighbor = i;
  if (idx < zeroIndex) zeroIndex++;
}

console.log("Part 2:", zeroNeighbor);
