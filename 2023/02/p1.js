const { getLines } = require('../helpers')

// gets the number of dice in a subset for a given color
// returns 0 if this color dice isn't mentioned
function getDice(subset, color){
  r = new RegExp(`(\\d+) ${color}`)
  m = subset.match(r)
  return m ? Number(m[1]) : 0
}

max_dice = {
  'red': 12,
  'green': 13,
  'blue': 14
}
// determines if a subset is possible
function subsetIsPossible(subset){
  return Object.keys(max_dice).every( color => getDice(subset, color) <= max_dice[color])
}

// determines if a game is possible based on
// if each subset is possible
function gameIsPossible(game){
  subsets = getSubsets(game)
  return subsets.every(subsetIsPossible)
}

// gets the numeric game id
function getId(game){
  id = game.match(/(\d+):/)[1]
  return Number(id)
}

// gets the list of game subsets
function getSubsets(game){
  return game.split(":")[1].split(";")
}

// sums the numeric game ids from all possible games
function sumPossibleGameIds(games){
  sum = 0
  for (const game of games){
    if (gameIsPossible(game)){
      sum += getId(game)
    }
  }
  return sum
}

function main(){
  games = getLines('input.txt')
  console.log(sumPossibleGameIds(games))
}

// only run this when invoked directly
if (require.main === module) {
  main()
}

// for unit tests
module.exports= { sumPossibleGameIds, getId, getSubsets, gameIsPossible, subsetIsPossible, getDice }