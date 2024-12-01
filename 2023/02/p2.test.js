const { sumPower, calculatePower, fewestCubes } = require('./p2.js')

// the example provides us with the expected fewest
// cubes for each color and the power calculation for
// the game
data = [
  {
    game: "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
    id: 1,
    red: 4, 
    green: 2, 
    blue: 6, 
    power: 48
  },
  {
    game: "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
    id: 2,
    red: 1, 
    green: 3, 
    blue: 4, 
    power: 12
  },
  {
    game: "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
    id: 3,
    red: 20, 
    green: 13, 
    blue: 6, 
    power: 1560
  },
  {
    game: "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
    id: 4,
    red: 14, 
    green: 3, 
    blue: 15, 
    power: 630
  },
  {
    game: "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
    id: 5,
    red: 6, 
    green: 3, 
    blue: 2, 
    power: 36
  }
]

describe('determine fewest cubes needed',() => {
  test.each(data)('game $id requires a minimum of $red red cubes', ({id, game, red}) => {
    expect(fewestCubes(game, 'red')).toBe(red)
  })
  test.each(data)('game $id requires a minimum of $blue blue cubes', ({id, game, blue}) => {
    expect(fewestCubes(game, 'blue')).toBe(blue)
  })
  test.each(data)('game $id requires a minimum of $green green cubes', ({id, game, green}) => {
    expect(fewestCubes(game, 'green')).toBe(green)
  })
})

describe('validate game power', () => {
  test.each(data)('game $id has power $power', ({id, game, power}) => {
    expect(calculatePower(game)).toBe(power)
  })
})

test.each([{'power': 2286}])('total power is $power', ({power}) => {
  games = data.map( g => g.game )
  expect(sumPower(games)).toBe(power)
})