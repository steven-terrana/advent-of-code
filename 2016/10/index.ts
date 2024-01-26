import input from './test.txt'

interface ChipReceiver {
    id: string
    chips: number[]
    low?: string
    high?: string
}

class Receivers extends Map<string, ChipReceiver> {
    get(id: string) {
        if (!this.has(id)) {
            this.set(id, {id, chips: []})
        }
        return super.get(id)
    }
    give(id: string, chip: number){
        let r = this.get(id)!
        if(r.id == undefined){
            throw new Error('should not be possible')
        }
        r.chips.push(chip)
        r.chips.sort( (a,b) => a - b)
        if(r.id.includes('bot') && r.chips.length == 2){
            if(r.chips.includes(61) && r.chips.includes(17)){
                console.log('Part 1:', r.id)
            }
            this.give(r.low!, r.chips.shift()!)
            this.give(r.high!, r.chips.shift()!)
        }
    }
}

let receivers = new Receivers()
let lines = input.split('\n')

// figure out hand offs before triggering the chain reaction
lines.filter(l => l.startsWith('bot')).forEach( line => {
    let parts = line.split(' ')
    Object.assign(receivers.get(`bot ${parts[1]}`)!, {
        low: `${parts[5]} ${parts[6]}`,
        high: `${parts[10]} ${parts[11]}`
    })
})

// start handing out chips
lines.filter(l => l.startsWith('value')).forEach( line => {
    let parts = line.split(' ')
    receivers.give(`bot ${parts[5]}`, parseInt(parts[1]))
})

let part2 = ([0, 1, 2])
    .map(id => receivers.get(`output ${id}`)!.chips)
    .flat()
    .reduce( (product, c) => product * c, 1)

console.log('Part 2:', part2)