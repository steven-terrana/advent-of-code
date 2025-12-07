const grid = await Bun.file("input.txt").text().then( content => {
    return content.split('\n')
}).then( lines => {
    return lines.map(line => line.split(''))
})

const SPLITTER = "^"
const ROWS = grid.length

const origin = grid[0]?.findIndex(c => c === 'S') as number
let beams: Set<number> = new Set([ origin ])
let splits = 0;
for (let r = 1; r < ROWS; r++){
    let newBeams = new Set([])
    beams.forEach( b => {
        if (grid[r]![b] === SPLITTER){
            splits++
            newBeams.add(b - 1)
            newBeams.add(b + 1)
        } else {
            newBeams.add(b)
        }
    })
    beams = newBeams
}

console.log(splits)