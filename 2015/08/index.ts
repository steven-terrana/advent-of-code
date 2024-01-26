// read input as a list of character codes (a Buffer)
let file = Bun.file('input.txt')
const arrbuf = await file.arrayBuffer()
const buffer = Buffer.from(arrbuf)

// we can disregard new lines for part 1.
// --> the char code of \n is 10, so filter it out
// the length of the remaining list is the raw string length
let inCode = buffer.filter(c => c != 10).length

// evaluate the line of code to get the actual line
// without escaped characters
let inMemory = 0
for(let line of String(buffer).split('\n')){
    inMemory += eval(line).length
}

console.log('Part 1:', inCode - inMemory)

// for part 2, we need to determine the length of
// the escaped string representation of each line.
// we don't have to actually figure out how to escape
// the string we just need to count the length of the
// escaped strings in total. We can do this by iterating
// over the buffer and adding an extra character when we
// stumble on characters that need escaping (" or \) and
// wrapping each newline (10) in quotations (+2 characters)
let escaped = 0
for (let i = 0; i < buffer.length; i++){
    // 34 = ", 94 = \, 10 = \n
    if (buffer[i] == 34 || buffer[i] == 92 || buffer[i] == 10){
        escaped += 2
    } else {
        // regular character
        escaped++
    }
}
escaped += 2 // wrap the last line in ""
console.log('Part 2:', escaped - inCode)