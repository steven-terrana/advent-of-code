type Direction = "L" | "R";
interface Instruction {
  direction: Direction
  steps: number;
}

const input = await Bun.file("input.txt").text();
const lines = input.split("\n");
const instructions: Instruction[] = lines.map((line) => {
  const direction = line[0] as Direction
  const steps = parseInt(line.slice(1));
  return { direction, steps };
});


function turn(dialPosition: number, instruction: Instruction){
  let zeros = 0

  const full_turns = Math.floor(instruction.steps / 100);
  let remainder = instruction.steps % 100;
  if (instruction.direction == "L"){
    remainder *= -1
  }
  zeros += full_turns;

  let new_position = dialPosition + remainder

  if (new_position == 0){
    zeros += 1
  } else if (new_position > 99){
    zeros += 1
    new_position -= 100
  } else if (new_position < 0) {
    if (dialPosition == 0){
      zeros -= 1
    }
    zeros += 1
    new_position += 100
  }

  return {zeros, new_position}
};

let endZeros = 0;
let totalZeros = 0;
let dialPosition = 50;
for (let i of instructions){
  const {zeros, new_position} = turn(dialPosition, i)
  totalZeros += zeros
  dialPosition = new_position
  if (dialPosition == 0){
    endZeros += 1
  }
}

console.log(`part 1: ${endZeros}`)
console.log(`part 2: ${totalZeros}`)