import input from './input.txt'

type Operation = 'on' | 'off' | 'toggle'

function manipulate(bits: bigint, operation: Operation, startIndex: number, endIndex: number): bigint {
    if (startIndex < 0 || startIndex > endIndex) {
        console.log(startIndex, endIndex)
        throw new Error("Invalid start or end index");
    }
    let bitmask = (1n << BigInt(endIndex - startIndex + 1)) - 1n;
    bitmask <<= BigInt(startIndex);

    if(operation == 'on'){
        return bits | bitmask
    }
    if(operation == 'off'){
        return bits & ~bitmask
    }
    if(operation == 'toggle'){          
        return bits ^ bitmask
    }
}

function on(bits: bigint, startIndex: number, endIndex: number): bigint{
    return manipulate(bits, 'on', startIndex, endIndex)
}
function off(bits: bigint, startIndex: number, endIndex: number): bigint{
    return manipulate(bits, 'off', startIndex, endIndex)
}
function toggle(bits: bigint, startIndex: number, endIndex: number): bigint{
    return manipulate(bits, 'toggle', startIndex, endIndex)
}

// using a technique called Brian Kernighan’s Algorithm, which 
// repeatedly flips the least significant set bit of a number 
// and counts how many times this is done until the number 
// becomes zero.
function countOnBits(bits: bigint): number {
    let count = 0;
    while (bits) {
        bits &= bits - 1n;
        count++;
    }
    return count;
}

let bits: bigint[] = Array(1000).fill(0n)

for (let instruction of input.split('\n')){
    let rStart, cStart, rEnd, cEnd
    [rStart, cStart, rEnd, cEnd] = Array.from(instruction.matchAll(/\d+/g)).map(n => parseInt(n))
    for (let i = rStart; i <= rEnd; i++){
        if (instruction.includes('on')){
            bits[i] = on(bits[i], cStart, cEnd)
        }
        if (instruction.includes('off')){
            bits[i] = off(bits[i], cStart, cEnd)
        }
        if (instruction.includes('toggle')){
            bits[i] = toggle(bits[i], cStart, cEnd)
        }
    }
}

let lit = bits.reduce( (sum, b) => sum + countOnBits(b), 0)
console.log('Part 1:', lit)

let bits2 = Array.from(Array(1000), _ => Array(1000).fill(0));

for (let instruction of input.split('\n')){
    let rStart, cStart, rEnd, cEnd
    [rStart, cStart, rEnd, cEnd] = Array.from(instruction.matchAll(/\d+/g)).map(n => parseInt(n))
    for (let i = rStart; i <= rEnd; i++){
        for (let j = cStart; j <= cEnd; j++){
            if (instruction.includes('on')){
                bits2[i][j] += 1
            }
            if (instruction.includes('off')){
                bits2[i][j] = Math.max(bits2[i][j] - 1, 0)
            }
            if (instruction.includes('toggle')){
                bits2[i][j] += 2
            }
        }
    }
}

let counter = 0
for (let i = 0; i < 1000; i++){
    for (let j = 0; j < 1000; j++){
        counter += bits2[i][j]
    }
}
console.log('Part 2:', counter)