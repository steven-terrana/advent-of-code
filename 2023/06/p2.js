import fs from 'fs'

class Race {
  constructor(duration, record){
    this.duration = duration
    this.record = record
  }
}

function parseRace(file){
  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  let duration = parseInt(Array.from(lines[0].matchAll(/\d+/g)).join(''))
  let record = parseInt(Array.from(lines[1].matchAll(/\d+/g)).join(''))
  return new Race(duration, record)
}

// T = how long the race lasts
// t = how long you've held down the button
// v = velocity per t
// returns distance traveled
export function calculateDistance(v, t, T){
  return (T - t) * (v * t)
}

// iterates over each option given T and 
// returns the number of options that are winners
export function findWaysToWin(v, race) {
  let options = []
  for (let t = 0; t < race.duration; t++){
    options.push(t)
  }
  let winners = options.map( t => calculateDistance(v, t, race.duration) ).filter( d => d > race.record )
  return winners.length
}


let race = parseRace('input.txt')
let v = 1
let result = findWaysToWin(v, race)
console.log(result)