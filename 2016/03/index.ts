import input from './input.txt'

type Triangle = [number, number, number]

function countValid(triangles: Triangle[]): number {
    let valid = 0
    for(let t of triangles){
        const [a,b,c] = t
        if(a < (b+c) && b < (a + c) && c < (a+b)){
            valid++
        }
    }
    return valid
}

// each row is a triangle
let part1Triangles: Triangle[] = input.split('\n').map(line => {
    return Array.from(line.matchAll(/\d+/g)).map(n => parseInt(n[0])) as Triangle
})
console.log('Part 1:', countValid(part1Triangles))

let sides: number[] = []
input.split('\n').forEach(line => {
    sides.push(...Array.from(line.matchAll(/\d+/g)).map(n => parseInt(n[0])))
})

// for part 2, each column is independent and triangles are chunks of 3
let t1: number[] = []
let t2: number[] = []
let t3: number[] = []
let part2Triangles: Triangle[] = []
for (let i = 0; i < sides.length; i+=3){
    t1.push(sides[i])
    t2.push(sides[i+1])
    t3.push(sides[i+2])
    if(t1.length == 3){
        part2Triangles.push(t1 as Triangle, t2 as Triangle, t3 as Triangle)
        t1=[]
        t2=[]
        t3=[]
    }
}
console.log('Part 2:', countValid(part2Triangles))