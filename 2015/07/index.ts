import input from './input.txt'

type Node = string
type Operation = 'ASSIGN' | 'AND' | 'OR' | 'LSHIFT' | 'RSHIFT' | 'NOT'
type Instruction = {
    op: Operation,
    left: Node, 
    right: Node | undefined
}

function parseInstructions() {
    const instructions = new Map<Node, Instruction>

    for (const line of input.split('\n')){
        const parts = line.split(' ')
        let left, op, right, output

        if (parts.length === 3) {
            // Direct assignment
            op = 'ASSIGN'
            left = parts[0]
            output = parts[2]
        } else if (parts.length === 4) {
            // NOT operation
            op = 'NOT'
            left = parts[1]
            output = parts[3]
        } else {
            // Binary operation (AND, OR, LSHIFT, RSHIFT)
            left = parts[0]
            op = parts[1]
            right = parts[2]
            output = parts[4]
        }

        instructions.set(output, {
            op: op as Operation,
            left: left,
            right: right
        })
    }

    return instructions
}

const cache = new Map<Node, number>
const instructions = parseInstructions()
function getValue(node: Node): number {
    const n = parseInt(node)
    if (!isNaN(n)) {
        return n
    }

    if (cache.has(node)) {
        return cache.get(node)!
    }

    const instr: Instruction = instructions.get(node)!

    let value
    switch (instr.op) {
        case 'AND':
            value = getValue(instr.left) & getValue(instr.right!)
            break
        case 'OR':
            value = getValue(instr.left) | getValue(instr.right!)
            break
        case 'LSHIFT':
            value = getValue(instr.left) << getValue(instr.right!)
            break
        case 'RSHIFT':
            value = getValue(instr.left) >>> getValue(instr.right!)
            break
        case 'NOT':
            value = ~getValue(instr.left) & 0xFFFF
            break
        case 'ASSIGN':
            value = getValue(instr.left)
            break
        default:
            throw new Error(`Unknown operation: ${instr.op}`)
    }

    cache.set(node, value)
    return value
}

const result = new Map<Node, number>
for (let instruction of instructions) {
    let node = instruction[0]
    result.set(node, getValue(node))
}

const part1 = result.get('a')!
console.log('Part 1:', part1)

cache.clear()
result.clear()
// override the value of b by setting the value in the cache. 
// This works even if we didn't know that 'b' is a direct assignment
cache.set('b', part1)

let b = instructions.get('b')!
b.left = part1.toString()
for (let instruction of instructions) {
    let node = instruction[0]
    result.set(node, getValue(node))
}

const part2 = result.get('a')!
console.log('Part 2:', part2)