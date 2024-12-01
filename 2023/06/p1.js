import fs from 'fs'

class Race {
  constructor(duration, record){
    this.duration = duration
    this.record = record
  }
}

function parseRaces(file){
  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  let duration = Array.from(lines[0].matchAll(/\d+/g)).map(n => parseInt(n))
  let record = Array.from(lines[1].matchAll(/\d+/g)).map(n => parseInt(n))
  let races = []
  for (let i=0; i < duration.length; i++){
    races.push(new Race(duration[i], record[i]))
  }
  return races
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


let races = parseRaces('input.txt')
let v = 1
let result = races.reduce( (r, race) => r *= findWaysToWin(v, race), 1)
console.log(result)