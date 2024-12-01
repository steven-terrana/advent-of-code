import fs from 'fs'

export class Card{
  static cardOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2' ]
  constructor(character){
    this.character = character
  }
  valueOf(){
    let reversed = Card.cardOrder.slice().reverse()
    return reversed.indexOf(this.character)
  }
}

export class Hand{
  static UNDEFINED = {name: 'high card', value: 0}
  static types = [
    {
      name: "five of a kind", 
      check: f => f.includes(5),
      value: 6
    },
    {
      name: "four of a kind", 
      check: f => f.includes(4),
      value: 5
    },
    {
      name: "full house",
      check: f => f.includes(3) && f.includes(2),
      value: 4
    },
    {
      name: "three of a kind",
      check: f => f.includes(3),
      value: 3
    },
    {
      name: "two pair",
      check: f => f.filter(c => c==2).length == 2,
      value: 2
    },
    {
      name: "one pair", 
      check: f => f.includes(2),
      value: 1
    }
  ]

  constructor(cards, bid){
    this.cards = cards
    this.bid = bid
    this.type = this.determineType(cards)
  }

  determineType(){
    let count = {}
    let cards = this.cards.map( card => card.character )
    let s = new Set(cards)
    for (let c of s.keys()){ 
      count[c] = 0
    }
    cards.forEach(c=> count[c]++)
    let frequencies = Object.values(count)
    let type = Hand.types.find( t => t.check(frequencies) )
    return type ? type : Hand.UNDEFINED
  }

  valueOf(){
    return this.type.value
  }

  static compare(a, b){
    if (a < b){
      return -1
    }
    if (a > b){
      return 1
    }
    if (a.type.value==b.type.value){
      for(let i = 0; i < a.cards.length; i++){
        if (a.cards[i] < b.cards[i]){
          return -1
        }
        if (a.cards[i] > b.cards[i]){
          return 1
        }
      }
    }
    return 0
  }

  static fromString(s){
    return new Hand([...s].map(c => new Card(c), 0))
  }
}

export function parseHands(file){
  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  let hands = []
  lines.forEach( line => {
    let parts = line.split(" ")
    let cards = Array.from(parts[0]).map(c => new Card(c))
    hands.push(new Hand(cards, parseInt(parts[1])))
  })
  return hands
}

export function calculateTotalWinnings(hands){
  let winnings = hands.reduce( (sum, hand, idx) => {
    let m = idx + 1
    return sum + (hand.bid * m)
  }, 0)
  return winnings
}

let hands = parseHands('input.txt')
hands.sort(Hand.compare)
let winnings = calculateTotalWinnings(hands)
console.log(`winnings: ${winnings}`)