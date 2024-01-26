
interface Elf {
    id: number
    presents: number
}

type Party = Elf[]

function invite(n: number): Party{
    let party: Party = []
    Array(n).fill(0).forEach((_, idx) => party.push({ id: idx+1, presents: 1 }))
    return party
} 

function whiteElephant(party: Party, takeFrom: (p: Party)=>Elf): Elf{
    while(party.length > 1){
        takeFrom(party)
        party.push(party.shift()!)
    }
    return party[0]
}


let part1 = whiteElephant(invite(3014387), (p: Party) => p.splice(1, 1)[0] )
console.log('Part 1:', part1.id)

// super slow.. need to optimize. there's probably a formula for the nth elf to remove
let part2 = whiteElephant(invite(3014387), (p: Party) => {
    let elf = p.splice(Math.floor(p.length/2), 1)[0] 
    console.log(elf.id)
    return elf
})
console.log('Part 2:', part2.id)