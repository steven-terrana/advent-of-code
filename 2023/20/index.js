import fs from 'fs'

/*
the flipflops are all basically bits that contribute
towards a counter with some fixed cycle . These counters all have different
cycles. rx will get sent a low pulse when hj is sent
a low pulse which is the least common multiple (LCM)
of the individual counters (rt, sl, fv, gk).

this picture explains it better..

                /--> bs ... -> rt -> jf -\
               /---> rq ... -> sl -> ks --\
broadcaster --x                            +-> hj -> rx
               \---> cn ... -> fv -> qs --/
                \--> bz ... -> gk -> gk -/
*/

class FlipFlop{
  static symbol = '%'
  constructor(id, targets){
    this.id = id
    this.targets = targets
    this.state = false
  }
  // - high pulses are ignored
  // - low pulses flip state and send a pulse
  //   matching the new state to the target
  pulse(p){
    let output = []
    if (!p.type){
      this.state = !this.state
      for (let t of this.targets){
        output.push({
          source: this.id, 
          type: this.state,
          target: t
        })
      }
    }
    return output
  }
  static parse(line){
    let id, targets
    [id, targets] = line.slice(1).split(" -> ")
    targets = targets.split(",").map(t=>t.trim())
    return new FlipFlop(id, targets)
  }
}

class Broadcaster{
  static symbol = 'b'
  constructor(targets){
    this.id = 'broadcaster'
    this.targets = targets
  }
  // sends the same pulse type to all targets
  pulse(p){
    return this.targets.map( t => {
      return {
        source: 'broadcaster',
        type: p.type,
        target: t
      }
    })
  }
  static parse(line){
    let targets
    targets = line.split(" -> ")[1].split(',').map( t => t.trim() )
    return new Broadcaster(targets)
  }
}

class Conjunction{
  static symbol = '&'
  constructor(id, targets){
    this.id = id 
    this.targets = targets
    this.memory = new Map()
  }
  addInput(input){
    this.memory.set(input, false)
  }
  isOn(){
    return !Array.from(this.memory.values()).every(v => v)
  }
  // sends an outbound pulse to all targets
  // pulse type is low if all inputs last pulse types were high
  // otherwise pulse type is high
  pulse(p){
    this.memory.set(p.source, p.type)
    let type = this.isOn()
    return this.targets.map(t => {
      return {
        source: this.id, 
        type: type,
        target: t
      }
    })
  }
  static parse(line){
    let id, targets
    [id, targets] = line.slice(1).split(" -> ")
    targets = targets.split(",").map( t => t.trim())
    return new Conjunction(id, targets)
  }
}

// returns a Map<module id, module>
// where module is either one of:
// FlipFlop, Broadcaster, or Conjunction
function parse(file){
  let input = fs.readFileSync(file, 'utf-8').split('\n')

  // parse the modules
  let kinds = [FlipFlop, Conjunction, Broadcaster]
  let modules = new Map()
  for (let line of input){
    // finds the module that parses this line
    let k = kinds.find( m => m.symbol == line[0] )
    let m = k.parse(line)
    modules.set(m.id, m)
  }
 
  // tell each Conjunctor which modules are inputs
  const getByType = (t) => Array.from(modules.values()).filter( m => m.constructor.name == t )
  let conjunctions = getByType('Conjunction')
  let flipflops = getByType('FlipFlop')
  for (let c of conjunctions){
    for (let f of [...flipflops, ...conjunctions]){
      if (f.targets.includes(c.id)){
        c.addInput(f.id)
      }
    }
  }
  return modules
}

// takes an id and a button press and
// updates the cycles lengths. if we've
// found a cycle length for everything 
// it returns true, otherwise false
function foundAllCycles(id, buttonPress){
  pressedIndices.get(id).push(buttonPress)
  // lets see if there are new cycles that have stabilized
  for (let p of pressedIndices){
    let id = p[0]
    if (pressedIndices.get(id).length < 2){
      continue
    }
    if(!cycles.has(id)){
      let diffs = p[1].slice(1).map( (a, i) => a - p[1][i] )
      // if the diffs have stabilized, we've found a cycle
      let last3 = diffs.slice(diffs.length-3, diffs.length)
      if (last3.every( d => d === last3[0])){
        console.log(`${id} has cycle length of ${last3[0]}`)
        cycles.set(id, last3[0])
      }
    }
  }

  let allKeys = Array.from(pressedIndices.keys())
  let determinedKeys = Array.from(cycles.keys())
  return allKeys.length === determinedKeys.length
}

let file
[file] = process.argv.slice(2)
file = file ?? 'test.txt'

let modules = parse(file)

let pulseCount = { true: 0, false: 0 }
let buttonPresses = 0
let pressedIndices = new Map()
let cycles = new Map()

// these were found by looking at the input
// check out notes.txt  for why
Array.from(['rt', 'sl','fv', 'gk']).forEach( id => {
  pressedIndices.set(id, [])
}) 

keepPressing: while(true){
  buttonPresses++  
  let queue = [{
    source: 'button',
    type: false,
    target: 'broadcaster'
  }]
  
  while(queue.length > 0){
    let pulse = queue.shift()
    pulseCount[pulse.type]++
    let m = modules.get(pulse.target)
    let next = m?.pulse(pulse) ?? []
    // if we haven't determined the cycle yet
    // then keep on tracking the pressed indices
    if (pressedIndices.has(m?.id)){
      if (!m.isOn()){
        if (foundAllCycles(m.id, buttonPresses)){
          break keepPressing
        }
      }
    }
    queue.push(...next)
  }

  if(buttonPresses === 1000){
    console.log('Part 1:', pulseCount[true] * pulseCount[false])
  }
}

const gcd = (a, b) => a ? gcd(b % a, a) : b
const lcm = (a, b) => a * b / gcd(a, b)

let total = Array.from(cycles.values()).reduce( (a,b) => lcm(a,b))
console.log('Part 2:', total)