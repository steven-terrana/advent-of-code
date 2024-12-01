import fs from 'fs'
import _ from 'lodash'

let file
[file] = process.argv.slice(2)
file = file ?? 'test.txt'
let lines = fs.readFileSync(file, 'utf-8').split('\n')

const directions = {
  3: [ 0, -1],
  1: [ 0,  1],
  2: [-1,  0],
  0: [ 1,  0]
}

let perimeter = 0
let x,y
x=0
y=0
let polygon = []

for(let i = 0; i < lines.length; i++){
  let hex = lines[i].match(/(?<=#).*[^)]/)[0]
  let m = Number('0x' + hex.slice(0, hex.length-1))
  let d = Number('0x' + hex.slice(hex.length-1))

  perimeter += m
  x = x + m * directions[d][0]
  y = y + m * directions[d][1]
  polygon.push([x, y])
}

// given it the trench is a closed loop
// we know it's a polygon, and we know the
// vertices in clockwise order, so we can 
// use the shoelace formula: 
// https://en.wikipedia.org/wiki/Shoelace_formula
let sum = perimeter
for (let i = 0; i < polygon.length - 1; i++) {
  sum += polygon[i][0] * polygon[i+1][1] - polygon[i+1][0] * polygon[i][1];
}
console.log(Math.floor(sum / 2) + 1);