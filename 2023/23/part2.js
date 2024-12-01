import fs from 'fs' 
import chalk from 'chalk'
import Graph from 'graphology'
import dijkstra from 'graphology-shortest-path/dijkstra.js'
import { allSimplePaths } from 'graphology-simple-path'
import gexf from 'graphology-gexf'

function parse(){
  let file
  [file] = process.argv.slice(2)
  file = file ?? 'test.txt'
  return fs.readFileSync(file, 'utf-8').split('\n').map (l => Array.from(l))
}

function printMap(map, here){
  console.log('='.repeat(map[0].length))
  let path = getPath(here).map(n => JSON.stringify(n.location))
  console.log('trail length: ', path.length)
  console.log('='.repeat(map[0].length))
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
  if (isSlope(here)){
    dirs = [ directions[getTile(here)] ]
  }
  
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

function getNeighbors(map, node){
  let R = map.length
  let C = map[0].length
  let dirs = [[0,1], [0, -1], [1, 0], [-1, 0]]
  let neighbors = []
  for (let d of dirs){
    let x = node[0] + d[0]
    let y = node[1] + d[1]
    // no outside map, no running into trees
    if (x < 0 || x >= R || y < 0 || y >= C || map[x][y] == '#'){
      continue
    }
    neighbors.push([x,y])
  }
  return neighbors
}

// find all junctions on the map where
// multiple paths forward are possible
function findJunctions(map){
  let junctions = []
  for (let i = 0; i < map.length; i++){
    for (let j = 0; j < map[0].length; j++){
      if (map[i][j] !== '#'){
        let node = [i,j]
        let neighbors = getNeighbors(map, node)
        if (neighbors.length > 2){
          junctions.push(node)
        }
      }
    }
  }
  return junctions
}

// for each junction, hike the trails
// to find the neighboring junctions
function findEdges(map, nodes){
  let edges = []
  
  for (let node of nodes){
    let queue = []
    queue.push({location: node, steps: 0, previous: undefined})
    while(queue.length > 0){
      let here = queue.shift()
      let neighbors = getNeighbors(map, here.location)
      let next = []
      for (let n of neighbors){
        // no backtracking
        if (n[0] == here.previous?.[0] && n[1] == here.previous?.[1]){
          continue
        }
        next.push({
          location: n, 
          steps: here.steps + 1, 
          previous: here.location
        })
      }
      // if we're at a junction, add the edge
      // and stop traversing, otherwise keep going
      if (next.length > 1 && !(here.location[0] == node[0] && here.location[1] == node[1])){
        edges.push({
          source: JSON.stringify(node),
          target: JSON.stringify(here.location),
          weight: here.steps
        })
      } else {
        queue.push(...next)
      }
    }
  }
  
  return edges
}

function serializeGraph(graph){
  function formatNode(key){ 
    let n = JSON.parse(key)
    return {
      label: key,
      viz: {
        x: n[1],
        y: -1 * n[0],
        shape: 'circle',
        size: 5
      }
    }
  }
  
  function formatEdge(key, attributes){
    return {
      label: attributes.weight,
      viz: {
        shape: 'dotted',
        thickness: 10
      }
    }
  }
  
  // Using custom formatting for nodes & edges
  var gexfString = gexf.write(graph, {
    formatNode: formatNode,
    formatEdge: formatEdge
  })
  
  fs.writeFileSync('visualize/public/graph.gexf', gexfString)
}

let map = parse()
let start = [0, map[0].indexOf('.')]
let end = [map.length-1, map[map.length-1].indexOf('.')]
let junctions = findJunctions(map)

let graph = new Graph()

let nodes = [start, ...junctions, end]
for (let n of nodes){
  graph.addNode(JSON.stringify(n))
}

let edges = findEdges(map, nodes)
for (let edge of edges){
  graph.mergeUndirectedEdge(edge.source, edge.target, { weight: edge.weight })
}

serializeGraph(graph)

let s = JSON.stringify(start)
let e = JSON.stringify(end)
let paths = allSimplePaths(graph, s, e)
console.log(`found ${paths.length} paths`)
let max = 0
for (let path of paths){
  let length = 0
  for (let i = 0; i < path.length - 1; i++){
    length += graph.getEdgeAttribute(path[i], path[i+1], 'weight')
  }
  max = Math.max(max, length)
}

console.log('longest: ', max)