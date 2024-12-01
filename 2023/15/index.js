import fs from 'fs'
import _ from 'lodash'

/*
  1. Determine the ASCII code for the current character of the string.
  2. Increase the current value by the ASCII code you just determined.
  3. Set the current value to itself multiplied by 17.
  4. Set the current value to the remainder of dividing itself by 256.
*/
function hash(input){
  return Array.from(input).reduce( (current_value, c) => {
    current_value += c.charCodeAt(0)
    current_value *= 17
    current_value = current_value % 256
    return current_value
  }, 0)
}

let initialization_sequence = fs.readFileSync('input.txt', 'utf-8').split(',')
let sum = initialization_sequence.reduce( (sum, step) => sum + hash(step), 0)
console.log('Part 1: ', sum)

function print(label, boxes){
  console.log(`After "${label}":`)
  for(let i = 0; i < boxes.length; i++){
    if(boxes[i].length > 0){
      console.log(`Box ${i}: `, boxes[i])
    }
  }
  console.log('')
}

let boxes = Array(256).fill([])

for(let step of initialization_sequence){
  /*
    If the operation character is a dash (-), go to the relevant
    box and remove the lens with the given label if it is present
    in the box. Then, move any remaining lenses as far forward in
    the box as they can go without changing their order, filling 
    any space made by removing the indicated lens. (If no lens in 
    that box has the given label, nothing happens.)
  */
  if(step.includes('-')){
    let label = _.dropRight(step).join('')
    let box = hash(label)
    boxes[box] = _.remove(boxes[box], v => v[0] != label)
  }

  /*
    - If there is already a lens in the box with the same label, 
      replace the old lens with the new lens: remove the old lens
      and put the new lens in its place, not moving any other lenses
      in the box.
    - If there is not already a lens in the box with the same label, 
      add the lens to the box immediately behind any lenses already in 
      the box. Don't move any of the other lenses when you do this. If
      there aren't any lenses in the box, the new lens goes all the way
      to the front of the box.
  */
  if(step.includes('=')){
    let label, focal_length, box
    [label, focal_length] = step.split('=')
    box = hash(label)

    let idx = _.findIndex(boxes[box], (o) => o[0] == label)
    if (idx >= 0){
      boxes[box][idx][1] = focal_length
    } else {
      boxes[box] = [...boxes[box], [label, focal_length]]
    }
  } 
}

function calculateFocusingPower(boxes){
  let focusing_power = 0
  for(let i = 0; i < boxes.length; i++){
    for(let j = 0; j < boxes[i].length; j++){
      focusing_power += (i+1) * (j+1) * boxes[i][j][1]
    }
  }
  return focusing_power
}

console.log('Part 2: ', calculateFocusingPower(boxes))