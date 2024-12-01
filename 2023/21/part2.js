import fs from 'fs'
import regression from 'regression'

function parse(input = undefined){
  let lines
  if (input == undefined){
    let file
    [file] = process.argv.slice(2)
    file = file ?? 'test.txt'
    lines = fs.readFileSync(file, 'utf-8').split("\n")
  } else {
    lines = input.split('\n')
  }

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
  items = new Set()
  length = 0
  push(...args){
    for (let a of args){
      this.items.add(JSON.stringify(a))
    }
    this.length = this.items.size
  }
  shift(){
    let item = this.items.values().next().value
    this.items.delete(item)
    this.length = this.items.size
    return JSON.parse(item)
  }
}

class Garden{
  static rock = '#'
  constructor(map, starting_position){
    this.map = map
    this.starting_position = starting_position
    this.locsAtN = new Set()
    this.visited = new Set()
  }

  get(x,y){
    let R = this.map.length
    let C = this.map[0].length
    let _x = x >= 0 ? (x % R) : (x % R + R) % R
    let _y = y >= 0 ? (y % C) : (y % C + C) % C
    return this.map[_x][_y]
  }

  // finds the next available steps based on
  nextSteps(loc, n){
    let directions = [ [0, 1], [0, -1], [1, 0], [-1, 0] ]
    let nextSteps = []
    for (let d of directions){
      let dx, dy
      [dx,dy] = d
      let x2 = loc.x + dx
      let y2 = loc.y + dy
      // no walking into rocks
      if (this.get(x2,y2) === Garden.rock){
        continue
      }
      // if we have already determined we can end here
      // we don't need to come back
      if (this.locsAtN.has(JSON.stringify([x2,y2]))){
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
        this.locsAtN.add(JSON.stringify([curLoc.x, curLoc.y]))
      }
      let next = this.nextSteps(curLoc, n)
      queue.push(...next)
    }

    let total = this.locsAtN.size
    this.locsAtN = new Set()
    return total
  }
}

let garden = parse()


let steps = (N) => 65 + N * 131
let points = []
Array.from([1, 2, 3]).forEach( N => {
  points.push([N, garden.walk(steps(N))])
})


let model = regression.polynomial(points, {order: 2})

let N = (26501365 - 65) / 131
console.log('Part 2:', model.predict(N)[1])