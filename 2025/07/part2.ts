const grid = await Bun.file("input.txt").text().then( content => {
    return content.split('\n')
}).then( lines => {
    return lines.map(line => line.split(''))
})

const SPLITTER = "^"
const ROWS = grid.length
/**
 * a default value Map whose value is zero on first access
 */
class Beams extends Map<number, number> {
    override get(key: number): number {
        if (!this.has(key)) {
            this.set(key, 0);
        }
        return super.get(key)!;
    }
}

const origin = grid[0]?.findIndex(c => c === 'S') as number
let beams = new Beams()
beams.set(origin , 1)


for (let r = 1; r < ROWS; r++){
    let newBeams = new Beams()
    for( let b of beams.keys() ){
        if (grid[r]![b] === SPLITTER){
            newBeams.set(b - 1, newBeams.get(b - 1) + beams.get(b) )            
            newBeams.set(b + 1, newBeams.get(b + 1) + beams.get(b) )
        } else {
            newBeams.set(b, newBeams.get(b) + beams.get(b))
        }
    }
    beams = newBeams
}

const total = beams.values().reduce( (total, current) => total + current, 0)
console.log(total)