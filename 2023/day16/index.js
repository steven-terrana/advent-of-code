import fs from 'fs'
import _ from 'lodash'
import chalk from 'chalk'

const RAYS = {
  up: {
    dir: [-1,0], 
    bounce: {
       '-': [ 'left', 'right' ],
      '\\': [ 'left' ],
       '/': [ 'right' ]
    },
    findHit: (ray, group) => {
      let hit = group[ray.src[1]]?.findLast(m => m.loc[0] < ray.src[0])
      let end = hit == undefined ? [0, ray.src[1]] : hit.loc
      let reflections = []
      RAYS.up.bounce[hit?.type]?.forEach( r => {
        reflections.push({
          src: hit.loc,
          dir: r,
          end: undefined
        })
      })
      return [end, reflections]
    }
  },
  down: {
    dir: [1, 0],
    bounce: {
      '-': [ 'left', 'right' ],
     '\\': [ 'right' ],
      '/': [ 'left'  ]
    },
    findHit: (ray, group, max) => {
      let hit = group[ray.src[1]]?.find(m => m.loc[0] > ray.src[0])
      let end = hit == undefined ? [max[0], ray.src[1]] : hit.loc
      let reflections = []
      RAYS.down.bounce[hit?.type]?.forEach( r => {
        reflections.push({
          src: hit.loc,
          dir: r,
          end: undefined
        })
      })
      return [end, reflections]
    }
  },
  left: {
    dir: [0, -1],
    bounce: {
      '|': [ 'up', 'down' ],
     '\\': [ 'up' ],
      '/': [ 'down' ]
    },
    findHit: (ray, group, max) => {
      let hit = group[ray.src[0]]?.findLast(m => m.loc[1] < ray.src[1])
      let end = hit == undefined ? [ray.src[0], 0] : hit.loc
      let reflections = []
      RAYS.left.bounce[hit?.type]?.forEach( r => {
        reflections.push({
          src: hit.loc,
          dir: r,
          end: undefined
        })
      })
      return [end, reflections]
    }
  },
  right: {
    dir: [0, 1],
    bounce: {
      '|': [ 'up', 'down'],
     '\\': [ 'down' ],
      '/': [ 'up' ]
    },
    findHit: (ray, group, max) => {
      let hit = group[ray.src[0]]?.find(m => m.loc[1] > ray.src[1])
      let end = hit == undefined ? [ray.src[0], max[1]] : hit.loc
      let reflections = []
      RAYS.right.bounce[hit?.type]?.forEach( r => {
        reflections.push({
          src: hit.loc,
          dir: r,
          end: undefined
        })
      })
      return [end, reflections]
    }
  }
}

class Mirrors {
  constructor(rows, cols, mirrors){
    this.rows  = rows 
    this.cols  = cols
    this.all   = mirrors
    const byCol = _.chain(mirrors)
      .filter(m => m.type != '|')
      .sort((a,b) => a.loc[1] - b.loc[1])
      .groupBy( m => m.loc[1] )
      .value()
    const byRow = _.chain(mirrors)
      .filter(m => m.type != '-')
      .sort((a,b) => a.loc[0] - b.loc[0])
      .groupBy( m => m.loc[0] )
      .value()      
    this.group = [byRow, byCol]
  }

  untraced=[]
  traced=[]

  shootBeam(beam){
    this.untraced.push(beam)
    this.trace()
    let energy = this.countEnergized()
    this.untraced = []
    this.traced = []
    return energy
  }

  trace(){
    while(this.untraced.length > 0){
      let ray = this.untraced.pop()
      let R = RAYS[ray.dir]
      let reflections
      [ray.end, reflections] = R.findHit(ray, this.group[Math.abs(R.dir[0])], [this.rows-1, this.cols-1])
      this.traced.push(ray)
      for (let r of reflections){
        let all = [...this.traced, ...this.untraced]
        let exists = _.some(all, e => e.dir == r.dir && _.isEqual(e.src, r.src))
        if(!exists){
          this.untraced.push(r)
        }
      }
    }
  }

  isEnergized(tile){
    for(let r of this.traced){
      let row, col
      [row, col] = _.zip(r.src, r.end)
      row.sort( (a,b) => a - b)
      col.sort( (a,b) => a - b)
      let inRow = row[0] <= tile[0] && tile[0] <= row[1]
      let inCol = col[0] <= tile[1] && tile[1] <= col[1]      
      if (inRow && inCol){
        return true
      }
    }             
    return false
  }

  // naive (cough, slow, cough)
  // but works!
  countEnergized(){
    let sum = 0
    for(let r = 0; r < this.rows; r++){
      for(let c = 0; c < this.cols; c++){
        if(this.isEnergized([r,c])){
          sum++
        }
      }
    }
    return sum
  }

  print(){
    console.log('='.repeat(this.cols*2 + 3))
    for(let r = 0; r < this.rows; r++){
      let row = [r, '|']
      for (let c = 0; c < this.cols; c++){
        let m = this.all.find(m => _.isEqual(m.loc, [r,c]))
        let isEnergized = this.isEnergized([r,c])
        if (m){
          row.push(isEnergized ? chalk.yellowBright(m.type) : chalk.blueBright(m.type))
        } else {
          row.push(isEnergized ? chalk.yellowBright('#') : chalk.white.dim('.'))
        }
      }
      console.log(row.join(' '))
    }
    console.log('='.repeat(this.cols*2 + 3))
  }
  
  static parse(file){
    let lines = fs.readFileSync(file, 'utf-8').split('\n')
    let mirrors = []
    lines.forEach( (line, row) => {
      Array.from(line).forEach( (c, col) => {
        if (c != '.') {
          mirrors.push({
            type: c,
            loc: [row, col]
          })
        }
      })
    })
    let rows = lines.length
    let cols = lines[0].length
    return new Mirrors(rows, cols, mirrors)
  }
}

let file
[file] = process.argv.splice(2)

let mirrors = Mirrors.parse(file)

let energy = mirrors.shootBeam({
  src: [0,-1],
  dir: 'right',
  end: undefined
})
console.log('Part 1:', energy)

let maxEnergy = Number.NEGATIVE_INFINITY

// // try everything along the top
for(let i = 0; i < mirrors.cols; i++){
  let energy = mirrors.shootBeam({
    src: [-1,i],
    dir: 'down',
    end: undefined
  })
  maxEnergy = Math.max(maxEnergy, energy)
}

// // try everything along the bottom
for(let i = 0; i < mirrors.cols; i++){
  let energy = mirrors.shootBeam({
    src: [mirrors.rows+1,i],
    dir: 'up',
    end: undefined
  })
  maxEnergy = Math.max(maxEnergy, energy)
}

// // try everything along the left
for(let i = 0; i < mirrors.rows; i++){
  let energy = mirrors.shootBeam({
    src: [i, -1],
    dir: 'right',
    end: undefined
  })
  maxEnergy = Math.max(maxEnergy, energy)
}

// // try everything all the right
for(let i = 0; i < mirrors.rows; i++){
  let energy = mirrors.shootBeam({
    src: [mirrors.cols + 1, -1],
    dir: 'left',
    end: undefined
  })
  maxEnergy = Math.max(maxEnergy, energy)
}

console.log('Part 2:', maxEnergy)