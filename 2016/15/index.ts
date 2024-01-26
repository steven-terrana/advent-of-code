import input from './input.txt'

/*
    generates a function that accepts a time value t that returns 
    true based on whether a capsule dropped at time t would fall through
    the slot in the disc.

    let's take the example:
    Disc #1 has 5 positions; at time=0, it is at position 4.
    Disc #2 has 2 positions; at time=0, it is at position 1.

    the capsule takes 1 second to reach disc #1 which 
    is 1 position away from 0 and takes 5 seconds to rotate

    the capsule takes 2 seconds to reach disc #2 which
    is 1 position away from 0 and takes 2 seconds to rotate

    so mathematically the capsule will fall through for every time
    t where both these equations are true:

    ((t+1) - (5 - 4)) % 5 == 0
    ((t+2) - (2 - 1)) % 2 == 0
    .. generically..

    ( (t + drop seconds) - (period - current position)) % period = 0

    basicall - it takes $(period - current_position) seconds to reach
    the 0 slot for the first time... and then we'll be back at the 
    0 slot every $(period) seconds
    

*/
type Disc = (t:number)=>boolean
function disc(drop: number, period: number, position: number): Disc{
    return (t:number): boolean => ((t+drop) - (period-position)) % period == 0
}

// parse the input to generate an array of disc functions
let lines = input.split('\n')
let discs: Disc[] = []
for (let i = 0; i < lines.length; i++){
    let parts = lines[i].split(' ')
    let period = parseInt(parts[3])
    let position = parseInt(parts[11].slice(0,-1))
    // the disc number conveniently maps to the seconds it will
    // take for the capsule to reach the disc so drop = disc number
    discs.push(disc(i+1, period, position))
}

/*
    finds the first time that results the capsule falling through
    every disc in the provided array
*/
function solve(discs: Disc[]): number{
    let t = 0
    while(true){
        if (discs.every(d => d(t))){
            return t
        }
        t++
    }
}

console.log('Part 1:', solve(discs))

discs.push(disc(discs.length + 1, 11, 0))
console.log('Part 2:', solve(discs))