class Machine {
  public lights: boolean[]
  constructor(nLights: number, private required_lights: Set<number>, private buttons: number[][], private joltage: number[]){
    this.required_lights = required_lights
    this.buttons = buttons
    this.joltage = joltage
    this.lights = new Array(nLights).fill(false)
  }
  /**
   * pushes a button
   * @param b the button index to push
   */
  pushButton(b: number){
    for (let light of this.buttons[b]!){
      this.lights[light] = !this.lights[light]
    }
    // console.log(`   pushing button ${b}: ${this.buttons[b]} --> ${this.lights.map( l => l ? "#" : '.').join('')}`)
  }

  pushAll(): Machine[] {
    return this.buttons.map( (_, i) => {
      let m = new Machine(this.lights.length, this.required_lights, this.buttons, this.joltage)
      m.lights = structuredClone(this.lights)
      m.pushButton(i)
      return m
    })
  }

  isOn(){
    for(let i = 0; i <= this.lights.length; i++){
      if (this.lights[i]){
        // if it's on, make sure it's supposed to be on
        if (!this.required_lights.has(i)){
          return false
        }
      } else {
        // if it's off, make sure it's supposed to be off
        if (this.required_lights.has(i)){
          return false
        }
      }
    }
    return true
  }

  static parse(line: string){
    const regex = /\[([^\]]+)\]\s+(.*?)\s+\{([^}]+)\}/;
    const match = line.match(regex); 

    const [, lights, parens, jolts] = match;
  
    const nLights = [...lights].length
    const required_lights = [...lights].map( (c,i) => c === "#" ? i : null).filter(i => i !== null )
    const buttons = parens.match(/\(([^)]+)\)/g)!.map((p) => p.slice(1, -1).split(",").map(Number));  
    const joltage = jolts.split(",").map(Number);

      return new Machine(nLights, new Set(required_lights), buttons, joltage);
  }
}

function hash(arr: boolean[]){
  return arr.map(b => b ? '1' : '0').join('')
}

function solve(m: Machine){

  let state = {
    machine: m,
    count: 0
  }

  let queue = [ state ]
  let seen = new Set<string>()


  while (queue.length){
    let s = queue.shift()
    // console.log(`machine state: ${s!.machine.lights.map( l => l ? "#" : '.').join('')} | ${s!.count}`)

    seen.add(hash(s!.machine.lights))

    if (s?.machine.isOn()){
      return s.count
    }
    
    for (let newMachine of s!.machine.pushAll()){
      if (seen.has(hash(newMachine.lights))){
        continue
      }
      queue.push({
        machine: newMachine, 
        count: s!.count + 1 
      })
    }
  }

}

const machines = await Bun.file('input.txt').text().then( text => {
  return text.split('\n').map(line => Machine.parse(line))
})

console.log(machines.reduce( (total, m) => total + solve(m), 0))