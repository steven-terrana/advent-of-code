const { sumPossibleGameIds, getId, gameIsPossible, } = require('./p1.js')

games = [
  "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
  "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
  "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
  "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
  "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green"
]

test('sum of possible game ids is 8', () => {
  expect(sumPossibleGameIds(games)).toBe(8);
});

test('getId returns correct values', () => {
  games.forEach( (game, idx) => {
    expect(getId(game)).toBe(idx+1)
  })
})

test.each([1, 2, 5])('game %i is possible', (g) => {
  expect(gameIsPossible(games[g-1]))
})

test.each([3, 4])('game %i is impossible', (g) => {
  expect(gameIsPossible(games[g-1])).not.toBe(true)
})