import instructions from './input.txt'

interface Instruction {
    line: number
    register?: string
    offset?: number
    // determines the new value for a register r
    apply?: (m: Memory) => void
    // determines the next line number to execute
    next: (m: Memory) => number
}

type Program = Instruction[]
class Memory extends Map<string, number> {
    get(key: string) {
        if (!this.has(key)) {
            this.set(key, 0)
        }
        return super.get(key)
    }
}

function compile(): Program{
    let program: Instruction[] = []
    let lines = instructions.split("\n")
    for(let line = 0; line < lines.length; line++){
        let instruction = lines[line]
        if(instruction.startsWith('hlf')){
            let [_, r] = instruction.split(' ')
            program.push({
                line: line,
                register: r,
                apply: function(m: Memory){
                    let r = m.get(this.register!)!
                    m.set(this.register!, r / 2)
                },
                next: function(){
                    return this.line + 1
                } 
            })
        }
        if(instruction.startsWith('tpl')){
            let [_, r] = instruction.split(' ')
            program.push({
                line: line,
                register: r,
                apply: function(m: Memory){
                    let r = m.get(this.register!)! 
                    m.set(this.register!, r * 3)
                },
                next: () => line + 1
            })
        }
        if(instruction.startsWith('inc')){
            let [_, r] = instruction.split(' ')
            program.push({
                line: line,
                register: r,
                apply: function(m: Memory){
                    let r = m.get(this.register!)! 
                    m.set(this.register!, r + 1)
                },
                next: () => line + 1
            })
        }
        if(instruction.startsWith('jmp')){
            let [_, offset] = instruction.split(' ')
            program.push({
                line: line,
                offset: parseInt(offset),
                next: function(m: Memory){
                    return this.line + this.offset!
                }
            })
        }
        if(instruction.startsWith('jie')){
            let [_, r, offset] = instruction.split(' ')
            r = r.slice(0,-1)
            program.push({
                line: line,
                register: r,
                offset: parseInt(offset),
                next: function(m: Memory){
                    let r = m.get(this.register!)!
                    if(r % 2 == 0){
                        return this.line + this.offset!
                    } else { 
                        return this.line + 1
                    }
                }
            })
        }
        if(instruction.startsWith('jio')){
            let [_, r, offset] = instruction.split(' ')
            r = r.slice(0,-1)
            program.push({
                line: line,
                register: r,
                offset: parseInt(offset),
                next: function(m: Memory){
                    let r = m.get(this.register!)!
                    if(r == 1){
                        return this.line + this.offset!
                    } else { 
                        return this.line + 1
                    }
                }
            })
        }
    }
    return program
}

function execute(program: Program, memory: Memory){
    let line = 0
    while(line < program.length){
        let instruction = program[line]
        if(instruction.apply){
            instruction.apply(memory)
        }
        line = instruction.next(memory)
    }
}

let program = compile()
let memory = new Memory()

execute(program, memory)
console.log('Part 1:', memory.get('b'))

memory.clear()
memory.set('a', 1)
execute(program, memory)
console.log('Part 2:', memory.get('b'))