import fs from 'fs'

function predictValue(reading){
  if (reading.every(r => r == 0)){
    return [0, ...reading]
  }
  let diffs = reading.slice(1).map( (r, idx) => r - reading[idx])
  let n = predictValue(diffs)
  return [reading[0] - n[0], ...reading]
}

function parseReadings(file){
  let lines = fs.readFileSync(file,'utf-8').split('\n')
  let readings = []
  lines.forEach( line => {
    let numbers = Array.from(line.matchAll(/-?\d+/g))
    readings.push(numbers.map( n => parseInt(n)) )
  })
  return readings
}

let readings = parseReadings('test.txt')
let total = readings.reduce( (sum, r) => sum += predictValue(r)[0], 0)
console.log(total)