import {Card, scratchOffandCountPile} from './p2.js'

let data = [
  {
    card: "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
    id: 1,
    numbers: [41, 48, 83, 86, 17],
    winning_numbers: [83, 86, 6, 31, 17, 9, 48, 53],
    copies: 4
  },
  {
    card: "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19", 
    id: 2, 
    numbers: [13, 32, 20, 16, 61],
    winning_numbers: [61, 30, 68, 82, 17, 32, 24, 19],
    copies: 2
  },
  {
    card: "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
    id: 3,
    numbers: [1, 21, 53, 59, 44],
    winning_numbers: [69, 82, 63, 72, 16, 21, 14, 1],
    copies: 2
  },
  {
    card: "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
    id: 4,
    numbers: [41, 92, 73, 84, 69],
    winning_numbers: [59, 84, 76, 51, 58, 5, 54, 83],
    copies: 1
  },
  {
    card: "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
    id: 5,
    numbers: [87, 83, 26, 28, 32],
    winning_numbers: [88, 30, 70, 12, 93, 22, 82, 36], 
    copies: 0
  },
  {
    card: "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
    id: 6,
    numbers: [31, 18, 13, 56, 72],
    winning_numbers: [74, 77, 10, 23, 35, 67, 36, 11],
    copies: 0
  }
]

describe("Card parser parses correctly", () => {
  describe("id parsed correctly", () => {
    test.each(data)('card $id parses id correctly', ({card, id}) => {
      let parsed = Card.parse(card)
      expect(id).toBe(parsed.id)
    })
  })
  describe("numbers parsed correctly", () => {
    test.each(data)('card $id parses numbers correctly', ({card, numbers}) => {
      let parsed = Card.parse(card)
      numbers.forEach( (n,idx) => expect(parsed.numbers[idx]).toBe(n))
    })
  })
  describe("winning_numbers parsed correctly", () => {
    test.each(data)('card $id parses numbers correctly', ({card, winning_numbers}) => {
      // let _card = new Card(id, numbers, winning_numbers)
      let parsed = Card.parse(card)
      winning_numbers.forEach( (n,idx) => expect(parsed.winning_numbers[idx]).toBe(n))
    })
  })
})

describe("Card copies calculated correctly", () => {
  test.each(data)('card $id copies is $copies', ({card, id, copies}) => {
    let parsed = Card.parse(card)
    expect(parsed.calculateNumCopies()).toBe(copies)
  })
})

test.each([{count: 30}])("the pile has $count cards", ({count}) => {
  let cards = data.map( o => Card.parse(o.card))
  expect(scratchOffandCountPile(cards)).toBe(count)
})