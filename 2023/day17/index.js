import fs from 'fs'
import chalk from 'chalk'
import { PriorityQueue} from '@datastructures-js/priority-queue'
import _ from 'lodash'


// get some parsing out of the way
let file
[file] = process.argv.slice(2)
file = file ?? 'test.txt'
let lines = fs.readFileSync(file, 'utf-8').split('\n')
let grid = lines.map( line => line.split('').map(n => parseInt(n)))

// represents a node and its state
class Node{
  constructor({x, y, dir, stepsInDir}){
    this.x = x
    this.y = y
    this.dir = dir
    this.stepsInDir = stepsInDir
    this.key = `${x},${y},${dir},${stepsInDir}`
  }
}

function calculateHeatLoss(grid, path){
  let sum = 0;
  for (let i = 1; i < path.length; i++){
    let node = path[i]
    sum += grid[node.x][node.y]
  }
  return sum
}

// reconstruct the path from start to end
function reconstructPath(cameFrom, current){
  let path = [ current ]
  while(cameFrom.has(current.key)){
    current = cameFrom.get(current.key)
    path.push(current)
  }
  path.reverse()
  return path
}

function printPath(grid, path){
  let msg = []
  for (let i = 0; i < grid.length; i++){
    let row = []
    for (let j = 0; j < grid[0].length; j++){
      let c
      if (_.some(path, p => _.isEqual([p.x, p.y], [i,j]))){
        c = chalk.redBright(grid[i][j])
      } else  { // else
        c = chalk.white.dim(grid[i][j])
      }
      row.push(c)
    }
    msg.push(row.join(''))
  }
  // fs.writeFileSync('grid-path.txt', msg.join('\n'))
  console.log(msg.join('\n'))
}

// a custom Map that allows for a default value
// to be returned if a key is not found
class DefaultValueMap extends Map {
  constructor(d){
    super()
    this.d = d
  }
  get(...args){
    return super.get(...args) ?? this.d  
  }
}

// see: https://en.wikipedia.org/wiki/A*_search_algorithm
// many comments below come from the psuedocode described
// A* finds a path from start to goal.
// behavior is an object containing functions
// to tune the business logic
function aStar(grid, start, end, behavior){
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // This is usually implemented as a min-heap or priority queue rather than a hash-set.
  let openSet = new PriorityQueue( (a,b) => fScore.get(a.key) - fScore.get(b.key)) 
  let n = new Node({
    x: start[0],
    y: start[1],
    dir: [0,0],
    stepsInDir: 0
  })
  openSet.push(n)

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
  // to n currently known.
  let cameFrom = new Map()

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  let gScore = new DefaultValueMap(Number.POSITIVE_INFINITY)
  gScore.set(n.key, 0)

  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n
  let fScore = new DefaultValueMap(Number.POSITIVE_INFINITY)
  fScore.set(n.key, behavior.heuristic(start, end))

  // let's keep track of some performance metrics
  let nodes_visited = 0
  let t0 = performance.now()
  let time, now
  time = t0

  while(openSet.size() > 0){
    // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
    let current = openSet.dequeue()
    if (behavior.isFinished(current, end)){
      console.log('nodes visited: ', nodes_visited)
      console.log(`time taken: ${performance.now() - t0} ms`)
      return reconstructPath(cameFrom, current)
    }
    
    for (let neighbor of behavior.getNeighbors(grid, current)){
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      let tentative_gScore = gScore.get(current.key) + grid[neighbor.x][neighbor.y]
      if (tentative_gScore < gScore.get(neighbor.key)){
        // This path to neighbor is better than any previous one. Record it!
        cameFrom.set(neighbor.key, current)
        gScore.set(neighbor.key, tentative_gScore)
        fScore.set(neighbor.key, tentative_gScore + behavior.heuristic(neighbor, end))
        openSet.push(neighbor)
      }
    }

    // let's print some performance metrics every minute
    now = performance.now()
    nodes_visited++
    if (now - time > 60000){
      console.log('nodes visited: ', nodes_visited, 'queue size: ', openSet.size())
      console.log(`time taken: ${performance.now() - t0} ms`)
      time = now
    }
  }
  return undefined 
}


