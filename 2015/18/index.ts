import input from './input.txt'

type Cell = 0 | 1
type State = Cell[][]

function parseState(): State{
    let state: State = []
    for(let line of input.split('\n')){
        let row: Cell[]= []
        for (let cell of Array.from(line)){
            row.push(cell == "#" ? 1:0)
        }
        state.push(row)
    }
    return state
}

function getCell(state: State, i: number, j: number): Cell{
    let neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]
    ]
    let c = 0
    for(let n of neighbors){
        let di, dj
        [di, dj] = n
        let x = i + di
        let y = j + dj
        if (x < 0 || x >= state.length || y < 0 || y > state[0].length){
            continue
        }
        if(state[x][y] == 1){
            c++
        }
    }
    if(state[i][j] == 1){
        // A light which is on stays on when 2 or 3 neighbors are on, and turns off otherwise.
        if (c == 2 || c == 3){
            return 1
        } else {
            return 0
        }
    } else {
        // A light which is off turns on if exactly 3 neighbors are on, and stays off otherwise.
        if (c == 3){
            return 1
        } else {
            return 0
        }
    }
}

function turnOn(state: State, on: number[][]=[]) {
    for(let coord of on){
        let i,j
        [i,j] = coord
        state[i][j] = 1
    }
}

function step(state: State, steps: number=1, stuckOn: number[][]=[]): State {
    const _step = (state: State) => {
        let next: State = []
        for (let i = 0; i < state.length; i++){
            let row: Cell[] = []
            for (let j = 0; j < state[i].length; j++){
                row.push(getCell(state,i,j))
            }
            next.push(row)
        }
        turnOn(next, stuckOn)
        return next
    }
    let _state = state
    for (let i = 0; i < steps; i++){
        _state = _step(_state)
    }
    return _state
}

function countAlive(state: State){
    let alive = 0
    for (let i = 0; i < state.length; i++){
        for (let j = 0; j < state[i].length; j++){
            if (state[i][j] == 1){
                alive++
            }
        }
    }
    return alive
}

let state = parseState()
let final = step(state, 100)
console.log('Part 1:', countAlive(final))

// the corners
let stuckOn = [
    [0,0], [0, state[0].length-1],
    [state.length-1, 0], [state.length-1, state[0].length-1]
]

// turn on the corners for the initial state
turnOn(state, stuckOn)
final = step(state, 100, stuckOn)
console.log('Part 2:', countAlive(final))