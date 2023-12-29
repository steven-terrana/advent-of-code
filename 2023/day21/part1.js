import fs from 'fs'
import chalk from 'chalk'

function parse(){
  let file
  [file] = process.argv.slice(2)
  file = file ?? 'test.txt'  

  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  let map = lines.map( l => l.split(''))
  for(var i = 0; i < lines.length; i++){
    let line = lines[i]
    let S = line.indexOf('S')
    if (S >= 0){
      return new Garden(map, [i, S])
    }
  }
}

// a queue that does not
// allow for duplicated elements
class Queue{
  items = []
  length = 0
  push(...args){
    for (let a of args){
      this.items.push(JSON.stringify(a))
    }
    this.items = Array.from(new Set(this.items))
    this.length = this.items.length
  }
  shift(){
    let item = this.items.shift()
    return JSON.parse(item)
  }
}

class Garden{
  static rock = '#'
  constructor(map, starting_position){
    this.map = map
    this.starting_position = starting_position
    this.locsAtN = new Set()
  }

  // finds the next available steps based on
  nextSteps(loc, n){
    let directions = [ [0, 1], [0, -1], [1, 0], [-1, 0] ]
    let R = this.map.length
    let C = this.map[0].length
    let nextSteps = []
    for (let d of directions){
      let dx, dy
      [dx,dy] = d
      let x2 = loc.x + dx
      let y2 = loc.y + dy
      // stay within the garden
      if (x2 < 0 || x2 > R-1 || y2 < 0 || y2 > C -1){
        continue
      }
      // no walking into rocks
      if (this.map[x2][y2] === Garden.rock){
        continue
      }
      // if we have already determined we can end here
      // we don't need to come back
      if (this.locsAtN.has([x2,y2].toString())){
        continue
      }
      // make sure we're staying within the max steps
      if (loc.n + 1 > n){
        continue
      }
      nextSteps.push({
        x: x2,
        y: y2, 
        n: loc.n + 1
      })
    }
    return nextSteps
  }

  walk(n){
    let queue = new Queue()
    
    queue.push({
      x: this.starting_position[0],
      y: this.starting_position[1],
      n: 0
    })

    /*
      to reduce the search space, we know we'll eventually
      be able to stop on a given spot if we reach the 
      spot with an even number of steps remaining
    */
    const canEndHere = (N) => !Boolean((N-n) % 2)
    while (queue.length > 0){
      let curLoc = queue.shift()
      if (canEndHere(curLoc.n)){
        garden.locsAtN.add([curLoc.x, curLoc.y].toString())
      }
      let next = this.nextSteps(curLoc, n)
      queue.push(...next)
    }

    return this.locsAtN.size
  }

}

let garden = parse()
// this is going to set garden.locsAtN to 
// the locations that possible after N steps
let p = performance.now()
let patches = garden.walk(64)
console.log(performance.now() - p, ' ms')
console.log('Part 1:', patches)