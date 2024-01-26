let alphabet: string[] = []
for (let c = 97; c < (97+26); c++){
    alphabet.push(String.fromCharCode(c))
}

const confusing = ['i', 'o', 'l']
const confusingIndices = confusing.map(c => alphabet.indexOf(c))

function sequential(password: string): boolean {
    let p = Array.from(password)
    let s = 0
    let previous = p.shift()!
    while(p.length){
        let current = p.shift()!
        if (alphabet.indexOf(current) == alphabet.indexOf(previous) + 1){
            s++
        } else {
            s = 0
        }
        if (s == 2){
            return true
        }
        previous = current
    }
    return false
}

function noConfusingLetters(password: string): boolean{
    return !Array.from(password).some(c => confusing.includes(c))
}

function twiceInRow(x: string): boolean {
    const regex: RegExp = new RegExp('(.)\\1.*(.)\\2')
    return regex.test(x)
}

type Condition = (x: string) => boolean
function isValid(x: string, conditions: Condition[]): boolean{
    return conditions.every( c => c(x) )
}

function increment(password: string): string{
    let next = Array.from(password).map(c => alphabet.indexOf(c))
    next[next.length - 1]++
    // while any index is greater than 25, increment the previous slots
    while(next.some(c => c > 25)){
        let overflow = next.indexOf(26)
        next[overflow] = 0
        next[overflow - 1]++
        if (confusingIndices.includes(next[overflow - 1])){
            next[overflow - 1]++
        }
    }
    let p = next.map(c => alphabet[c]).join('')
    return p
}

function getNextPassword(password: string){
    while(true){
        password = increment(password)
        if(isValid(password, conditions)){
            break
        }
    }
    return password
}

const conditions = [noConfusingLetters, sequential, twiceInRow]

let password = 'hepxcrrq'
let part1 = getNextPassword(password)
console.log('Part 1:', part1)
let part2 = getNextPassword(part1)
console.log('Part 2:', part2)
