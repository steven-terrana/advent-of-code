import {getLines} from "../helpers/index.js"

export class Card {
  constructor(id, numbers, winning_numbers){
    this.id = id
    this.numbers = numbers
    this.winning_numbers = winning_numbers
  }

  calculateNumCopies(){
    return this.numbers.filter( n => this.winning_numbers.includes(n) ).length
  }

  static parse(cardString){
    let card = undefined
    try{
      var parser = new RegExp(/Card\s{1,}(?<id>\d+):\s{1,}((?<numbers>((\d+)\s{1,}){1,}))\|\s{1,}(?<winners>((\d+\s*){1,}))/g)
      var c = [...cardString.matchAll(parser)][0]
      card = new Card(
        parseInt(c.groups.id),
        c.groups.numbers.split(" ").map( n => parseInt(n)).filter(n => n),
        c.groups.winners.split(" ").map( n => parseInt(n)).filter(n => n)
      )
    } catch(error) {
      console.log(`failed to parse card: ${cardString}`)
    }
    return card
  }
}

export function parseCards(file){
  return getLines(file).map( line => Card.parse(line)).filter(c => c)
}

export function scratchOffandCountPile(cards){
  // a list to track how many of each card index we have
  let pile = Array(cards.length).fill(1)

  cards.forEach( (c, idx) => {
    // we currently have pile[idx] many scatchoffs of the current card
    // so we'll add that many copies of the next N cards based on how
    // many points this current card wins
    let n = c.calculateNumCopies()
    for (let i = idx + 1; i <= idx + n; i++){
      pile[i] += pile[idx]
    }
  })

  let sum = pile.reduce( (sum, p) => sum += p, 0)
  return sum
}

let cards = parseCards("input.txt")
console.log(scratchOffandCountPile(cards))