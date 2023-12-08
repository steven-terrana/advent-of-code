import fs from 'fs'

export class Card{
  static cardOrder = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J' ]
  constructor(character){
    this.character = character
  }
  valueOf(){
    let reversed = Card.cardOrder.slice().reverse()
    return reversed.indexOf(this.character)
  }
  isJoker(){
    return this.character == 'J'
  }
}

export class Hand{
  static UNDEFINED = {name: 'high card', value: 0}
  static types = [
    {
      name: "five of a kind", 
      check: f => f.includes(5),
      value: 6,
      numJokers: f => 5 - f[0]
    },
    {
      name: "four of a kind", 
      check: f => f.includes(4),
      value: 5,
      numJokers: f => 4 - f[0]
    },
    {
      name: "full house",
      check: f => f.includes(3) && f.includes(2),
      value: 4,
      numJokers: f => 5 - f[0] - f[1]
    },
    {
      name: "three of a kind",
      check: f => f.includes(3),
      value: 3,
      numJokers: f => 3 - f[0]
    },
    {
      name: "two pair",
      check: f => f.filter(c => c==2).length == 2,
      value: 2,
      numJokers: f => f[0] > 1 ? 1 : 2
    },
    {
      name: "one pair", 
      check: f => f.includes(2),
      value: 1,
      numJokers: _ => 1
    }
  ]

  constructor(cards, bid){
    this.cards = cards
    this.bid = bid
    this.type = this.determineType(cards)
  }

  determineType(){
    let count = {}
    let numJokers = this.cards.filter( c => c.isJoker()).length
    if (numJokers == 5){
      return Hand.types[0]
    }
    let cards = this.cards.filter( c => !c.isJoker() ).map( card => card.character )    
    let s = new Set(cards)
    for (let c of s.keys()){ 
      count[c] = 0
    }
    cards.forEach(c=> count[c]++)
    let frequencies = Object.values(count)
    frequencies.sort().reverse()
    // figure out type without applying jokers
    let type = Hand.types.find( t => t.check(frequencies) ) ?? Hand.UNDEFINED
    // if there are jokers present, check to see if for hands 
    // with a higher value than current type if we have enough
    // jokers to get there
    if (numJokers > 0){
      let possibleType = Hand.types.find( t =>
        t.value >= type.value && 
        t.numJokers(frequencies) <= numJokers
      )
      type = possibleType ?? type
    }
    return type
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