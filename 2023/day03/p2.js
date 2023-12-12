import fs from 'fs'
import chalk from 'chalk'

/*
  Approach:
  we solve this problem through axis aligned bounding boxes (aabb).

  we will create Thing instances for each .. thing.. in the 
  engine schematic (be it a number or a symbol). These things will
  have bounding boxes associated with them that we'll use to assess
  proximity (collision) with other... things.
  
  symbols will have a margin of 1 for their bounding 
  box whereas numbers will have a margin of 0. 

  for each * symbol thing, we will iterate over the Things that are
  a number and check if they intersect with a given * symbol's bounding 
  box. If they do, we'll store it. 

  We can then check how many numbers have collided with the * symbol and
  if it's two, multiple their values together and add it to the running sum.
*/


// there are going to be two types of Things... numbers and symbols
// we are going to use this to filter Things later.
const Types = Object.freeze({
  number: Symbol("number"),
  symbol: Symbol("symbol")
})

// an object represented on the Engine Schematic. We'll store the
// type of thing it is, its value, and an AABB (hitbox..) for the thing
class Thing {
  constructor(type, value, aabb){
    this.type = type
    this.value = value
    this.aabb = aabb
  }
}

// an axis-aligned bounding box (..rectangle in a 2D array)
// see: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
class AABB {
  constructor(min_y, max_y, min_x, max_x){
    this.min_y = min_y
    this.max_y = max_y
    this.min_x = min_x
    this.max_x = max_x
  }
  intersects (b) {
    let a = this
    let bIsRightOf = b.min_x > a.max_x
    let bIsLeftOf = b.max_x < a.min_x
    let bIsAbove = b.max_y < a.min_y
    let bIsBelow = b.min_y > a.max_y
    return !(bIsRightOf || bIsLeftOf  || bIsAbove || bIsBelow)
  }
}

// prints out two things a, b and displays their
// bounding boxes in color. This was used for
// debugging.
function prettyPrint(schematic, a, b){
  let y = 0
  for (const r of schematic.split('\n')){
    let row = r.split('').map( (c, x) => {
      let inA = false
      let inB = false
      var result = c
      if ( a.aabb.min_x <= x && x <= a.aabb.max_x && a.aabb.min_y <= y && y <= a.aabb.max_y){
        result = chalk.bgBlue(c)
        inA = true
      }
      if ( b.aabb.min_x <= x && x <= b.aabb.max_x && b.aabb.min_y <= y && y <= b.aabb.max_y){
        result =  chalk.bgRed(c)
        inB = true
      }
      if ( inA && inB ){
        result = chalk.bgGreen(c)
      }
      return result
    }).join('')
    console.log(row)
    y += 1
  }
  console.log('----------------------')
}

// We're going to iterate over the engine schematic and construct 
// all the.... Things
const schematic = fs.readFileSync('test.txt', 'utf-8')
const parser = new RegExp(/(?<number>\d+)|(?<symbol>[^\d\.\n])/gm)

let things = []
schematic.split('\n').forEach( (line, row) => {
  Array.from(line.matchAll(parser)).forEach( match => {
    let value = match[0]
    if (match.groups?.number) {
      // for part 2: numbers have no margin for the bounding box
      let aabb = new AABB(row, row, match.index, match.index + value.length-1)
      things.push(new Thing(Types.number, Number(value), aabb))
    }
    if (match.groups?.symbol) {
      // for part 2: symbols have a margin of 1 for the bounding box
      let aabb = new AABB(row - 1, row + 1, match.index - 1, match.index + value.length)
      things.push(new Thing(Types.symbol, value, aabb))
    }
  })
})

// now let's check for which numbers intersect with the * symbols
// and add them up (if the number of intersecting numbers is 2)
let numbers = things.filter( t => t.type === Types.number )
let stars = things.filter( t => t.value === '*' )

let sum = 0
for (const s of stars){
  let collisions = []
  for (const n of numbers){
    prettyPrint(schematic, n, s)
    if (s.aabb.intersects(n.aabb)){
      collisions.push(n)
    }
  }
  if (collisions.length == 2){
    sum += collisions[0].value * collisions[1].value
  }
}

console.log("Part 2: ", sum)

