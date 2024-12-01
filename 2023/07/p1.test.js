import { Hand, parseHands, calculateTotalWinnings } from './p1'

test.each([
  {hand: "AAAAA", type: "five of a kind"},
  {hand: "AA8AA", type: "four of a kind"},
  {hand: "23332", type: "full house"},
  {hand: "TTT98", type: "three of a kind"},
  {hand: "23432", type: "two pair"},
  {hand: "23456", type: "high card"}
])("$hand is $type", ({hand, type}) =>{
  let h = Hand.fromString(hand)
  expect(h.type.name).toBe(type)
})

test.each([
  { lesser: "33332", greater: "2AAAA"},
  { lesser: "77888" , greater: "77788"}
])('$lesser is less than $greater', ({lesser, greater}) =>{
  expect(Hand.fromString(lesser) < Hand.fromString(greater))
})

describe('end to end', () => {
  let hands = parseHands('test.txt')
  hands.sort(Hand.compare)
  
  let sampleHand = [
    {cards: "32T3K", bid: 765, type: "one pair", rank: 1},
    {cards: "T55J5", bid: 684, type: "three of a kind", rank: 4},
    {cards: "KK677", bid: 28, type: "two pair", rank: 3},
    {cards: "KTJJT", bid: 220, type: "two pair", rank: 2},
    {cards: "QQQJA", bid: 483, type: "three of a kind", rank: 5}
  ]
  test.each(sampleHand)('$cards is a $type', ({cards, type}) => {
    expect(Hand.fromString(cards).type.name).toBe(type)
  })
  test.each(sampleHand)('$cards is rank $rank', ({cards, rank}) => {
    expect(hands[rank-1].cards.map(c => c.character).join('')).toBe(cards)
  })

  var winnings = 6440
  test(`winnings are ${winnings}`, () => {
    expect(calculateTotalWinnings(hands)).toBe(winnings)
  })
})
