import fs from 'fs'
import _ from 'lodash'
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
      let _x2 = x2 >= 0 ? (x2 % R) : (x2 % R + R) % R
      let y2 = loc.y + dy
      let _y2 = y2 >= 0 ? (y2 % C) : (y2 % C + C) % C
      // no walking into rocks
      if (this.map[_x2][_y2] === Garden.rock){
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
        garden.locsAtN.add(JSON.stringify([curLoc.x, curLoc.y]))
      }
      let next = this.nextSteps(curLoc, n)
      queue.push(...next)
    }

    let result = this.locsAtN.size

    console.log('result (', n, '): ', result)
    this.locsAtN = new Set()

    return result
  }

  reset(){
    this.locsAtN = new Set()
  }
}


/*
             | 65| 131 | 131|
F---------------------------7      
|                           |
|    F-----------------7    |
|    |                 |    |
|    |    F-------7    |    |
|    |    |       |    |    |
|    |    |  [x]  |    |    |
|    |    |       |    |    |
|    |    L-------J    |    |
|    |                 |    |
|    L-----------------J    |
|                           |
F---------------------------7
*/

let garden = parse()
let p = performance.now()
// [65, 327, 589

let x = [ 65, 65 + 131, 65 + 131*2]
let f = x.map( steps => garden.walk(steps) )
let fit = regression.polynomial(_.zip(x,f), { order: 2 })
console.log('fit: ', fit.equation, 'r2: ', fit.r2)
let t = (26501365 - 65) / 131
console.log(`predict (${t}): `, fit.predict(t))
console.log(performance.now() - p, ' ms')


/*
f(x) = ax^2 + bx + c
f(0) = c
f(1) = a + b + f(0)
a = b + f(0) - f(1)
f(2) = 4a + 2b + f(0)
f(2) = 4 * (b + f(0) - f(1)) + 2b + f(0)
f(2) = 4b + 4 * f(0) - 4 * f(1) + 2b + f(0)
f(2) = 5 * f(0)  - 4 * f(1) + 6b
1/6 * (f(2) - 5f(0) + 4f(1)) = b

a = f(0) - f(1) + 1/6 * (f(2) - 5f(0) + 4f(1))
b = 1/6 * (f(2) - 5f(0) + 4f(1))
c = f(0)
*/

let c = f[0]
let b = 1/6 * (f[2] - 5 * c + 4 * f[1])
let a = c + b - f[1]

console.log(`${a}x^2 + ${b}x + ${c}`)
console.log(a * t**2 + b * t + c)