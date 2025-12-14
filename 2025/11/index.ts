// track, for each node, the nodes it can get to
let outbound = new Map<string, string[]>
// track, for each node, the nodes that can get to it
let inbound = new Map<string, string[]>

await Bun.file("input.txt").text().then( text => {
  text.split("\n").forEach( line => {
    const [source, targets] = line.split(":").map(p => p.trim()) as [string, string]
    if (!outbound.has(source)){
      outbound.set(source, [])
    }
    targets.split(" ").map(p => p.trim()).forEach( target => {
      if (!inbound.has(target)){
        inbound.set(target, [])
      }
      inbound.get(target)!.push(source)
      outbound.get(source)?.push(target)
    })
  })
})

/**
 * used to output a `graph.dot` file which you can visualize by pasting into
 * https://dreampuf.github.io/GraphvizOnline
 */
function to_dot(colors: string[]){
  let out = ['digraph G {']
  colors.forEach( c => {
    out.push(`  "${c}" [style=filled fillcolor=red fontcolor=white]`)
  })
  for (const [src, targets] of outbound.entries()) {
    for (const tgt of targets) {
      out.push(`  "${src}" -> "${tgt}"`)
    }
  }
  out.push('}')
  Bun.write('graph.dot', out.join('\n'))
}



/**
 * 
 * @param start starting node
 * @param end ending node
 * @param tooFar set of nodes that if reached, you've gone too far
 * @returns number of paths
 */
function countPaths(start: string, end: string, tooFar: Set<string> = new Set()){
  let queue = [ start ]
  let paths = 0
  
  while(queue.length){
    let state = queue.pop()!
  
    if (state === end) {
      paths++
      continue
    }

    if (tooFar.has(state)){
      continue
    }
  
    outbound.get(state)?.forEach( next => {
      queue.push(next)
    })
  }
  return paths
}

const part1 = countPaths("you", "out")

// visualize graph
to_dot(["svr", "dac", "fft", "out"])

/**
 * visual inspection showed that the graph went:
 *    svr -> fft -> dac -> out
 * 
 * futher, it showed that there were no cycles
 * and that the graph fanned out and in conveniently.
 * we can use that fact to provide a set of nodes that
 * can stop the search.
 */
const svr2fft = countPaths("svr", "fft", new Set(["jqr", "yvk", "jyv", "aoc"]))
const fft2dac = countPaths("fft", "dac", new Set(["ecy", "svb", "you"]))
const dac2out = countPaths("dac", "out")

let part2 = svr2fft * fft2dac * dac2out
console.table({ part1, part2 })

