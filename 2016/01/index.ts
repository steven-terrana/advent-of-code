import input from './input.txt'


interface Direction {
    x: number,
    y: number, 
    L: () => Direction,
    R: () => Direction 
}
type Turn = 'L'|'R'
interface Instruction {
    turn: Turn,
    steps: number
}
type CardinalDirection = 'N'|'S'|'E'|'W'

const DIRECTIONS: Record<CardinalDirection, Direction> = {
    N: { x:  0, y:  1, L: () => DIRECTIONS.W, R: () => DIRECTIONS.E },
    E: { x:  1, y:  0, L: () => DIRECTIONS.N, R: () => DIRECTIONS.S },
    S: { x:  0, y: -1, L: () => DIRECTIONS.E, R: () => DIRECTIONS.W },
    W: { x: -1, y:  0, L: () => DIRECTIONS.S, R: () => DIRECTIONS.N }
}

let instructions = input
    .split(',')
    .map(d => d.trim())
    .map(d => {
        return {
            turn: d[0], 
            steps: parseInt(d.slice(1))
        } as Instruction
    })

let heading = DIRECTIONS['N']
let x = 0
let y = 0

const manhattan = (x: number, y: number) => Math.abs(x) + Math.abs(y)

let part2
let visited = new Set([0,0].toString())
for(let j=0; j < instructions.length; j++){
    let instruction = instructions[j]
    heading = heading[instruction.turn]()
    let destX = x + heading.x * instruction.steps
    let destY = y + heading.y * instruction.steps
    do{
        do{
            let key = [x,y].toString()
            if(visited.has(key) && part2 == undefined){
                part2 = manhattan(x,y)
            }
            visited.add(key)
            if(x != destX){
                x < destX ? x++ : x--
            }
            if(y != destY){
                y < destY ? y++ : y--
            }
        }while (y != destY)
    }while(x != destX)
}

console.log('Part 1:', manhattan(x,y))
console.log('Part 2:', part2)