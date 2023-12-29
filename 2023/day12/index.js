import fs from 'fs'
import chalk from 'chalk'
import _ from 'lodash'

class SpringSequence{
  constructor(idx, size){
    this.idx = idx 
    this.size = size
    this.bounds = []
    this.found = false
  }
}

// prints the row and then for each spring sequence
// prints an 'x' if it's _possible_ for this spring
// sequence to have a spring there in one of it's positions
function printOptions(record){
    console.log(['|', '-'.repeat(record.r.length), '|'].join(''))
    console.log(['|', record.r, '|'].join(''))
    console.log(['|', '-'.repeat(record.r.length), '|'].join(''))
    console.log(['|', record.row, '|'].join(''))
    console.log(['|', '-'.repeat(record.r.length), '|'].join(''))
    record.springSequences.forEach( s => {
      console.log([ '|', Array.from(record.r).map( (v, i) => {
        if (_.some( s.bounds, b => _.inRange(i, b[0], b[1] + 1))){
          return chalk.blueBright('x')
        } else if (_.inRange(i, s.min, s.max+1)){
          return chalk.bgCyan('.')          
        }
        return chalk.white.dim('.')
      }).join(''), '|', s.size, '-', s.bounds.length].join(''))
    })
    console.log(['|', '-'.repeat(record.r.length), '|'].join(''))
}

// for a given set of spring sequences, return
// the minimum amount of space required to hold them
// this is equal to the sum of the spring sequences size
// and the gaps between them
function minSpaceRequired(sequences){
  return _.sum(sequences.map( s => s.size)) + sequences.length - 1
}


class ConditionRecord{
  constructor(row, springSequences){
    let stripped = row.replace(/\.+/g, '.')
    this.r = stripped
    this.row = stripped
    this.springSequences = springSequences
    this.validator = new RegExp(springSequences.map( s => `#{${s.size}}`).join('\\.+'))
    this.maxSpringLength = Math.max(...this.springSequences.map(s => s.size))
  }
  // repeat the row N times, joined by '?'
  // repeat the expected spring sequences N times
  expand(N){
    let r2 = Array(N).fill(this.r).join('?')
    this.r = r2
    let row2 = Array(N).fill(this.row).join('?')
    this.row = row2
    let n = this.springSequences.slice()
    this.springSequences = []
    for (let i = 0; i < n.length * N; i++){
      let s = n[i % n.length]
      this.springSequences.push(new SpringSequence(i, s.size))
    }
    this.validator = new RegExp(this.springSequences.map( s => `#{${s.size}}`).join('\\.+'))
  }

