import firstRow from './input.txt'

type Grid = string[][] 
let grid = [ Array.from(firstRow) ]

/*
    A tile is a trap if:
    * Its left and center tiles are traps, but its right tile is not.
    * Its center and right tiles are traps, but its left tile is not.
    * Only its left tile is a trap.
    * Only its right tile is a trap.
*/
function isTrap(grid: Grid, y: number, x: number): boolean{
    const left   = (grid[y-1][x-1] ?? '.') === '^'
    const center = (grid[y-1][x] ?? '.') === '^'
    const right  = (grid[y-1][x+1] ?? '.') === '^'

    return (left && center && !right)  || 
           (!left && center && right)  || 
           (left && !center && !right) || 
           (!left && !center && right)
}

function countSafe(g: Grid, rows: number): number{
    let grid = g.slice()
    let safe = grid[0].filter(c => c == '.').length
    for (let i=1; i < rows; i++){
        let row: string[] = []
        for(let j=0; j < grid[0].length; j++){
            if (isTrap(grid, i, j)){
                row.push('^')
            } else {
                row.push('.')
                safe++
            }
        }
        grid.push(row)
    }
    return safe
}


console.log('Part 1:', countSafe(grid, 40))
console.log('Part 2:', countSafe(grid, 400000))