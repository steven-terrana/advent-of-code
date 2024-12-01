import fs from 'fs'
import Graph from 'graphology'
import gexf from 'graphology-gexf'
import {allSimplePaths} from 'graphology-simple-path'

const animal = 'S'

/*
capture directions we can head from our current location.
for each direction, 
* rowShift and colShift explain how to get the neighbor
* possibleNextPipes is a list of acceptable pipes we can move to
*/
const directions = {
  north: {
    rowShift: -1,
    colShift: 0,
    possibleNextPipes: ['|', 'F', '7', animal ]
  },
  south: {
    rowShift: 1, 
    colShift: 0,
    possibleNextPipes: ['|', 'L', 'J', animal ]
  },
  east: {
    rowShift: 0, 
    colShift: 1,
    possibleNextPipes: ['-', '7', 'J', animal]
  },
  west: {
    rowShift: 0,
    colShift: -1,
    possibleNextPipes: ['-', 'L', 'F', animal]
  }
}


/*
for each pipe type, capture the directions the animal can move. 
F-7
| |
L-J
*/
const pipes = {
  '|': [ directions.north, directions.south ],
  '-': [ directions.east,  directions.west  ], 
  'L': [ directions.north, directions.east  ],
  'J': [ directions.north, directions.west  ],
  '7': [ directions.south, directions.west, ],
  'F': [ directions.south, directions.east  ],
}
// if we're on the starting square, we can move in any direction
pipes[animal] = [...Object.values(directions)]

// returns a 2D array of characters representing the field
function parseField(file){
  let field = fs.readFileSync(file, 'utf-8').split('\n')
  field = field.map( row => row.split(''))
  return field
}

// for a given pipe, inspect the neighboring pipes in the direction
// we can move and add edges if we can go from this pipe to the neighbor
function addEdges(graph, node, field){
  let p = graph.getNodeAttribute(node, 'pipe')
  for(let d of pipes[p]){
    let r = graph.getNodeAttribute(node, 'r') + d.rowShift
    let c = graph.getNodeAttribute(node, 'c') + d.colShift
    if (r < 0 || r >= field.length || c < 0 || c >= field[0].length ){
      continue
    }
    let nextPipe = field[r][c]
    if (d.possibleNextPipes.includes(nextPipe)){
      let n = graph.mergeNode(`(${r},${c})`, {
        r: r, 
        c: c, 
        pipe: nextPipe
      })
      graph.addEdge(node, n[0])
    }
  }
  return graph
}

// take a 2D array of characters (the field) and return a
// undirected graph where each coordinate is a node and the
// edges represent which neighbors the animal can move to
function createGraph(field){
  let graph = new Graph()
  let pipeOptions = Object.keys(pipes)
  field.forEach( (row, r) => {
    row.forEach( (pipe, c) => {
      let node = graph.mergeNode(`(${r},${c})`, {
        r: r,
        c: c, 
        pipe: pipe
      })
      if(pipeOptions.includes(pipe)){
        graph = addEdges(graph, node[0], field)
      }
    })
  })
  return graph
}

// export the field graph into GEXF format for visualizing
function exportGraph(graph, polygon, vertices, edges, pointsWithin, file){
  let points = pointsWithin.map(p => `(${p.toString()})`)
  let poly = polygon.map(p => `(${p.toString()})`)
  let vert = vertices.map(p => `(${p.toString()})`)
  let graphString = gexf.write(graph, {
    formatNode: (key, attributes) => {
      let color 
      let size = 2
      // if (attributes.pipe == animal){
      //   color = '#FF0000'
      //   size = 4
      // } else 
      if (points.includes(key)){
        color = '#ED6804'
        size = 4
      } else if (!vert.includes(key)){
        color = '#930063'
        size = 0
      } else if (poly.includes(key)){
        color = '#FFA500'
        size = 6
      } else {
        color = '#F5f5f5'
        size = 2
      }
      return {
        label: key,
        viz: {
          x: attributes.c, 
          y: attributes.r * -1,
          color: color,
          size: size
        }
      }
    },
    formatEdge: (key, attributes) => {
      let color = "#87C4AC"
      let thickness = 5
      if (edges.includes(key)){
        color = "#930063"
        thickness = 30
      } else {
        color = '#FFFFFF'
      }
      return {
        viz: {
          color: color,
          thickness: thickness
        }
      }
    }
  })
  
  fs.writeFileSync(file, graphString)
}

function findAnimalNode(graph){
  return graph.findNode( node => graph.getNodeAttribute(node, 'pipe') == animal)
}

// parse the field into an undirected graph
let file
[file] = process.argv.slice(2)
file = file ?? 'test.txt'
const field = parseField(file)
let graph = createGraph(field)

// find the animal in that graph
let animalNode = findAnimalNode(graph)

// find the edges representing cycles within the graph that are long enough to 
// represent a loop. There will be two of them, and they are just the same
// path in reverse order. The furthest you can get away from the start is 
// the length of the cycle divided by two.
let path = allSimplePaths(graph, animalNode, animalNode).find(p => p.length > 4)
console.log('Part 1:', Math.floor(path.length/2))

// this path being a closed loop represents the boundary points
// of a lattice polygon. The path includes the start node twice, so drop it
let polygon = path.map( node => {
  let a = graph.getNodeAttributes(node)
  return [a.r, a.c]
})
polygon.shift() 

// given this path also represents a clockwise list, each boundary point
// can be considered a vertice of the polygon and the Shoelace theorem can 
// be used to calculate the area of the polygon.
function area(polygon) {
  let a = 0;
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
      let j = (i + 1) % n;
      a += polygon[i][0] * polygon[j][1] - polygon[j][0] * polygon[i][1]
  }
  return Math.abs(a) / 2;
}

// Pick's theorem states that for a lattice polygon:
// A = I + B/2 - 1 
// where:
// A - polygon area
// B - # of boundary points
// I - # of interior points
// therefore:
// I = A - B/2 + 1
let I = area(polygon) - polygon.length*0.5 + 1
console.log('Part 2:', I)