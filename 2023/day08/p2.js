import Graph from 'graphology'
const { MultiDirectedGraph } = Graph
import {bidirectional} from 'graphology-shortest-path';
import fs from 'fs'

class Network{
  constructor(directions, graph){
    this.directions = directions
    this.graph = graph
  }
  cache = {}
  getNextNode(source, step){
    let direction = this.directions[step % this.directions.length]
    if(this.cache[[source, direction]]){
      return this.cache[[source, direction]]
    }
    let edge = this.graph.findOutboundEdge( source, (_, a) => a.direction.includes(direction))
    let target = edge ? this.graph.target(edge) : undefined
    if (target == undefined){
      throw new Error("we dont know where we're going")
    }
    this.cache[[source,direction]] = target
    return target
  }
  // factory method to parse a serialized network
  static parse(file){
    const lines = fs.readFileSync(file, 'utf-8').split('\n')

    const directions = lines[0].split('')
    const graph = new MultiDirectedGraph()
    lines.slice(2).forEach(line => {
      // parse nodes
      let source = line.slice(0,3)
      let leftTarget = line.slice(7, 10)
      let rightTarget = line.slice(12,15)
      // add nodes
      graph.mergeNode(source)
      graph.mergeNode(leftTarget)
      graph.mergeNode(rightTarget)
      // add edges
      if (leftTarget == rightTarget){
        graph.addDirectedEdge(source, leftTarget, {direction: ['L', 'R']})
      } else {
        graph.addDirectedEdge(source, leftTarget, {direction: ['L']})
        graph.addDirectedEdge(source, rightTarget, {direction: ['R']})
      }
    })
    return new Network(directions, graph)
  }
}

const network = Network.parse('input.txt')

// first, let's find the a and z nodes we're dealing with here
let a_nodes = network.graph.filterNodes( n => n.endsWith('A'))
let z_nodes = network.graph.filterNodes( n => n.endsWith('Z'))

// this shows us that each A node can only actually reach one
// specific corresponding Z node
let AtoZ = {}
a_nodes.forEach( a => {
  z_nodes.forEach( z => {
    let path = bidirectional(network.graph, a, z)
    if (path){
      AtoZ[a] = z
    }
    console.log(`${a} --> ${z}: ${path}`)
  })
  console.log('--------------------')
})

// i guess let's see how long it takes to get to the Z node
// for each A node and hope it steadies into some cycle
// we can tell if we're in a stable cycle if the number of
// steps it takes to reach the Z node become consistent (twice in a row)
let loop_lengths = []
for (let a of a_nodes){
  let currentNode = a
  let endNode = AtoZ[a]
  // how many steps have we taken
  let steps = 0
  // on what step did we last see the end node
  let lastSeen = 0
  // lets maintain a list of the last seen values to look for consistency
  let lastSeenDelta = []
  while(true){
    currentNode = network.getNextNode(currentNode, steps)
    if (currentNode == endNode){
      lastSeenDelta.push(steps - lastSeen)
      let length = lastSeenDelta.length
      if (length >= 2 ){
        // alright we've found the end node at least twice, let's see
        // if the number of steps has been the same yet
        if (lastSeenDelta[length-1] == lastSeenDelta[length-2]){
          // woohoo!
          loop_lengths.push(lastSeenDelta[length-1])
          break
        } else if (length > 10){
          // thankfully this doesn't get thrown with the input
          throw new Error("we've passed the target node a lot and haven't stabilized yet... i give up")
        }
      }
      lastSeen = steps
    }
    steps++
  }
}

// if we made it this far, we now have a list of cycle lengths
// that correspond to when we hit a Z node. Based on some print
// statements above, each A node takes 1 step and then enters the
// cycle.. So the step number where all A nodes reach a Z node will
// be the least common multiple of these cycle lengths
const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);
console.log(loop_lengths.reduce(lcm))