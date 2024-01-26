import instructions from './input.txt'
import part1_keypad from './part1.txt'
import part2_keypad from './part2.txt'

interface Button {
    v: string,
    L?: () => Button,
    R?: () => Button,
    D?: () => Button,
    U?: () => Button,
}
interface Direction {
    n: 'L'|'R'|'U'|'D',
    row: number, 
    col: number
}
type Keypad = Map<string, Button>

function parseKeypad(input: string): Keypad{
    let keypad: Keypad = new Map<string, Button>
    let lines = input.split('\n')
    let R = lines.length
    let C = Math.max(...lines.map(l => l.length))
    lines = lines.map(l => l.padEnd(C, ' '))
    const directions: Direction[]= [
        {n: 'L', row:  0, col: -2},
        {n: 'R', row:  0, col:  2},
        {n: 'U', row: -1, col:  0},
        {n: 'D', row:  1, col:  0}
    ]
    for(let row = 0; row < R; row++){
        let line = lines[row]
        for(let col = 0; col < C; col++){
            let c = line[col]
            if (c != ' '){
                keypad.set(c, { v: c })
                for(let d of directions){
                    let _row = row + d.row
                    let _col = col + d.col                  
                    if(!(0 <= _row && _row < R && 0 <= _col && _col < C)){
                        continue
                    }                    
                    let neighbor = lines[_row][_col]
                    if (neighbor != ' '){
                       let b = keypad.get(c)!
                       b[d.n]! = () => keypad.get(neighbor)!
                    }
                }
            }
        }
    }
    return keypad
}

function solve(keypad: Keypad, startButton: string='5'): string{
    let code = []
    let button = keypad.get(startButton)!
    if(button == undefined){
        throw new Error(`Keypad does not have button: ${startButton}`)
    }
    for (let line of instructions.split('\n')){
        for (let m of Array.from(line)){
            if (m in button){
                button = button[m]()
            }
        }
        code.push(button.v)
    }
    return code.join('')
}

let p1 = parseKeypad(part1_keypad)
console.log('Part 1:', solve(p1))

let p2 = parseKeypad(part2_keypad)
console.log('Part 2:', solve(p2))