import input from './input.txt'

type Codex = Map<string, string[]>

function parse(): [Codex, string]{
    let parts = input.split('\n\n')
    let substs, msg
    [substs, msg] = parts
    let substitutions: Codex = new Map<string, string[]>
    for (let s of substs.split('\n')){
        let input, output
        [input, output] = s.split(' => ')
        if (!substitutions.has(input)){
            substitutions.set(input, [])
        }
        substitutions.get(input)?.push(output)
    }
    return [substitutions, msg]
}

let codex: Codex
let msg: string
[codex, msg] = parse()

let distinct = new Set<string>

for (let [key,replacements] of codex.entries()){
    let regex = new RegExp(key, 'g')
    let matches = Array.from(msg.matchAll(regex))
    for (let m of matches){
        for (let r of replacements){
            let molecule = msg.slice(0, m.index) + r + msg.slice(m.index! + key.length)
            distinct.add(molecule)
        }
    }
}

console.log('Part 1:', distinct.size)


function invertCodex(codex: Codex): string[][] {
    let inverted: string[][] = []
    for (let [key,replacements] of codex.entries()){
        for (let r of replacements){
            inverted.push([r, key])
        }
    }
    return inverted
}

let productions = invertCodex(codex)

interface Sortable{
    sort: (f: Function) => void
}
const shuffle = (array: Sortable) => array.sort(() => Math.random() - 0.5)
let molecule = msg
let part2 = 0

/*
    works backwards from the target molecule to 'e'
    perform a greedy algorithm that iterates over each rule and replaces
    all occurences of the production at once.

    sometimes, this approach will get "stuck" when we go down a path that
    isn't valid. When this happens, shuffle the order of substituion and
    try again.
*/
while(molecule != 'e'){
    let tmp = molecule.slice()
    productions.forEach(rule=>{
        let [a, b] = rule
        if(molecule.includes(a)){
            let matches = Array.from(molecule.matchAll(new RegExp(a, 'g'))).length
            molecule = molecule.replaceAll(a, b)
            part2 += matches
        }
    })
    // we got stuck! start again with a new production order
    if(tmp == molecule){
        molecule = msg
        shuffle(productions)
        part2 = 0
    }
}

console.log('Part 2:', part2)
