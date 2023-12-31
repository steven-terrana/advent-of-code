import fs from 'fs'
import graphology from 'graphology'
import { subgraph } from 'graphology-operators'
const { Graph, MultiGraph } = graphology
import {random} from 'graphology-layout'
import noverlap from 'graphology-layout-noverlap'
import gexf from 'graphology-gexf'

function parse(){
  let file
  [file] = process.argv.slice(2)
  file = file ?? 'test.txt'
  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  let nodes = new Set()
  let edges = new Map()
  for (let line of lines){
    let node, neighbors
    [node, neighbors] = line.split(':').map(p => p.trim())
    neighbors = neighbors.split(' ').map( n => n.trim())
    nodes.add(node)
    for (let n of neighbors){
      nodes.add(n)
    }
    edges.set(node, neighbors)
  }

  let graph = new Graph()
  nodes.forEach(n => graph.addNode(n))
  edges.forEach( (targets, source) => {
    targets.forEach( target => {
      graph.addUndirectedEdge(source, target, {weight: 1}) 
    })
  })

  return graph
}

function getComponents(graph){
  let nodes = new Set(graph.nodes())
  let visited = new Set()

  let components = []

  const bfs = (node) => {
    let component = []
    let queue = [ node ]
    while (queue.length > 0){
      let n = queue.shift()
      component.push(n)
      visited.add(n)
      for (let neighbor of graph.neighbors(n)){
        if(!visited.has(neighbor) && !queue.includes(neighbor)){
          queue.push(neighbor)
        }
      }
    }
    return component
  }
  for (let node of nodes){
    if(visited.has(node)){
      continue
    }
    components.push(bfs(node))
  }
  return components
}

/*

see: 
* https://en.wikipedia.org/wiki/Stoer%E2%80%93Wagner_algorithm
* https://www.youtube.com/watch?v=AtkEpr7dsW4
*/
function minCut(original){
  let graph = original.copy()

  // get a random node from the graph
  const randomNode = (g) => {
    let nodes = g.nodes()
    let random = Math.floor(Math.random() * nodes.length)
    return nodes[random]
  }

  // comparator used to sort a node's neighbors by weight from
  // largest to smallest
  const byWeight = (g, n) => {
    return function(a,b){
      return g.getEdgeAttribute(n, b, 'weight') - g.getEdgeAttribute(n, a, 'weight')
    }
  }

  // given a graph and two vertices a and b, 
  // merge a and b into a single node and 
  // transfer the edges to the new node
  const contractEdge = (g, a, b) => {
    // create the new supernode
    let newNode = g.addNode(a+b, {
      nodes: [...(g.getNodeAttribute(a, 'nodes') ?? []), b]
    })

    // get neighbors of node and supernode
    // if they share a neighbor, we need to merge the edges
    // otherwise we can just transfer the edge
    let aNeighbors = g.neighbors(a).filter( n => n != b)
    let bNeighbors = g.neighbors(b).filter( n => n != b )
    let sharedNeighbors = aNeighbors.filter(n => bNeighbors.includes(n))
    aNeighbors = aNeighbors.filter( n => !sharedNeighbors.includes(n))
    bNeighbors = bNeighbors.filter( n => !sharedNeighbors.includes(n))
    for (let n of aNeighbors){
      let weight = g.getEdgeAttribute(a, n, 'weight')
      g.addUndirectedEdge(n, newNode, {weight: weight})
    }
    for (let n of bNeighbors){
      let weight = g.getEdgeAttribute(b, n, 'weight')
      g.addUndirectedEdge(n, newNode, {weight: weight})
    }
    for (let n of sharedNeighbors){
      let w1 = g.getEdgeAttribute(a, n, 'weight')
      let w2 = g.getEdgeAttribute(b, n, 'weight')
      g.addUndirectedEdge(n, newNode, {weight: w1+w2})
    }
    // drop the old supernode and node
    g.dropNode(a)
    g.dropNode(b)

    return newNode
  }

  const cutSize = (g, a) => g.reduceNeighbors(a, (s, n) => {
    return s + graph.getEdgeAttribute(a,n,'weight')
  }, 0)

  // first, do a depth first search (DFS) of the graph, prioritizing edges with largest weights
  let first = randomNode(graph)
  graph.setNodeAttribute(first, 'nodes', [first])
  let order = [ first ] 
  let superNode = first
  let history = []
  while(graph.order > 1){
    history.push({
      superNode: superNode,
      A: graph.getNodeAttribute(superNode, 'nodes'),
      B: graph.nodes().filter(n => ![...graph.getNodeAttribute(superNode, 'nodes'), superNode].includes(n)),
      cutSize: cutSize(graph, superNode),
    })

    // pick the neighbor with the largest weight to absorb
    let neighbors = graph.neighbors(superNode)
    neighbors.sort(byWeight(graph, superNode))
    let node = neighbors.shift()
    order.push(node)
    superNode = contractEdge(graph, superNode, node)
  }

  history.sort( (a,b) => a.cutSize - b.cutSize )
  return history.shift()
}


let graph = parse()
let cut = minCut(graph)

// console.log(cut)
//612945
console.log('Part 1:', cut.A.length * cut.B.length)