  // calculate each possible location (bound) within the row for each spring sequence.
  calculateBounds(){
    let keepPruning = true
    while(keepPruning){
      // figure out the bounds we can based on logic and backwards lookups
      for (let sIdx = 0; sIdx < this.springSequences.length; sIdx++){
        let s = this.springSequences[sIdx]

        // we already know where this sequence goes
        if (s.bounds.length == 1){
          continue
        }

        let chunks  = [...this.row.matchAll(/[?#]+/g)]
        let regex = new RegExp(`#{${s.size+1},}`, 'g')
        let knownBigger = [...this.row.matchAll(regex)]
        let knownSprings = [...this.row.matchAll(/#/g)]

        // calculate the left-most theoretically possible starting point
        let prev = this.springSequences.slice(0, sIdx)
        let min = _.first(chunks).index + minSpaceRequired(prev) + 1
        if(sIdx > 0){
          let sPrev = this.springSequences[sIdx - 1]
          if (sPrev.bounds.length > 0){
            min = sPrev.bounds[0][1] + 2
          }
        }
        while(this.row[min] == '.'){ min++ }

        // calculate the right-most theoretically possible starting point
        let remaining = this.springSequences.slice(sIdx)
        let last = _.last(chunks)
        let max = (last.index + last[0].length) - minSpaceRequired(remaining)
        // let max2 = knownBigger.find( k => k.index > min)?.index - 2
        // if (max2){
        //   max = Math.min(max, max2)
        // }
        let max3 = knownSprings.find( k => k.index > min)?.index + this.maxSpringLength - 1
        if (max3){
          max = Math.min(max,max3)
        }
        while(this.row[max] == '.'){ max-- }

        s.min = min
        s.max = max

        s.bounds = []
        for (let left = min; left <= max; left++){
          let bounds = [left, left+s.size-1]
          let substring = this.row.slice(bounds[0],  bounds[1]+1)

          // we found it?
          if (substring === '#'.repeat(s.size) && s.size == this.maxSpringLength){
            s.bounds = [bounds]
            break
          }

          // bounds don't have '.'
          let dots = substring.includes('.')
          if (dots){ continue }

          // neighboring indices don't have '#'
          let leftNeighbor = this.row[bounds[0]-1]
          let rightNeighbor = this.row[bounds[1]+1]
          let neighbors = leftNeighbor == '#' || rightNeighbor == '#'
          if (neighbors){ continue }

          // if we made it this far, these bounds are possible
          s.bounds.push(bounds) 
        }
      }

      // prune bounds that don't make sense now that we can do forward lookups
      for (let sIdx = 0; sIdx < this.springSequences.length-1; sIdx++){
        let s = this.springSequences[sIdx]
        let next = this.springSequences[sIdx + 1]
        // for each bound, assume it's the right one and check
        // if there exists a bound in the next spring sequence
        // that can still work
        s.bounds = s.bounds.filter( b => {
          return next.bounds.find( n => n[0] > b[1] + 1) != undefined
        })
      }

      // now substitute what we know and run again
      keepPruning = false
      for(let sIdx = 0; sIdx < this.springSequences.length; sIdx++){
        let s = this.springSequences[sIdx]
        // if there's only 1 bound, then there's only 1 possible
        // location for the springs - so add them to the row
        if (s.bounds.length == 1){
          if (s.found){
            continue
          }
          s.found = true
          keepPruning = true
          let b = s.bounds[0]
          this.row = Array.from(this.row).map( (c,i) => {
            if(_.inRange(i, b[0], b[1]+1)){
              return '#'
            } else {
              return c
            }
          }).join('')
          
          let before = b[0]-1 
          if (before >= 0){
            this.row = this.row.substring(0, before) + '.' + this.row.substring(before+1)
          }
          let after = b[1] + 1
          if (after < this.row.length){
            this.row = this.row.substring(0, after) + '.' + this.row.substring(after+1)
          }
        }
      }

      // we may have done a substitution, which may have
      // revealed newly identified spring sequences.
      let springChunks = [...this.row.matchAll('\.#+\.','g')].map( c => {
        return {
          bounds: [c.index+1, c.index + c[0].length - 2]
        }
      })
      // for each known chunk, find the spring sequence who has 
      // potential bounds that match the chunk.
      // assign the bound to the spring sequence with the highest index.
      for (let chunk of springChunks){
        let opts = this.springSequences.filter( s => s.bounds.some( b => b[0] == chunk.bounds[0] && b[1] == chunk.bounds[1]))
        if (opts.length === 1){
          let s = opts.pop()
          // s.bounds = [ chunk.bounds ]
        }
      }
    }
  }

  countArrangements(){

    let total = 0
    const evaluate = (chosenBounds, remaining) => {
      if (remaining.length === 0){
        let subst = Array.from(this.row).map( (c, idx) => {
          if (chosenBounds.some( b => b[0] <= idx && idx <= b[1])){
            return '#'
          } else {
            return c == '?' ? '.' : c
          }
        }).join('')
        if (this.validator.test(subst)){
          total++
        }
        return
      }
      let rem = remaining.slice()
      let s = rem.shift()
      boundCheck: for(let b of s.bounds){
        let chosen = chosenBounds.slice()
        chosen.push(b)
        // let's end early if this path is never going
        // to result in a match
        // check 1: no overlap
        if (chosen.length > 1){
          let x = chosen[chosen.length-2]
          let y = chosen[chosen.length-1]
          if (y[0] < x[1] + 2){
            continue boundCheck
          }
        }

        evaluate(chosen, rem)
      }
      return total
    }

    return evaluate([], this.springSequences)
  }

  countArrangements2(){
    let validPairs = []
    for(let i = 0; i < this.springSequences.length - 1; i++){
      let a = this.springSequences[i]
      let b = this.springSequences[i + 1]
      validPairs.push(0)
      for (let j = 0; j < a.bounds.length; j++){
        let asb = a.bounds[j]
        for (let k = 0; k < b.bounds.length; k++){
          let bsb = b.bounds[k]
          // a has to be left of b
          if (asb[1] >= bsb[0]){
            continue
          }
          // substitute substring and validate if valid
          let r = this.row.substring(asb[0], bsb[1] + 1)
          r = Array.from(r).map( (c,idx) => {
            if (asb[0] - asb[0]<= idx && idx <= asb[1] - asb[0]){
              return '#'
            }
            if (bsb[0] - asb[0] <= idx && idx <= bsb[1] - asb[0]){
              return '#'
            }
            return c == '?' ? '.' : c
          }).join('')
          let regex = new RegExp(`#{${a.size}}\\.+#{${b.size}}`)
          if(regex.test(r)){
            validPairs[validPairs.length - 1]++
          }
        }
      }
    }

    return validPairs.reduce( (p, v) => p *= v, 1)
  }

  static parse(line){
    let [ row, numbers ] = line.split(' ')
    let springSequences = numbers.split(',').map((size, idx) => new SpringSequence(idx, parseInt(size)) )
    return new ConditionRecord(row, springSequences)
  }
}

function parseConditionRecords(file){
  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  return lines.map( l => ConditionRecord.parse(l))
}

let file, row
[file, row] = process.argv.slice(2)
file = file ?? 'test.txt'
row = row

let records = parseConditionRecords(file)

if (row == undefined){
  let sum = 0
  let t0 = performance.now()
  for (let i = 0; i < records.length; i++){
    let record = records[i]
    record.expand(5)
    let rStart = performance.now()
    console.log(`${i}:`, record.row)
    console.log(record.springSequences.map(s => s.size).join(','))
    record.calculateBounds()
    console.log('   bounds calculated')
  
    let n  = record.countArrangements()
    sum += n
    let rEnd = performance.now()
    console.log(`   ${rEnd - rStart} ms`)
    console.log(`   ${n}`)
  }
  
  console.log(`total took: ${performance.now() - t0} ms`)
  console.log(sum)
} else {
  let record = records[row]
  record.expand(5)
  record.calculateBounds()
  printOptions(record)
  console.log(record.countArrangements())
}
