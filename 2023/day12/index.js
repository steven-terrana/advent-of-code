import fs from 'fs'
import ProgressBar from 'progress'

class ConditionRecord{
  constructor(record, numbers){
    this.record = record
    this.unknowns = [...record.matchAll(/\?/g)].map(m => m.index)
    this.knownSprings = [...record.matchAll(/#/g)].length
    this.numbers = numbers
    this.totalSprings = numbers.reduce( (s,n) => s+n,0)
  }
  permutate(){
    let arrangements = 0
    let attempted = []
    let replaceAt = (s, c, idx) => s.slice(0, idx) + c + s.slice(idx+1)
    let pS = performance.now()
    console.log('calculating boolean permutations for ', this.unknowns.length, 'unknowns')
    let permutations = getBooleanPermutations(this.unknowns.length)
    let pE = performance.now()
    console.log("   calculated in ", (pE - pS), " ms")
    
    console.log('testing', permutations.size, 'permutations')
    pS = performance.now()
    for (let p of permutations){
      // first make sure this permutation even has a chance of being correct
      // by making sure it'll result in the right number of total springs
      let pSprings = p.split('').reduce( (s,c) => c == '#' ? s+=1 : s , 0)
      if (pSprings + this.knownSprings != this.totalSprings){
        continue
      }

      // frontload with '.' characters. because this depends on how many
      // unknowns there are, doing it earlier would have made getBooleanPermutations
      // harder to memoize efficiently.
      let substValues = p.padStart(this.unknowns.length, '.')
      let arrangement = this.unknowns.reduce( (arrangement, idx, i) => {
        return replaceAt(arrangement, substValues[i], idx)
      } , this.record)
      if(!attempted.includes(arrangement)){
        attempted.push(arrangement)
        if(this.validate(arrangement)){
          arrangements++
        }
      }
    }
    pE = performance.now()
    console.log("took", pE - pS, 'ms')
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


/*
  takes the number of unknown strings N and generates the set of
  permutations representing individual sequences of substitutions
  ex: N = 1 | options: ['x'], ['.']
  ex: N = 2 | options: ['x', 'x'], ['x', '.'], ['.','x'], ['.', '.']

  how it works:

*/
let cache = {}
function getBooleanPermutations(N){
  if (cache[N]){
    // console.log("   ", N, "in cache")
    return cache[N]
  }
  console.log("   ", N, "not in cache")
  if (N == 1){
    return [ '#', '.' ]
  }
  // we only need to get the permutations not generated by
  // N-1, because we know we'll capture those through recursion
  let permutations = []
  const start = parseInt(Array(N-1).fill('1').join(''), 2)
  const end   = parseInt(Array(N).fill('1').join(''), 2)
  const chars = { '1': '#', '0': '.'}
  for(let p = start; p <= end; p++){
    let bin = p.toString(2)
    let bin2spring = bin.replace(/[10]/g, m => chars[m])
    permutations.push(bin2spring)
  }
  let s = new Set([...permutations, ...getBooleanPermutations(N-1)])
  cache[N] = s
  return s
}

function parseConditionRecords(file){
  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  return lines.map( l => ConditionRecord.parse(l))
}

let records = parseConditionRecords('input.txt')

let sum = 0
for (let r of records){
  let a = r.permutate()
  sum += a
}

console.log('Part 1: ', sum)