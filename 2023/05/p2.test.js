import fs from 'fs'
import { parseSystem, simplifySystem } from "./p2"

let input = fs.readFileSync('test.txt', 'utf-8').split("\n\n")
let system = parseSystem(input)

function getPieceWise(system, from, to){
  let piecewise = system.find( p => (p.from == from && p.to == to))
  return piecewise
}

let data = [
  { seed: 79, soil: 81, fertilizer: 81, water: 81, light: 74, temperature: 78, humidity: 78, location: 82 },
  { seed: 14, soil: 14, fertilizer: 53, water: 49, light: 42, temperature: 42, humidity: 43, location: 43 },
  { seed: 55, soil: 57, fertilizer: 57, water: 53, light: 46, temperature: 82, humidity: 82, location: 86 },
  { seed: 13, soil: 13, fertilizer: 52, water: 41, light: 34, temperature: 34, humidity: 35, location: 35 }
]

let keys = Object.keys(data[0])

for (let i = 0; i < keys.length - 2; i++){
  let from = keys[i]
  let to = keys[i+1]
  describe(`${from} to ${to}`, (input, output) => {
    test.each(data)(`${from} $input corresponds to ${to} $output`, ({input, output}) => {
       expect(getPieceWise(system, from, to).evaluate(input)).toBe(output)
    })
  })
}

describe('composite function works as expected', () => {
  let composite = simplifySystem(system)
  test.each(data)('composite function translates seed $seed to location $location', ({seed, location}) => {
    expect(composite.evaluate(seed)).toBe(location)
  })
})