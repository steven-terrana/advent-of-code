import fs from 'fs'
import ProgressBar from 'progress'

class ConditionRecord{
  constructor(record, numbers){
    this.record = record
    this.numbers = numbers
  }
  permutate(){
    let unsureIndices = [...this.record.matchAll(/\?/g)].map(m => m.index)
    let totalSprings = this.numbers.reduce( (s,n) => s+n,0)
    let nSprings = [...this.record.matchAll(/#/g)].length
    let arrangements = 0
    let attempted = []
    let replaceAt = (s, c, idx) => s.slice(0, idx) + c + s.slice(idx+1)
    let permutatations = this.getCharacterSubstitutionPermutations(unsureIndices.length)
    // console.log('permutations: ', permutatations.length)
    for (let p of permutatations){
      let pSprings = permutatations.filter(c => c=='#').length
      if (nSprings + pSprings != totalSprings){
        continue
      }
      let arrangement = unsureIndices.reduce( (arrangement, idx, i) => {
        return replaceAt(arrangement, p[i], idx)
      } , this.record)
      if(!attempted.includes(arrangement)){
        attempted.push(arrangement)
        if(this.validate(arrangement)){
          arrangements++
        }
      }
    }
    return arrangements
  }
  getCharacterSubstitutionPermutations(N){
    let n = parseInt(Array(N).fill('1').join(''),2)
    let permutations = []
    for(let i = 0; i <= n; i++){
      let b = (i >>> 0).toString(2)
      if(b.length < N){
        b = [...Array(N - b.length).fill('0'), b].join('') 
      }
      let p = b.split('').map( c => parseInt(c) ? '#' : '.')
      permutations.push(p)
    }
    return permutations
  }
  // validates a given arrangement works or not
  validate(arrangement){
    let validator = new RegExp(/#+/g)
    let n = [...arrangement.matchAll(validator)].map(m => m[0].length)
    return n.length == this.numbers.length && this.numbers.every( (v, idx) => v == n[idx])
  }
  static parse(line){
    let [ record, numbers ] = line.split(' ')
    numbers = numbers.split(',').map(n => parseInt(n))
    return new ConditionRecord(record, numbers)
  }
}

function parseConditionRecords(file){
  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  return lines.map( l => ConditionRecord.parse(l))
}

let records = parseConditionRecords('test.txt')

let bar = new ProgressBar('progress:  [:bar] :elapsed | :percent | :eta', {total: records.length, width: 50})
let sum = 0
for (let r of records){
  let a = r.permutate()
  sum += a
  bar.tick()
}

