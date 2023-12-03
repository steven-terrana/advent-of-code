import fs from 'fs'
import chalk from 'chalk'

/*
  Approach:
  we solve this problem through axis aligned bounding boxes (aabb).

  we will create Thing instances for each .. thing.. in the 
  engine schematic (be it a number or a symbol). These things will
  have bounding boxes associated with them that we'll use to assess
  proximity (collision) with other... things.
  
  symbols will have a margin of 0 for their bounding 
  box whereas numbers will have a margin of 1. 

  for each number thing, we will iterate over the Things that are
  a symbol and check if they intersect with the number's bounding box.

  If they do, we know this number is an engine part so we'll add it
  to the running sum.
*/

const schematic = fs.readFileSync('input.txt', 'utf-8')
const parser = new RegExp(/(?<number>\d+)|(?<symbol>[^\d\.\n])/gm)


const Types = Object.freeze({
  number: Symbol("number"),
  symbol: Symbol("symbol")
})

class Thing {
  constructor(type, value, aabb){
    this.type = type
    this.value = value
    this.aabb = aabb
  }
}

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
// bounding boxes in color
function prettyPrint(schematic, a, b){
  let y = 0
  for (const r of schematic.split('\n')){
    let row = r.split('').map( (c, x) => {
      if ( a.aabb.min_x <= x && x <= a.aabb.max_x && a.aabb.min_y <= y && y <= a.aabb.max_y){
        return chalk.bgBlue(c)
      }
      if ( b.aabb.min_x <= x && x <= b.aabb.max_x && b.aabb.min_y <= y && y <= b.aabb.max_y){
        return chalk.bgRed(c)
      } else {
        return c
      }
    }).join('')
    console.log(row)
    y += 1
  }
}

let things = []
schematic.split('\n').forEach( (line, row) => {
  Array.from(line.matchAll(parser)).forEach( match => {
    let value = match[0]
    if (match.groups?.number) {
      // for part 1: numbers have a margin of 1 for the bounding box
      let aabb = new AABB(row - 1, row + 1, match.index - 1, match.index + value.length)
      things.push(new Thing(Types.number, Number(value), aabb))
    }
    if (match.groups?.symbol) {
      // for part 1: symbols have no margin for the bounding box
      let aabb = new AABB(row, row, match.index, match.index)
      things.push(new Thing(Types.symbol, value, aabb))
    }
  })
})

let numbers = things.filter( t => t.type === Types.number )
let symbols = things.filter( t => t.type === Types.symbol )

let sum = 0
for (const n of numbers){
  for (const s of symbols){
    if(n.aabb.intersects(s.aabb)){
      console.log('The following parts intersect', n, s)
      sum += n.value
      break
    }
  }
}
console.log("Part 1: ", sum)

