import input from './input.txt'

class AuntSue{
    id: number
    children?: number
    cats?: number
    samoyeds?: number
    pomeranians?: number
    akitas?: number
    vizslas?: number
    goldfish?: number
    trees?: number
    cars?: number
    perfumes?: number

    constructor(id: number, data: Partial<AuntSue>){
        this.id = id
        Object.assign(this, data)
    }

    equals(aunt: Partial<AuntSue>, lessThan: Array<keyof AuntSue>=[], greaterThan: Array<keyof AuntSue>=[]): boolean {
        for(let property of Object.keys(aunt)){
            const a = this[property as keyof AuntSue]!
            const b = aunt[property as keyof AuntSue]!
            if (a != undefined){
                if (greaterThan.includes(property as keyof AuntSue)){
                    if (a > b){
                        return false
                    }
                } else if (lessThan.includes(property as keyof AuntSue)) {
                    if (a < b){
                        return false
                    }
                } else {
                    if (a != b){
                        return false
                    }
                }
            }
        }
        return true
    }

    static parse(line: string){
        let parts = line.split(' ')
        const id = parseInt(parts[1].slice(0,-1))
        let chunks = parts.slice(2).join(' ').split(',')
        let partial: any = {}
        for (let chunk of chunks){
            let prop, n
            [prop, n] = chunk.split(':').map(p => p.trim())
            n = parseInt(n)
            partial[prop] = n
        }
        return new AuntSue(id, partial as Partial<AuntSue>)
    }
}

let aunts: AuntSue[] = []
for (let line of input.split('\n')){
    aunts.push(AuntSue.parse(line))
}

let lookingFor = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
}

let aunt = aunts.find(a => a.equals(lookingFor))
console.log('Part 1:', aunt?.id)

aunt = aunts.find(a => a.equals(lookingFor, ['cats', 'trees'], ['pomeranians', 'goldfish']))
console.log('Part 2:', aunt?.id)