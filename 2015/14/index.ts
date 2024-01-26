import input from './input.txt'

class Reindeer {
    name: string
    velocity: number
    endurance: number
    rest: number
    points: number

    constructor(n: string, v: number, e: number, r: number){
        this.name = n
        this.velocity = v
        this.endurance = e
        this.rest = r
        this.points = 0
    }

    distance(time: number): number{
        const sprints = Math.floor(time / (this.endurance + this.rest))
        const remainder = time - ((this.endurance+this.rest) * sprints)
        const interval = Math.min(this.endurance, remainder)
        const dist = this.velocity * (sprints * this.endurance + interval)
        return dist
    }

    static parse(line: string): Reindeer{
        const parts = line.split(' ')
        const n = parts[0]
        const v = parseInt(parts[3])
        const e = parseInt(parts[6])
        const r = parseInt(parts[13])
        return new Reindeer(n,v,e,r)
    }
}

const reindeer: Reindeer[] = input.split('\n').map(l => Reindeer.parse(l))

const time = 2503
const part1 = Math.max(...reindeer.map( r => r.distance(time)))
console.log('Part 1:', part1)

for (let t = 1; t <= time; t++){
    let d = reindeer.map( r => r.distance(t) )
    let max = Math.max(...d)
    for (let i = 0; i < d.length; i++){
        if (d[i] == max){
            reindeer[i].points++
        }
    }
}

const part2 = Math.max(...reindeer.map( r => r.points ))
console.log('Part 2:', part2)