import fs from 'fs'
import _ from 'lodash'
import chalk from 'chalk'

const directions = ['north','west','south','east']

const boulders = {
  round: 'O',
  cube: '#'
}

class Platform{
  direction = directions[0]
  constructor(dimensions, round, cube){
    this.dimensions = dimensions
    this.round = round
    this.cube = cube
  }
  
  cache = []
  cycle(N){
    for(let i = 0; i < N; i++){
      directions.forEach( d => this.tilt(d) )
      this.round.sort( (a,b) => a[0] - b[0] ?? a[1] - b[1])
      if(!this.cache.includes(this.round.toString())){
        this.cache.push(this.round.toString())
      }
    }
  }

  /*
    tilt the platform in an arbitrary cardinal direction.
    the algorithm for tilting always tilts to the North.
    the trick to simplifying this was to realize you could 
    just "rotate the platform" and then still "tilt it to the
    north" and rotate it back.
  */
  tilt(direction = undefined){
    // if we aren't already facing the direction to tilt, spin that way
    let currentDirection
    if (direction != undefined && this.direction != direction){
      currentDirection = this.direction
      this.rotate(direction)
    }
    // create objects where the keys are column numbers and the values
    // are arrays with the indices of rows where each boulder is
    // sorted from least to greatest
    let getBouldersIndicesByColumn = (boulderCoordinates) => { 
      return _.chain(boulderCoordinates)
       // create an object where the keys are column indices
       // and the values are the rock coordinates corresponding
       // to the column
       .groupBy( rock => rock[1] )
       // now translate the values from an array of coordinates
       // to an array of row indices because we don't need the 
       // column anymore (it's the object key)
       .mapValues( coordinates => coordinates.map( rock => rock[0]) )
       // now sort that list of indices
       .mapValues( coordinates => coordinates.sort( (a,b) => a - b) )
       .value()
    }
    let roundColumns = getBouldersIndicesByColumn(this.round)
    let  cubeColumns = getBouldersIndicesByColumn(this.cube)
    this.round = []

    _.forEach(roundColumns, (rocks, column) => {
      // the current index for the rollin rocks to land
      let pos = 0
      // the current cubed bolder index
      let fixedIdx = 0
      findPosition: for(let r = 0; r < rocks.length; r++){
        // if we aren't up against a fixed boulder,
        // then the position is just the next increment of pos
        if (rocks[r] < (cubeColumns[column]?.[fixedIdx] ?? Number.POSITIVE_INFINITY)){
          this.round.push([pos++, column])
        }
        // if we've come up against a fixed bolder, then we need to
        // jump the pos value to after the fixed bolder, increase 
        // the fixed boulder index we're looking for, decrement r
        // and retry this loop iteration
        if (rocks[r] > cubeColumns[column]?.[fixedIdx]){
          pos = cubeColumns[column]?.[fixedIdx] + 1
          fixedIdx++
          r--
          continue findPosition 
        }
      }
    })
    if (this.currentDirection){
      this.rotate(currentDirection)
    }
  }

  /*
    transforms the current coordinates 90 degrees clockwise until the
    "top" of the grid is the direction provided. If not provided, then
    one 90 degree rotation occurs
    
    Mathematically, rotating a matrix 90 degrees means that to
    translate the original coordinates [r1, c1] to [r2, c2]:
    r2 = c1
    c2 = N - 1 - r1 where N = the number of rows of the matrix
  */
  rotate(targetDirection=undefined){
    let nextDirection = () => directions[(directions.indexOf(this.direction)+1) % directions.length]
    let transform = (coordinates) => [coordinates[1], this.dimensions[0] - 1 - coordinates[0]]
    targetDirection = targetDirection ?? nextDirection()
    while(this.direction != targetDirection){
      this.round = this.round.map(transform)
      this.cube = this.cube.map(transform)
      this.dimensions.reverse()
      this.direction = nextDirection()
    }
  }

  calculateLoad(){
    return this.round.reduce( (load, b) => {
      return load + (this.dimensions[0] - b[0])
    }, 0)
  }

  /*
    this determines if a list [a,b]  is present in a given list of lists
    javascript is annoying. 
  */
  includes(allCords, c){
    return _.some( allCords, (x) => x[0] == c[0] && x[1] == c[1] )
  } 

  print(){
    let rows = this.dimensions[0]
    let cols = this.dimensions[1]
    let serialized = []
    for( let r = 0; r < rows; r++){
      let row = []
      for (let c = 0; c < cols; c++){
        let isRound = this.includes(this.round, [r,c])
        let isCube  = this.includes(this.cube, [r,c])
        if (isCube && isRound){
          row.push(chalk.redBright('?'))
        } else if (isRound){
          row.push(chalk.blueBright(boulders.round))
        } else if (isCube){
          row.push(chalk.whiteBright(boulders.cube))
        } else {
          row.push(chalk.white.dim('.'))
        }
      }
      serialized.push(row.join(''))
    }
    console.log(serialized.join('\n'))
  }

  static parse(file){
    let lines = fs.readFileSync(file, 'utf-8').split('\n')
    // makes an assumption that every row is the same length
    let dimensions = [lines.length, lines[0].length]
    let round = []
    let cube  = []
    for(let i = 0; i < lines.length; i++){
      let regex = new RegExp(`[${Object.values(boulders).join('')}]`, 'g')
      let matches = Array.from(lines[i].matchAll(regex))
      matches.forEach( (b) => {
        if (b[0] == boulders.round){
          round.push([i, b.index])
        }
        if (b[0] == boulders.cube){
          cube.push([i, b.index])
        }
      })
    }
    return new Platform(dimensions, round, cube)
  }
}

let file = 'input.txt'
let platformA = Platform.parse(file)
platformA.tilt('north')
console.log("Part 1: ", platformA.calculateLoad())

let platformB = Platform.parse(file)

/*  
  so, for my input, starting after 1180 cycles, the
  state begins to cycle. The cycle length isn't static,
  it's a step function that increases by 18 every 18 cycles
  
  So a function can be written to calculate how many cycles
  are actually needed to reach the same state as the problem
  requested by the project
  
  f(n) = cycle_n = 18 + 18 * Math.floor((1000000000 - 1180) / 18)
  
  the required cycles, then, is: N - cycle_n

  i hate the puzzles without generalized solutions
  that can be written _before_ some deep inspection
*/
let N = 1000000000
let cycle = 18 + 18 * Math.floor( (N - 1180) / 18 )
let max_cycles_needed = N - cycle
platformB.cycle(max_cycles_needed)
platformB.rotate('north')
console.log("Part 2: ", platformB.calculateLoad())
