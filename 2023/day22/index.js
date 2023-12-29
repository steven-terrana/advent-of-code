import fs from 'fs'

function parse(){
  let file
  [file] = process.argv.splice(2)
  file = file ?? 'test.txt'
  let lines = fs.readFileSync(file, 'utf-8').split('\n')
  let bricks = []
  for (let i = 0; i < lines.length; i++){
    let brickS = lines[i]
    let id = i
    let a,b
    [a,b] = brickS.split('~').map( coord => coord.split(',').map( n => +n))
    let brick = new Brick(a,b)
    brick.id = id
    bricks.push(brick)
  }
  return bricks
}

class Brick {
  constructor(a,b){
    this.a = a
    this.b = b
    this.minX = Math.min(a[0], b[0])
    this.maxX = Math.max(a[0], b[0])
    this.minY = Math.min(a[1], b[1])
    this.maxY = Math.max(a[1], b[1])
    this.minZ = Math.min(a[2], b[2])
    this.maxZ = Math.max(a[2], b[2])
    this.supporting = []
    this.supportedBy = []
  }
  /*
    this brick is resting on another one
    if an incremental decrease in the z
    axis would result in a collision.
    https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection#aabb_vs._aabb
  */
  isRestingOn(brick){
    let minZ, maxZ
    minZ = this.minZ - 1
    maxZ = this.maxZ - 1
    return this.minX <= brick.maxX &&
           this.maxX >= brick.minX &&
           this.minY <= brick.maxY &&
           this.maxY >= brick.minY &&
                minZ <= brick.maxZ &&
                maxZ >= brick.minZ
  }
  fall(){
    this.a[2]--
    this.b[2]--
    this.minZ = Math.min(this.a[2], this.b[2])
    this.maxZ = Math.max(this.a[2], this.b[2])
  }
}

function falling(_bricks){
  let fallen = new Set()
  // bricks are still falling if we get through a loop and nothing has moved
  let numFalls = 1
  while(numFalls > 0){
    numFalls = 0
    bricksLoop: for (let i = 0; i < _bricks.length; i++){
      let brick = _bricks[i]
      // see if this brick is resting on the ground
      if (brick.minZ === 1){
        continue
      }
      // otherwise, see if we're resting on another brick
      for (let p of _bricks){
        if(p.id === brick.id){
          continue
        }
        if (brick.isRestingOn(p)){
          continue bricksLoop
        }
      }
      // it's possible to fall, so fall
      brick.fall()
      fallen.add(brick.id)
      numFalls++
    }
  }
  return fallen
}

let bricks = parse()
bricks.sort( (i,j) => Math.min(i.a[2], i.b[2]) - Math.min(j.a[2], j.b[2]))

falling(bricks)

// now figure out what is supporting what
for (let i = 0; i < bricks.length-1; i++){
  let brick = bricks[i]
  for (let n of bricks){
    if(n.id === brick.id){
      continue
    }
    if (n.isRestingOn(brick)){
      n.supportedBy.push(brick)
      brick.supporting.push(n)
    }
  }
}

let disintegrate = 0
for(let i = 0; i < bricks.length; i++){
  let brick = bricks[i]
  // if not supporting anything, safe to remove
  if (brick.supporting.length == 0){
    disintegrate++
    continue
  }
  // if supporting other bricks, safe to remove
  // if the other bricks have something else 
  // providing support
  let wouldFall = []
  for (let dependant of brick.supporting){
    if (dependant.supportedBy.length < 2){
      wouldFall.push(dependant.id)
    }
  }
  if (wouldFall.length == 0){
    disintegrate++
  }
}

console.log(`Part 1: ${disintegrate}`)

let total = 0
for (let i = 0; i < bricks.length; i++){
  let brick = bricks[i]
  let b = bricks.slice().filter(b => b.id != brick.id)
  let f = falling(b)
  total += f.size
  if(f.size > 0){
    console.log(`disintegrating brick ${brick.id} causes ${f.size} other bricks to fall`)
  }
}

console.log('Part 2:', total)