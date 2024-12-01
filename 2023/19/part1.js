import fs from 'fs'

function parse(file){
  let input = fs.readFileSync(file, 'utf-8')
  let [raw_workflows, raw_ratings] = input.split("\n\n")

  let graph = new Map()
  for (let workflow of raw_workflows.split("\n")){
    let name = workflow.slice(0, workflow.indexOf('{'))
    let flow = workflow.slice(workflow.indexOf('{')+1, workflow.length-1).split(',')
    let target = flow[flow.length-1]
    let rules = flow.slice(0, flow.length-1).map( rule => {
      let condition, ruleTarget
      [condition, ruleTarget] = rule.split(':')
      return {
        condition: condition,
        next: ruleTarget
      }
    })
    graph.set(name, {
      rules: rules,
      next: target
    })
  }

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


let total = 0
for(let i = 0; i < ratings.length; i++){
  let rating = ratings[i]
  let node = 'in'
  let nodes = [ node ]
  let x,m,a,s
  ({x,m,a,s} = rating)
  evaluation: while(!['A','R'].includes(node)){
    let n = graph.get(node)
    for(let r of n.rules){
      if (eval(r.condition)){
        nodes.push(n.next)
        node = r.next
        continue evaluation
      }
    }
    nodes.push(n.next)
    node = n.next
  }
  nodes.push(node)
  if(node == 'A'){
    total += x + m + a + s
  }
}

console.log('Part 1:', total)