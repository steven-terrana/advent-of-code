import input from './input.txt'

// a map of maps, where the first key is the position index
// and the second key is a letter that appears at this 
// position - the value is the number of times this letter
// has been seen
let occurences = new Map<number, Map<string, number>>

// for each line..
for (let line of input.split('\n')){
    // for each character.. 
    for(let i = 0; i < line.length; i++){
        let c = line[i]
        // initialize the occurence map for this index if it doesn't exist
        if (!occurences.has(i)){
            occurences.set(i, new Map<string, number>)
        }
        // increment the counter for a character at this index
        if(occurences.get(i)?.has(c)){
            let o = occurences.get(i)?.get(c)!
            occurences.get(i)?.set(c, o+1)
        } else {
            occurences.get(i)?.set(c, 1)
        }
    }
}

let part1 = ''
for(let [_, counts] of occurences){
    part1 += [...counts].sort( (a,b) => b[1] - a[1] )[0][0]
}
console.log('Part 1:', part1)

let part2 = ''
for(let [_, counts] of occurences){
    part2 += [...counts].sort( (a,b) => a[1] - b[1] )[0][0]
}
console.log('Part 2:', part2)
