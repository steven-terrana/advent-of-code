import input from './input.txt'

let alphabet: string[] = []
for (let c = 97; c < (97+26); c++){
    alphabet.push(String.fromCharCode(c))
}

class Room {
    name: string
    sector: number
    hash: string[]

    constructor(name: string, sector: number, hash: string[]){
        this.name = name
        this.sector = sector
        this.hash = hash
    }

    decrypt(): string{
        let decrypted = ''
        for (let c of this.name.split('')){
            if(c == '-'){
                decrypted += ' '
            } else {
                decrypted += alphabet[(alphabet.indexOf(c) + this.sector) % 26]
            }
        }
        return decrypted
    }

    isValid(): boolean{
        let occurences = new Map<string, number>
        for (let c of this.name.split('')){
            if(c == '-'){
                continue
            }
            if (occurences.has(c)){
                let o = occurences.get(c)!
                occurences.set(c, o+1)
            } else {
                occurences.set(c, 1)
            }
        }
        const comparator = (a: [string, number],b: [string, number]) => {
            if (a[1] != b[1]){
                // sort by character occurence
                return b[1] - a[1]
            } else {
                // tiebreaker is characters sorted alphabetically
                return b[0] < a[0] ? 1 : -1
            }
        }
        const sorted = [...occurences].sort(comparator)
        return this.hash.every( (h, i) => h == sorted[i][0] )
    }

    static parse(room: string){
        const r = /(?<room>.*)-(?<sector>.*)\[(?<hash>.*)\]$/g
        const [_, name, sector, hash] = room.matchAll(r).next().value
        return new Room(
            name,
            parseInt(sector),
            Array.from(hash)
        )
    }
}

let rooms: Room[] = input.split('\n').map(line => Room.parse(line))

let part1 = rooms
    .filter(r => r.isValid())
    .reduce( (s, r) => s + r.sector, 0)

console.log('Part 1:', part1)

// trial and error to find a query that finds a room
let room = rooms.find(r => r.decrypt().includes('pole'))
console.log('Part 2:', room?.decrypt(), room?.sector)