import Graph from 'graphology'
const { MultiDirectedGraph } = Graph
import fs from 'fs'

export class Network {
  static exitNode = 'ZZZ'
  constructor(directions, graph){
    this.directions = directions
    this.graph = graph
  }
  countSteps(start, end){
    let currentNode = start
    let steps = 0
    while(currentNode != end){
      let direction = this.directions[steps % this.directions.length]
      currentNode = this.getNextNode(currentNode, direction)
      steps++
    }
    return steps
  }
  getNextNode(source, direction){
    let edge = this.graph.findOutboundEdge( source, (_, a) => a.direction.includes(direction))
    let target = edge ? this.graph.target(edge) : undefined
    return target
  }
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

function main(){
  const network = Network.parse('input.txt')
  const steps = network.countSteps('AAA', 'ZZZ')
  console.log(steps)
}

// run with.. node p1.js main
// this lets us skip running code when imported
if (process.argv.includes('main')) {
  main();
}


