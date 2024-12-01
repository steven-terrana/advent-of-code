import fs from 'fs'
import { init } from "z3-solver"

class HailStone{
  constructor(origin, velocity){
    this.origin = origin
    this.velocity = velocity
  }
  /*
    determines if this hailstone will intersect
    with another and if that intersection will
    happen in the future
  */
  intersect(stone){
    let ma = (this.velocity[1] / this.velocity[0])
    let x_a = this.origin[0]
    let y_a = this.origin[1]

    let mb = (stone.velocity[1] / stone.velocity[0])
    let x_b = stone.origin[0]
    let y_b = stone.origin[1]
    
    let x = (ma * x_a  - mb * x_b + y_b - y_a) / (ma - mb)
    let y = ma * (x - x_a) + y_a
    
    let t_a = (x - x_a) / this.velocity[0]
    let t_b = (x - x_b) / stone.velocity[0]
    let isFuture = t_a > 0 && t_b > 0
    
    return [x, y, isFuture]
  }

  static parse(line){
    let origin, velocity
    [origin, velocity] = line.split('@')
    origin = origin.split(', ').map( o => parseInt(o.trim()))
    velocity = velocity.split(', ').map( v => parseInt(v.trim()))
    return new HailStone(origin, velocity)
  }
}

function parse(){
  let file
  [file] = process.argv.slice(2)
  file = file ?? 'test.txt'
  let input = fs.readFileSync(file, 'utf-8').split('\n')
  let stones = input.map( line => HailStone.parse(line) )
  return stones
}

let stones = parse()

let lower = 200000000000000
let upper = 400000000000000

const inArea = (x,y) => ( lower < x && x <= upper && lower < y && y <= upper )

/*
  for each pair of stones, check for an intersection.
  if that intersection is in the test area and in
  the future, increment the counter.
*/
let counter = 0
for (let i = 0; i < stones.length; i++){
  let A = stones[i]
  for (let B of stones.slice(i+1)){
    let x,y,isFuture
    [x, y, isFuture] = A.intersect(B)
    if (inArea(x,y) && isFuture){
      counter++
    }
  }
}
console.log('Part 1:', counter)

const { Context, em } = await init();
const { Solver, Int } = new Context('main');
let solver = new Solver()

const x = Int.const('x')
const y = Int.const('y')
const z = Int.const('z')
const vx = Int.const('vx')
const vy = Int.const('vy')
const vz = Int.const('vz')

const func = (stone, t) => {
  return [
    x.add(vx.mul(t)).sub(stone.origin[0]).sub(t.mul(stone.velocity[0])).eq(0),
    y.add(vy.mul(t)).sub(stone.origin[1]).sub(t.mul(stone.velocity[1])).eq(0),
    z.add(vz.mul(t)).sub(stone.origin[2]).sub(t.mul(stone.velocity[2])).eq(0)
  ]
}

for (let i = 0; i < 3; i++){
  let stone = stones[i]
  solver.add(...func(stone, Int.const(`t_${i}`)))
}

let result = await solver.check()
if (result == 'sat'){
  let model = solver.model()
  console.log('Part 2:', model.get(x).value() + model.get(y).value() + model.get(z).value())
} else {
  console.log("not solved")
}
em.PThread.terminateAllThreads()
