import fs from 'fs'
import ProgressBar from 'progress'

class ConditionRecord{
  constructor(record, numbers){
    this.record = record
    this.unknowns = [record.matchAll(/\?/g)].map(m => m.index)
    this.knownSprings = [record.matchAll(/#/g)].length
    this.numbers = numbers
    this.totalSprings = numbers.reduce( (s,n) => s+n,0)
  }
  permutate(){
    let arrangements = 0
    let attempted = []
    let replaceAt = (s, c, idx) => s.slice(0, idx) + c + s.slice(idx+1)
    let permutations = getBooleanPermutations(this.unknowns.length)
    permutations = permutations.filter(p => p.springs + this.knownSprings != this.totalSprings)
    console.log(permutations)
    for (let p of permutations){
      // frontload with '.' characters. because this depends on how many
      // unknowns there are, doing it earlier would have made getBooleanPermutations
      // harder to memoize efficiently.
      let substValues = [ Array(this.unknowns.length - p.value.length).fill('.'), ...p.value]
      let arrangement = this.unknowns.reduce( (arrangement, idx, i) => {
        return replaceAt(arrangement, substValues[i], idx)
      } , this.record)
      if(!attempted.includes(arrangement)){
        console.log('attempting: ', arrangement)
        attempted.push(arrangement)
        if(this.validate(arrangement)){
          console.log('--> valid')
          arrangements++
        }
      }
    }
    return arrangements
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

let cache = {}
function getBooleanPermutations(N){
  if (N == 1){
    return [{value: ['#'], springs: 1}]
  }
  if (cache[N]){
    return cache[N]
  }
  const chars = { '1': '#', '0': '.'}
  let bin = (N >>> 0).toString(2)
  let springs = 0
  let bin2spring = bin.replace(/[10]/g, m => {
    if (m == "#"){
      springs++
    }
    return chars[m]
  }).split('')

  let p = [{value: bin2spring, springs: springs}, ...getBooleanPermutations(N-1)]
  cache[N] = p
  return p
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

console.log(sum)