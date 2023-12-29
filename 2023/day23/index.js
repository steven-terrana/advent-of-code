import fs from 'fs' 
import chalk from 'chalk'

function parse(){
  let file
  [file] = process.argv.slice(2)
  file = file ?? 'test.txt'
  return fs.readFileSync(file, 'utf-8').split('\n').map (l => Array.from(l))
}

function printMap(map, here){
  console.log('='.repeat(map[0].length))
  let path = getPath(here).map(n => JSON.stringify(n.location))
  for (let i = 0; i < map.length; i++){
    let row = []
    for (let j = 0; j < map[0].length; j++){
      let color, c
      if (path.includes(JSON.stringify([i,j]))){
        c = 'O'
        color = chalk.blueBright
      } else if (here.location[0] == i && here.location[1] == j){
        c = 'O'
        color = chalk.redBright
      } else if (map[i][j] == '#'){
        c = '#'
        color = chalk.greenBright
      } else if (map[i][j] == '.'){
        c = '.'
        color = chalk.white.dim
      } else if (['<','>','^','v'].includes(map[i][j])){
        c = map[i][j]
        color = chalk.yellow.dim
      }
      row.push(color(c))
    }
    console.log(row.join(''))  
  }
  console.log('='.repeat(map[0].length))
}

function getPath(node){
  let path = [node]
  let n = node
  while (n.previous){
    path.push(n.previous)
    n = n.previous
  }
  path.reverse()
  return path
}

function beenHere(here, neighbor){
  return getPath(here).map( n => JSON.stringify(n.location)).includes(JSON.stringify(neighbor.location))
}

function getNextSteps(here){
  const directions = {
    '>': [ 0,  1],
    '<': [ 0, -1],
    '^': [-1,  0],
    'v': [ 1,  0]
  }

  const getTile  = (loc)  => { return map[loc.location[0]]?.[loc.location[1]] }
  const isSlope  = (loc)  => { return Object.keys(directions).includes(getTile(loc)) }
  const isForest = (loc)  => { return getTile(loc) === '#' }

  let dirs = Object.values(directions)
  // if (isSlope(here)){
  //   dirs = [ directions[getTile(here)] ]
  // }
  
  let nextSteps = []
  for (let d of dirs){
    let neighbor = {
      location: [
        here.location[0] + d[0],
        here.location[1] + d[1]
      ],
      steps: here.steps + 1, 
      previous: here
    }
    // no forests, no off grid, no backtracking
    if (isForest(neighbor) || !getTile(neighbor) || beenHere(here, neighbor)){
      continue
    }
    nextSteps.push(neighbor)
  }

  return nextSteps
}

// this queue will only keep
// next step items that represent
// the longest path to get to that location
class Queue extends Map {
  push(...items){
    for (let item of items){
      let key = JSON.stringify(item.location)
      let existing = this.get(key)
      if (!existing || existing[0] < item.steps){
        this.set(key, [item.steps, item.previous])
      }
    }
  }
  shift(){
    let key = this.keys().next().value
    let steps, previous
    [steps, previous] = this.get(key)
    let item = {
      location: JSON.parse(key),
      steps: steps, 
      previous: previous
    }
    this.delete(key)
    return item
  }
}


function findTrail(map, start, end){
  let queue = new Queue()
  queue.push({location: start, steps: 0, previous: undefined})

  let maxLength = 0
  while(queue.size > 0){
    let here = queue.shift()
    // printMap(map, here)
    if(JSON.stringify(end) == JSON.stringify(here.location)){
      maxLength = Math.max(maxLength, getPath(here).length)
    }
    queue.push(...getNextSteps(here))
  }
  return maxLength - 1
}

let map = parse()
let start = [0, map[0].indexOf('.')]
let end = [map.length-1, map[map.length-1].indexOf('.')]

let length = findTrail(map, start, end)

console.log('Part 1:', length)