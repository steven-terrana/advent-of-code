import fs from 'fs'
import pkg from 'graphology';
const {MultiDirectedGraph} = pkg;
import { allSimplePaths } from 'graphology-simple-path'

/*
Given the example workflow:
  in{s<1351:px,qs}
  px{a<2006:qkq,m>2090:A,rfg}
  qs{s>3448:A,lnx}
  lnx{m>1548:A,A}

let's consider the shortest path from in -> A:
  in --> px --> A

For this path to happen, the following conditions must be true:
  in --[s < 1351]--> px --[a >= 2006 && m <= 2090]--> A 

what's crucial to note is that the edge condition from node A to node B is
such that the inverse of the preceding rule conditions must all be true in 
a given line AND the condition itself that will send you to B must be true.

Sometimes, there exist multiple valid paths between two nodes if there are 
two sets of conditions that will send you there. For example:
  qs --> A
  1. qs --[s > 3448]--> A
  2. qs --[s <= 3448]--> lnx --[m > 1548]--> A
  3. qs --[s <= 3448]--> lnx --[m <= 1548]--> A

let's put it together:
in --> A = [
  in --> px --> A
    1: in --[s < 1351]--> px --[a >= 2006 && m <= 2090]--> A
  in --> qs --> A
    2: in --[s >= 1351]--> qs --[s > 3448]--> A
  in --> qs --> lnx --> A
    3: in --[s >= 1351]--> qs --[s <= 3448]--> lnx --[m > 1548]--> A
    4: in --[s >= 1351]--> qs --[s <= 3448]--> lnx --[m <= 1548]--> A
]

Now let's look at 3: 
in --[s >= 1351]--> qs --[s <= 3448]--> lnx --[m > 1548]--> A

These edge conditions must all be true for the rating to be accepted so
combining them yields: s >= 1351 && s <= 3448 && m > 1548

knowing that if all those inequalities are true, then the rating is accepted
we can reduce the acceptable bounds of the problem. By default all variables
x,m,a,s can be from 1 to 4000 inclusive.

But for this path to be valid, it means that:
x must be: 1351 <= x <= 3448
m must be: 1549 <= m <= 4000
a must be:    1 <= a <= 4000
s must be:    1 <= s <= 4000

therefore we know there the total number of ratings that could be accepted
is equal to: (3448 - 1351 + 1) * (4000 - 1549 + 1) * (4000 - 1 + 1) * (4000 - 1 + 1)

GIVEN ALL THIS:
the solution therefore is to:
1. find all valid paths from in to A on a multi-directed graph
2. For each valid path sum together the number of possible ratings by: 
  2a: aggregating the conditions on the edges
  2b: using that to restrict the bounds of acceptable x,m,a,s values
  2c: using these restricted bounds to determine the number of valid ratings for this path
  2d: adding this number to the total
3. This approach thus far will have double counted a rating that would have been
   valid on multiple paths - so we can use the restricted bounds to count the 
   overlapping number of acceptable ratings and subtract it from the total,
   yielding our final result.
*/


/*
  represents one rule within a line.
*/
const opposite = {'<': '>=', '>': '<='}
class Rule{
  constructor(source, {key,operator,threshold, target}){
    this.source = source
    this.key = key 
    this.operator = operator
    this.threshold = threshold
    this.target = target
    this.previous = []
  }
  condition(){
    return `${this.key}${this.operator}${this.threshold}`
  }
  inverse(){
    return `${this.key}${opposite[this.operator]}${this.threshold}`
  }
  chain(){
    return '(' + 
    [...this.previous, this.condition()].join(" && ")
    + ')'
  }
}

/* 
  parses the input to return a multidirected graph and ratings
  graph nodes are the letters
  graph edges are directed edges with a condition attribute of the
    aggregated condition for the edge to be valid
*/
function parse(file){
  let input = fs.readFileSync(file, 'utf-8')
  let [raw_workflows, raw_ratings] = input.split("\n\n")

  let nodes = new Set()
  let edges = []
  // for each line of the workflow..
  for (let workflow of raw_workflows.split("\n")){
    let name = workflow.slice(0, workflow.indexOf('{'))
    let flow = workflow.slice(workflow.indexOf('{')+1, workflow.length-1).split(',')
    let rules = []
    let prevRule
    // for each individual rule...
    for(let ruleString of flow){
      let rule
      if(ruleString.includes(':')){
        let r = ruleString.match(/(?<key>[xmas])(?<operator>[<>])(?<threshold>\d+):(?<target>\w+)/).groups
        rule = new Rule(name, r)
        rule.source 
      } else { // the target if no previous rules were true
        rule = new Rule(name, {
          key: '',
          operator: true,
          threshold: '',
          target: ruleString
        })
      }
      if (prevRule){
        rule.previous = [... prevRule.previous, prevRule.inverse()]
      }
      rules.push(rule)
      prevRule = rule
    }
    for(let i = 0; i < rules.length; i++){
      let r = rules[i]
      nodes.add(r.source)
      nodes.add(r.target)
      edges.push({
        source: r.source,
        condition: r.chain(),
        target: r.target
      })
    }
  }
  let graph = new MultiDirectedGraph()
  nodes.forEach(n => graph.addNode(n))
  edges.forEach(e => graph.addEdge(e.source, e.target, { condition: e.condition } ))

  let ratings = []
  for(let r of raw_ratings.split('\n')){
    let x,m,a,s
    eval(`${r};`)
    ratings.push({x: x, m: m, a: a, s: s})
  }

  return [graph, ratings]
}

