import fs from 'fs'
import _ from 'lodash'

class ConditionRecord{
  constructor(row,springGroups){
    this.row = row
    this.springGroups = springGroups
  }
  unfold(){
    this.row = Array(5).fill(this.row).join('?')
    this.springGroups = Array(5).fill(this.springGroups).flat()
  }

  append(branch, character){
    if (branch.running){
      if (character == '.'){
        // group ended! if we saw the expected amount of
        // springs then this branch is still valid
        if (branch.runLength == this.springGroups[branch.group]){
          return {
            group: branch.group + 1,
            runLength: 0,
            running: false, 
            copies: branch.copies
          }
        } else {
          return undefined
        }
      } else if (character == '#'){
        // increment the run length. if it's still less or equal to
        // than the expected number of springs, this branch
        // is still valid
        if (branch.runLength + 1 > this.springGroups[branch.group]){
          return undefined
        }
        return {
          group: branch.group,
          runLength: branch.runLength + 1,
          running: true, 
          copies: branch.copies
        }
      }
    } else {
      if (character == '.'){
        // no op, just return branch
        return branch
      } else if (character == '#'){
        // starting a new run!
        return {
          group: branch.group, 
          runLength: 1,
          running: true,
          copies: branch.copies
        }
      }
    }
  }

  consolidate(branches){
    let unique = new Map()
    for (let b of branches){
      let key = JSON.stringify([b.group, b.runLength, b.running])
      if (unique.has(key)){
        unique.set(key, unique.get(key) + b.copies)
      } else {
        unique.set(key, b.copies)
      }
    }
    let consolidated = []
    for (let entry of unique){
      let group, runLength, running
      [group, runLength, running] = JSON.parse(entry[0])
      let copies = entry[1]
      consolidated.push({
        group: group,
        runLength: runLength,
        running: running, 
        copies: copies
      })
    }
    return consolidated
  }

  countArrangements(){
    // define an array that stores the state of current
    // possibilities. 
    let branches = [{
      // which spring group are we on?
      group: 0,
      // how many consecutive springs have we seen?
      runLength: 0,
      // are we in the middle of a spring group?
      running: false,
      // how many times have we arrived at this state?
      copies: 1
    }]

    for (let j = 0; j < Array.from(this.row).length; j++){
      let c = this.row[j]
      let nextBranches = []
      for (let i = 0; i < branches.length; i++){
        let branch = branches[i]
        if (c == '?'){ 
          for (let possible of ['.', '#']){
            let b = structuredClone(branch)
            let next = this.append(b, possible)
            if (next){
              nextBranches.push(next)
            }
          }
        } else{
          let next = this.append(branch, c)
          if (next){
            nextBranches.push(next)
          }
        }
      }
      branches = this.consolidate(nextBranches)
    }
    
    let total = 0
    for (let b of branches){
      if(b.running){
        if (b.runLength == this.springGroups[b.group]){
          b.group++
        } else {
          continue
        }
      }
      if (b.group == this.springGroups.length){
        total += b.copies
      }
    }
    return total
  }

  static parse(line){
    let row,springGroups
    [row, springGroups] = line.split(' ')
    springGroups = springGroups.split(',').map(n => parseInt(n))
    return new ConditionRecord(row, springGroups)
  }
}

function parseConditionRecords(file){
  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  return lines.map( l => ConditionRecord.parse(l) )
}

let file, row
[file, row] = process.argv.slice(2)
file = file ?? 'test.txt'

let records = parseConditionRecords(file)

let part1 = 0
for (let record of records){
  part1 += record.countArrangements()
}

console.log('Part 1: ', part1)

let part2 = 0
for (let record of records){
  record.unfold()
  part2 += record.countArrangements()
}

console.log('Part 2: ', part2)