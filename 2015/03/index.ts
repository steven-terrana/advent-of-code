import instructions from './input.txt'

export type Arrow = '^' | 'v' | '>' | '<'
type shift = -1 | 0 | 1

interface Direction {
    x: shift, 
    y: shift
}

const directions: Record<Arrow, Direction> = {
    '^': {
        x: 0,
        y: 1
    },
    'v': { 
        x: 0, 
        y: -1
    }, 
    '<': {
        x: -1, 
        y: 0
    }, 
    '>': {
        x: 1, 
        y: 0
    }
}

export function part1(_instructions: Arrow[]): number{
    let startingPoint = [0, 0]
    let homes : Set<string> = new Set([JSON.stringify(startingPoint)])
    let x: number = 0
    let y: number = 0
    let instructions = _instructions.slice()
    while(instructions.length > 0){
        let i: Arrow = instructions.shift()!
        x += directions[i].x
        y += directions[i].y
        homes.add(JSON.stringify([x, y]))
    }
    return homes.size
}

export function part2(_instructions: Arrow[]): number{
    let startingPoint = [0, 0]
    let homes : Set<string> = new Set([JSON.stringify(startingPoint)])
    let x: number = 0
    let y: number = 0
    let x2: number = 0
    let y2: number = 0
    let santa = true
    let instructions = _instructions.slice()
    while(instructions.length > 0){
        let i: Arrow = instructions.shift()!
        if(santa){
            x += directions[i].x
            y += directions[i].y
            homes.add(JSON.stringify([x, y]))
        } else {
            x2 += directions[i].x
            y2 += directions[i].y
            homes.add(JSON.stringify([x2, y2]))
        }
        santa = !santa
    }
    return homes.size
}

if (import.meta.main) {
    let i: Arrow[] = instructions.split('') as Arrow[]
    console.log('Part 1:', part1(i))
    console.log('Part 2:', part2(i))
}