let R = grid.length
let C = grid[0].length

let start = [0,0]
let goal = {x: R-1, y: C-1}

// manhattan distance
function heuristic(start, end){ 
  return end.y - start.y + end.x - start.x 
}

/*
  logic to get neighbors for part 1. 
  no backtracking, can't move in the same direction
  for more than 3 steps.
*/
function part1GetNeighbors(grid, node){
  // up, down, left, right
  let dirs = [ [-1, 0], [1,0], [0,-1], [0,1] ]

  // for each possible direction, check if its
  // permitted. if it is, add it to the list
  let neighbors = []
  for(let i = 0; i < dirs.length; i++){
    let dx, dy
    [dx,dy] = dirs[i]
    let x = node.x + dx
    let y = node.y + dy

    // no backtracking
    if (dx === -1 * node.dir[0] && dy === -1 * node.dir[1]){
      continue
    }

    let stepsInDir = node.stepsInDir
    if (dx === node.dir[0] && dy === node.dir[1]){
      stepsInDir++
    } else {
      stepsInDir = 1
    }

    // no more than 3 collinear steps
    if (stepsInDir > 3){
      continue
    }

    // stay in the grid
    if(x < 0 || y < 0 || x >= grid.length || y >= grid[0].length){
      continue
    }

    neighbors.push(new Node({
      x: x,
      y: y,
      dir: [dx,dy],
      stepsInDir: stepsInDir
    }))
  }
  return neighbors
}

function part1EndCondition(current, end){
  return current.x === end.x && current.y === end.y
}

/*
  logic to get neighbors for part 2. 
  must move in same direction for at
  least 4 steps but no more than 10
*/
function part2GetNeighbors(grid, node){
  // up down left right
  let dirs = [ [-1, 0], [1,0], [0,-1], [0,1] ]

  // if we've started moving and haven't gone at least 4
  // steps then we have to keep going this way.
  if (0 < node.stepsInDir && node.stepsInDir < 4){
    dirs = [node.dir]
  }
  let neighbors = []
  for(let i = 0; i < dirs.length; i++){
    let dx, dy
    [dx,dy] = dirs[i]
    let x = node.x + dx
    let y = node.y + dy

    // no backtracking
    if (dx === -1 * node.dir[0] && dy === -1 * node.dir[1]){
      continue
    }
    
    let stepsInDir = node.stepsInDir
    if (dx === node.dir[0] && dy === node.dir[1]){
      stepsInDir++
    } else {
      stepsInDir = 1
    }

    // don't leave the grid
    if(x < 0 || y < 0 || x >= grid.length || y >= grid[0].length){
      continue
    }

    // no more than 10 collinear steps
    if (stepsInDir > 10){
      continue
    }

    let neighbor = new Node({
      x: x,
      y: y,
      dir: [dx,dy],
      stepsInDir: stepsInDir
    })
    neighbors.push(neighbor)
  }
  return neighbors
}

function part2EndCondition(current, end){
  return current.x === end.x && current.y === end.y && current.stepsInDir >= 4
}

let path1 = aStar(grid, start, goal, {
  getNeighbors: part1GetNeighbors,
  heuristic: heuristic,
  isFinished: part1EndCondition
})
console.log('Part 1: ', calculateHeatLoss(grid, path1))
printPath(grid, path1)

console.log('----')
let path2 = aStar(grid, start, goal, {
  getNeighbors: part2GetNeighbors,
  heuristic: heuristic,
  isFinished: part2EndCondition
})

console.log('Part 2: ', calculateHeatLoss(grid, path2))
printPath(grid, path2)