import {getLines} from "../helpers/index.js"

export class Card {
  constructor(id, numbers, winning_numbers){
    this.id = id
    this.numbers = numbers
    this.winning_numbers = winning_numbers
  }

  calculatePoints(){
    const winners = this.numbers.filter( n => this.winning_numbers.includes(n) )
    if (winners.length == 0){
      return 0
    } 
    if (winners.length <= 2) {
      return winners.length
    }
    if (winners.length > 2){
      return 2 ** (winners.length - 1) 
    }
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

export function sumCardPoints(cards){
  return cards.reduce( (sum, card) => sum += card.calculatePoints(), 0)
}

export function parseCards(file){
  return getLines(file).map( line => Card.parse(line) ).filter( c => c)
}

let sum = sumCardPoints(parseCards('input.txt'))
console.log(sum)