let file
[file] = process.argv.slice(2)
file = file ?? 'test.txt'

let graph,ratings
[graph, ratings] = parse(file)

// 1. find all the paths by node from in to A
let paths = allSimplePaths(graph, 'in', 'A')

// 1B. find all the edge paths given there may
//     be more than one way to get between two
//     neighboring nodes in a multi graph
let allPaths = []
for (let path of paths){
  let edgePaths = [ [] ]
  for (let i = 1; i < path.length; i++){
    let edges = graph.edges(path[i-1], path[i])
    let newPaths = []
    for (let edge of edges){
      let original_paths = edgePaths.slice()
      original_paths = original_paths.map( o => [...o, edge])
      newPaths.push(...original_paths)
    }
    edgePaths = newPaths
  }
  allPaths.push(...edgePaths)
}

// for each possible path, create the composite
// condition for the path to work
let composites = []
for (let path of allPaths){
  let conditions = []
  for (let edge of path){
    let condition = graph.getEdgeAttribute(edge, 'condition')
    conditions.push(condition)
  }
  composites.push(conditions.join(' && '))
}

// for each composite condition, restrict the bounds
// of this path
let regex = new RegExp(/(?<k>[xmas])(?<o><|>|<=|>=)(?<v>\d+)/g)
let operations = {
  do: (b,o,k,v) => { 
    b[k] = operations[o](b,k,v)
    b[k].sort( (a,b) => a - b)
    return b
  },
  "<":  (b,k,v) => { b[k] = b[k].filter( x => x < v); b[k].push(v-1); return b[k]},
  "<=": (b,k,v) => { b[k] = b[k].filter( x => x <= v); b[k].push(v); return b[k]},
  ">":  (b,k,v) => { b[k] = b[k].filter( x => x  > v); b[k].push(v+1); return b[k]},
  ">=": (b,k,v) => { b[k] = b[k].filter( x => x >= v); b[k].push(v); return b[k]}
}

let allBounds = []
for(let i=0; i < composites.length; i++){
  let bounds = {
    'x': [1, 4000],
    'm': [1, 4000],
    'a': [1, 4000],
    's': [1, 4000]
  }
  let parts = Array.from(composites[i].matchAll(regex)).map( p => {
    return {
      k: p.groups.k,
      o: p.groups.o,
      v: parseInt(p.groups.v)
    }
  })  
  for (let p of parts){
    bounds = operations.do(bounds, p.o, p.k, p.v)
  }
  for (let k of Object.keys(bounds)){
    if (bounds[k].length == 1){
      bounds[k].push(bounds[k][0])
    }
  }
  allBounds.push(bounds)
}

// determines the overlap between two acceptable bound rages
function countIntersections(a,b){
  let n = []

  // drag b's k axis from left to right and count hits
  for(let k of Object.keys(a)){
    //  b to the left of a    b to the right of a
    //   | b | [ a ]             [ a ] | b |
    if (b[k][1] < a[k][0] || b[k][0] > a[k][1]){
      return 0
    }
    // b intersects a from the left, but is not inside a
    //  |  b  [ | a ]
    if (b[k][1] >= a[k][0] && b[k][0] < a[k][0]){
      n.push(b[k][1] - a[k][0] + 1)
      continue
    }
    // b is inside a
    //  [ |b| a ]
    if (b[k][0] >= a[k][0] && b[k][1] <= a[k][1]){
      n.push(b[k][1] - b[k][0] + 1)
      continue
    }
    // b intersects a from the left, but is not inside a
    //  [ a  |  b ]  |
    if (b[k][0] >= a[k][0] && b[k][1] >= a[k][1]){
      n.push(a[k][1] - b[k][0] + 1)
      continue
    }
  }
  return n.reduce( (p, o) => p *= o, 1)
}

// add up all the permutations for each bound
let total = 0
for(let bounds of allBounds){
  // the number of valid ratings for a set of
  // bounds is conveniently the count of intersection
  // points with itself
  total += countIntersections(bounds, bounds)
}

// subtract any overlap between bounds that
// resulted in double counting the same option
for (let i = 1; i < allBounds.length; i++){
  for (let j = 0; j < i; j++){
    total -= countIntersections(allBounds[i], allBounds[j])
  }
}

console.log(total)