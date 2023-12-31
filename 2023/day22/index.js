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
    this.falling = false // for part 2
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

let bricks = parse()
bricks.sort( (i,j) => Math.min(i.a[2], i.b[2]) - Math.min(j.a[2], j.b[2]))

// drop all the bricks and let them settle
let numFalls = 1
while(numFalls > 0){
  numFalls = 0
  bricksLoop: for (let i = 0; i < bricks.length; i++){
    let brick = bricks[i]
    // see if this brick is resting on the ground
    if (brick.minZ === 1){
      continue
    }
    // otherwise, see if we're resting on another brick
    for (let p of bricks){
      if(p.id === brick.id){
        continue
      }
      if (brick.isRestingOn(p)){
        continue bricksLoop
      }
    }
    // it's possible to fall, so fall
    brick.fall()
    numFalls++
  }
}

// now figure out which bricks are supporting each other
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

let part1 = 0
let part2 = 0
for (let i = 0; i < bricks.length; i++){
  let brick = bricks[i]
  let falling = new Set([ brick.id ])
  let queue = brick.supporting
  while (queue.length > 0){
    let b = queue.shift()
    if(b.supportedBy.every(x => falling.has(x.id))){
      falling.add(b.id)
      let queueIDs = queue.map(x => x.id)
      queue.push(...b.supporting.filter(x => !queueIDs.includes(x.id)))
    }
  }

  let n = falling.size - 1
  if (n == 0){
    part1++
  }
  part2 += n
}

console.log('Part 1:', part1)
console.log('Part 2:', part2)