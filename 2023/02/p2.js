const { getLines } = require('../helpers')

// determines the least number of cubes required 
// for a particular color in a particular game
function fewestCubes(game, color){
  r = new RegExp(`(\\d+) ${color}`, 'g')
  dice = Array.from(game.matchAll(r)).map(match => Number(match[1]))
  return Math.max(...dice)
}

// calculates the power for a given game
function calculatePower(game){
  return ['red', 'green', 'blue'].reduce( (p, color) => p *= fewestCubes(game, color), 1)
}

function sumPower(games){
  return games.reduce( (sum, game) => sum += calculatePower(game), 0)
}

function main(){
  games = getLines('input.txt')
  console.log(sumPower(games))
}

// only run this when invoked directly
if (require.main === module) {
  main()
}

// for unit tests
module.exports= { sumPower, calculatePower, fewestCubes }