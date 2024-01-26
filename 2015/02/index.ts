import presents from './input.txt'

export function calculatePaper(present: string): number{
    let l,w,h
    [l,w,h] = present.split('x').map(d => parseInt(d))
    let sides = [ l*w, l*h, w*h ]
    return sides.reduce( (sum, side) => sum + 2*side, 0) + Math.min(...sides)
}

export function calculateRibbon(present: string): number{
    let l,w,h
    [l,w,h] = present.split('x').map(d => parseInt(d))
    let faces = [ l+w, l+h, w+h ]
    return 2 * Math.min(...faces) + l*w*h
}

if (import.meta.main) {
    let part1 = presents.split('\n').reduce((sum, present) => sum + calculatePaper(present), 0)
    console.log('Part 1:', part1)

    let part2 = presents.split('\n').reduce((sum, present) => sum + calculateRibbon(present), 0)
    console.log('Part 2:', part2)
}