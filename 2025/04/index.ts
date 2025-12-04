const input = await Bun.file('input.txt').text()
const grid = input.split('\n').map( line => line.split('') )

const ROWS = grid.length
const COLS = grid[0]!.length

type RollCoordinate = [number, number]
type RollCoordinates = RollCoordinate[]

function findRemovable(grid: string[][]): RollCoordinates {
  let removable: RollCoordinates = []

  for (let r = 0; r < ROWS; r++){
    for (let c = 0; c < COLS; c++){
  
      if (grid[r]![c] !== "@"){
        continue
      }

      let neighbors = 0
  
      for (let dr of [-1, 0, 1]){
        for(let dc of [-1, 0, 1]){
          let nr = r + dr
          let nc = c + dc
          // dont check center
          if (dr === 0 && dc === 0){
            continue
          }
          // outside the grid
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS){
            continue
          }
          if (grid[nr]![nc] === "@") {
            neighbors++
          }
        }
      }
  
      if (neighbors < 4){
        removable.push([r, c])
      }
  
    }
  }

  return removable
}

let removedCounts: number[] = []

while(true){
  let removable = findRemovable(grid)
  removedCounts.push(removable.length)
  if (removedCounts.at(-1) === 0){
    break
  }
  for (let [r,c] of removable){
    grid[r]![c] = '.'
  }
}

console.table({
  'part 1': removedCounts[0],
  'part 2': removedCounts.reduce( (total, r) => total + r, 0)
})