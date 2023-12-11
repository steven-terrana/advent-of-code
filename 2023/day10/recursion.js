import fs from 'fs'
import chalk from 'chalk'

/*
  this approach fails with a call stack size exceeded error
*/

const animal = 'S'

const directions = {
    north: {
      rowShift: -1,
      colShift: 0,
      possibleNextPipes: ['|', 'F', '7', animal ]
    },
    south: {
      rowShift: 1, 
      colShift: 0,
      possibleNextPipes: ['|', 'L', 'J', animal ]
    },
    east: {
      rowShift: 0, 
      colShift: 1,
      possibleNextPipes: ['-', '7', 'J', animal]
    },
    west: {
      rowShift: 0,
      colShift: -1,
      possibleNextPipes: ['-', 'L', 'F', animal]
    }
}

const pipes = {
  '|': [ directions.north, directions.south ],
  '-': [ directions.east,  directions.west  ], 
  'L': [ directions.north, directions.east  ],
  'J': [ directions.north, directions.west  ],
  '7': [ directions.south, directions.west, ],
  'F': [ directions.south, directions.east  ],
}
pipes[animal] = [ ...Object.values(directions) ]


// return a 2D array of the field characters
// buffered with '.' to avoid dealing with
// index out of bounds logic
function parseField(file){
  let field = fs.readFileSync(file, 'utf-8').split('\n')
  field = field.map( row => ['.', ...row.split(''), '.'])
  let hBuf = Array(field[0].length).fill('.')
  return [hBuf, ...field, hBuf]
}

function printField(field, cLoc, vLocs){
  let frame = Array(field[0].length*2 + 4).fill(chalk.whiteBright('=')).join('')
  console.log(frame)
  let colAxis = Array(field[0].length).fill(0).map( (_, i) => chalk.whiteBright(i)).join(' ')
  console.log(`    ${colAxis}`)
  field.forEach( (row, r) => {
    let pretty = [
      chalk.whiteBright(`${r} |`),
      ...row.map( (pipe, c) => {
      if (cLoc.row == r && cLoc.col == c){
        return chalk.bgGreen(pipe)
      } else if (beenHereBefore(vLocs, {row: r, col: c})){
        return chalk.bgYellow(pipe)
      } else if (pipe == animal){
        return chalk.cyanBright(pipe)
      } else {
        return chalk.white.dim(pipe)
      }
    })].join(' ')
    console.log(pretty)
  })
  console.log(frame)
}

function beenHereBefore(vLocs, loc){
  return vLocs.some( l => l.row == loc.row && l.col == loc.col)
}

// find the animals coordinates in the field
function findAnimal(field){
  let row = field.findIndex( row => row.includes(animal))
  let col = field[row].indexOf(animal)
  return {row: row, col: col}
}

// walk through the pipes until we complete the loop
function skitter(field, cLoc, vLocs){
  // if we've taken at least 1 step and 
  // our current location is the animal again,
  // that means we've completed a loop!
  let p = field[cLoc.row][cLoc.col]
  if (p == animal && vLocs.length > 1){
    let result = Math.floor((vLocs.length + 1) / 2)
    console.log(chalk.bold.green(`we made it! result: ${result}`))
    return result
  }
  //printField(field, cLoc, vLocs)
  // if it isn't the animal, let's add the possible
  // let's iterate over the possible next steps and
  // continue our walk
  vLocs.push(cLoc)
  let nextSteps = []
  for(let d of pipes[p]){
    let r = cLoc.row + d.rowShift
    let c = cLoc.col + d.colShift
    let nLoc = { row: r, col: c, cameFrom: d}
    let nextPipe = field[r][c]
    // make sure we can go into this pipe and
    // that we haven't been here before
    if (nextPipe == animal && vLocs.length > 3){
      nextSteps = [ nLoc ]
      break
    }
    if (d.possibleNextPipes.includes(nextPipe) && !beenHereBefore(vLocs, nLoc)){
      nextSteps.push(nLoc)
    }
  }
  
  // if we can't take any more steps, we've
  // reached a dead end and this isn't a loop.
  if (nextSteps.length == 0){
    console.log(chalk.redBright("reached a dead end"))
    return undefined
  }

  // skitter down every next step, all of these will be
  // undefined except for the one that represents a completed
  // loop
  for (let nStep of nextSteps){
    let r = skitter(field, nStep, [...vLocs])
    if (r) {
      return r
    }
  }
}

let field = parseField('test.txt')
let currentLocation = findAnimal(field)
// printField(field, currentLocation, [])
skitter(field, currentLocation, [])
