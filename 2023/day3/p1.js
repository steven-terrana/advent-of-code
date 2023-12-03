import fs from 'fs'
import chalk from 'chalk'

let schematic = fs.readFileSync('input.txt', 'utf-8')

// get lines
let lines = schematic.split('\n')

// determine line length
let l = lines[0].length
// console.log(l)

// add buffer to schematic
let b = Array(l + 2).fill('.')

schematic = [ 
  // add a row of dots along the top
  b, 
  // add tops to the left and right
  ...lines.map(l => [ '.', ...l.split(''), '.' ]),
  // add a row of dots along the bottom
  b
]

function prettyPrint(schematic){
  let isPartNumber = false
  for (const row of schematic) {
    console.log(row.map( c => {
      if (/\d/.test(c)){
        return chalk.bold.blue(c)
      } else if (/[^\d\.]/.test(c)){
        isPartNumber = true 
        return chalk.red(c)
      } else{
        return chalk.dim.grey(c)
      }
    }).join(''))
  }
  return isPartNumber
}

prettyPrint(schematic)

let sum = 0
schematic.forEach( (line, row) => {
  let numbers = line.join('').matchAll(/(\d+)/g)
  if (numbers) {
    Array.from(numbers).map( n => {
      console.log(`n: ${n[0]}, row: ${row}, index: ${n.index}`)
      let i = n.index
      let isPartNumber = prettyPrint(schematic.slice(row - 1, row + 2).map( r => r.slice(i-1, i+n[0].length+1)))
      if(isPartNumber){
        sum += Number(n[0])
      }
    })
  }
})
console.log(sum)