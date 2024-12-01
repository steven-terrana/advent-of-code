import fs from 'fs'
import _ from 'lodash'

class Pattern {
  constructor(lines){
    this.lines = lines
    this.flipped = false
    this.reflection = {
      flipped: false,
      line: undefined
    }
  }
  /*
    summarize the pattern. 
    N: how many characters off the reflection can be
    newOne: boolean whether or not we should use this.reflection to skip
            that reflection line in the search.

    this.summarize(1, true) is the equivalent of fixing a smudge and finding
    a new reflection line, assuming this.reflection is already set
  */
  summarize(N, newOne){
    let diff
    // check horizontal
    diff = this.findCharDiff(N, newOne)
    if(diff){
      this.reflection = {
        flipped: this.flipped,
        line: diff.idx
      }
      return 100 * diff.idx
    }

    // flip, check vertical, flip back
    this.transpose()
    diff = this.findCharDiff(N, newOne)
    if (diff) {
      this.reflection = {
        flipped: this.flipped,
        line: diff.idx
      }
    }
    this.transpose()

    return diff?.idx
  }

  findCharDiff(N, newOne){
    for(let i = 1; i < this.lines.length; i++){
      // if we're looking for a new reflection line, just
      // skip the existing one
      if (newOne){
        if (this.reflection.line == i && this.reflection.flipped == this.flipped){
          continue
        }
      }

      let top = _.slice(this.lines,0, i)
      let bottom = _.slice(this.lines, i)
      let diff = top.length - bottom.length
      if (diff > 0){
        top = _.drop(top, diff)
      }
      // bottom greater than top, so remove elements 
      if (diff < 0){
        bottom = _.dropRight(bottom, -1*diff)
      }
      // check if top and bottom are the same
      bottom.reverse()
      let charDiff = []
      for (let r = 0; r < top.length; r++){
        for(let c = 0; c < top[0].length; c++){
          if (top[r][c] != bottom[r][c]){
            charDiff.push([ diff > 0 ? r + diff : r, c])
          }
        }
      }
      if (charDiff.length == N){
        return {
          charDiff: charDiff,
          idx: i
        }
      }
    }
    return undefined
  }

  transpose(){
    let array = this.lines.slice()
    let newArray = []
    for(let i = 0; i < array.length; i++){
      for (let j = 0; j < array[0].length; j++){
        if (i == 0){
          newArray.push([ array[i][j] ])
        } else {
          newArray[j].push(array[i][j])
        }
      }
    }
    this.lines = newArray
    this.flipped = !this.flipped
  }

  print(){
    this.lines.forEach( line => console.log(line.join(' ')))
  }
  static parseAll(file){
    let raw = fs.readFileSync(file, 'utf-8').split('\n\n')
    let p = []
    raw.forEach( r => {
      p.push(new Pattern(r.split("\n").map(line => line.split(''))))
    })
    return p
  }
}

let patterns = Pattern.parseAll('input.txt')

let sum = 0
for(let p of patterns){
  sum += p.summarize(0, false)
}
console.log('Part 1: ', sum)

sum = 0
for(let p of patterns){
  sum += p.summarize(1, true)
}
console.log('Part 2: ', sum)