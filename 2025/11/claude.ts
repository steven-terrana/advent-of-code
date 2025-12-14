// track, for each node, the nodes it can get to
let adjacency = new Map<string, string[]>()

await Bun.file("input.txt").text().then(text => {
  text.split("\n").forEach(line => {
    const [source, targets] = line.split(":").map(p => p.trim()) as [string, string]
    if (!adjacency.has(source)) {
      adjacency.set(source, [])
    }
    targets.split(" ").map(p => p.trim()).forEach(target => {
      adjacency.get(source)!.push(target)
    })
  })
})

interface State {
  current: string,
  path: Set<string>
}

function getPaths(start: string, end: string) {
  let state: State = { current: start, path: new Set([start]) }
  let queue = [state]
  let paths = []

  while (queue.length) {
    let state = queue.pop()!

    if (state.current === end) {
      paths.push(state.path)
      continue
    }

    adjacency.get(state.current)?.forEach(next => {
      if (!state.path.has(next)) {
        const updatedPath = structuredClone(state.path)
        updatedPath.add(state.current)
        queue.push({
          current: next,
          path: updatedPath
        })
      }
    })
  }
  return paths
}

const part1 = getPaths("you", "out").length

// For part 2: count paths svr → out that go through fft AND dac
// Use multiplication principle: paths(svr→fft) × paths(fft→dac) × paths(dac→out)
// This works if the graph sections between waypoints are disjoint

console.log("Counting svr→fft...")
const svr_fft = getPaths("svr", "fft")
console.log(`svr→fft: ${svr_fft.length} paths`)

console.log("Counting fft→dac...")
const fft_dac = getPaths("fft", "dac")
console.log(`fft→dac: ${fft_dac.length} paths`)

console.log("Counting dac→out...")
const dac_out = getPaths("dac", "out")
console.log(`dac→out: ${dac_out.length} paths`)

const part2 = svr_fft.length * fft_dac.length * dac_out.length

console.table({ part1, part2 })
