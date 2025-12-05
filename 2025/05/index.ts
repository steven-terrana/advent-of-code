// input parsing
type Range = [number, number]
const {freshRanges, fruitIds} = await Bun.file('input.txt').text().then(((f: string) => {
  const [freshRangesRaw, fruitIdsRaw] = f.split("\n\n").map(p => p.trim())

  const freshRanges: Range[] = freshRangesRaw!.split('\n').map( (line: string) => {
    return line.split("-").map(n => parseInt(n.trim())) as Range
  })

  const fruitIds: number[] = fruitIdsRaw!.split('\n').map(n => parseInt(n.trim()))
  return { freshRanges, fruitIds }
}))

// part 1
const freshFruit = fruitIds.filter( f => {
  return freshRanges.find( r => {
    return f >= r[0] && f <= r[1]
  })
})
const part1 = freshFruit.length


// part 2
function tryMerge(a: Range, b: Range) {
  // if collision, merge into 1 range
  if (
    (a[1] >= b[0] && a[1] <= b[1]) ||
    (a[0] >= b[0] && a[0] <= b[1]) || 
    (b[1] >= a[0] && b[1] <= a[1]) ||
    (b[0] >= a[0] && b[0] <= a[1])
  ){
    return [[ Math.min(a[0], b[0]), Math.max(a[1], b[1])]]
  }

  // no overlap, return originals
  return [a,b]
}

merging: while(true){
  for (let a = 0; a < freshRanges.length - 1; a++){
    for (let b = a + 1; b < freshRanges.length; b++){
      const newRanges = tryMerge(freshRanges[a], freshRanges[b])
      if (newRanges.length === 1){
        freshRanges.splice(b, 1)
        freshRanges.splice(a, 1)
        freshRanges.push(newRanges[0])
        continue merging
      }
    }
  }
  break merging;
}

const part2 = freshRanges.reduce( (total, r) => total + r[1] - r[0] + 1, 0)
console.log({ part1, part2 })