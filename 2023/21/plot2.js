const fileInput = document.querySelector('input[type="file"]');
const eventLog = document.querySelector(".event-log-contents");
const reader = new FileReader();

function handleEvent(event) {
  if (event.type === "load") {
    main(reader.result)
  }
}

function addListeners(reader) {
  reader.addEventListener("loadstart", handleEvent);
  reader.addEventListener("load", handleEvent);
  reader.addEventListener("loadend", handleEvent);
  reader.addEventListener("progress", handleEvent);
  reader.addEventListener("error", handleEvent);
  reader.addEventListener("abort", handleEvent);
}

function handleSelected(e) {
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    addListeners(reader);
    reader.readAsText(selectedFile);
  }
}

fileInput.addEventListener("change", handleSelected);

function parse(input = undefined){
  let lines
  if (input == undefined){
    let file
    [file] = process.argv.slice(2)
    file = file ?? 'test.txt'
    lines = fs.readFileSync(file, 'utf-8').split("\n")
  } else {
    lines = input.split('\n')
  }

  let map = lines.map( l => l.split(''))
  for(var i = 0; i < lines.length; i++){
    let line = lines[i]
    let S = line.indexOf('S')
    if (S >= 0){
      return new Garden(map, [i, S])
    }
  }
}

function plotHeatMap(garden){
  let minX, maxX, minY, maxY
  let x,y
  [x,y]= _.unzip(Array.from(garden.locsAtN).map( n => JSON.parse(n)))
  minX = x.reduce( (min, x) => x < min ? x : min, minX ?? Infinity)
  maxX = x.reduce( (max, x) => x > max ? x : max, maxX ?? -Infinity)
  minY = y.reduce( (min, y) => y < min ? y : min, minY ?? Infinity)
  maxY = y.reduce( (max, y) => y > max ? y : max, maxY ?? -Infinity)
 
  let rows = maxX - minX
  let cols = maxY - minY

  let grid = []
  for(let i = 0; i <= rows; i++){
    let row = []
    for (let j = 0; j <= cols; j++){
      let x = i + minX
      let y = j + minY
      row.push(0)
      if (garden.get(x,y) === Garden.rock){
        row[row.length-1]++
      }
      if (garden.locsAtN.has(JSON.stringify([x,y]))){
        row[row.length-1] += 2
      }
    }
    grid.push(row)
  }
  
  // var layout = {
  //   title: title,
  //   autosize: false,
  //   width: 1000,
  //   height: 1000,
  // }

  // let body = document.querySelector('body')
  // let plot = document.createElement('div')
  // let id = crypto.randomUUID()
  // plot.setAttribute('id', id)
  // body.appendChild(plot)
  // Plotly.newPlot(id, [{ type: 'heatmap', z: grid }], layout)

  return { type: 'heatmap', z: grid }
}

function walk({input, steps, offset, title, manhattan, endOnEven}){
  g = parse(input)
  g.starting_position = [
    g.starting_position[0] + offset[0],
    g.starting_position[1] + offset[1],
  ]
  let total
  if (manhattan) {
    total = g.walkManhattan(steps, endOnEven)
  } else { 
    total = g.walk(steps)
  }
  return {total: total, heatMap: plotHeatMap(g) }
}

/*

'y = 14913x^2 + 15004x + 3778'


For part 2, we can stop thinking in terms of the original garden's dimensions 
given that the garden now repeats infinitely in all directions.

If you take a look at a colorized grid showing the rocks - you'll immediately
notice that there's a 

We begin in the middle and it'll take 65 steps to reach the perimeter of our
current diamond. This center diamond we'll denote as A.

Look at the diamond created by 65 + 131 steps:

N = 0

  A

N = 1
    A
   B B
  A A A
   B B
    A


N = 2
     A
    B B 
   A A A
  B B B B
 A A A A A
  B B B B
   A A A
    B B
     A 

N = 3 \ 27
      A
     B B
    A A A
   B B B B
  A A A A A
 B B B B B B
A A A A A A A
 B B B B B B
  A A A A A
   B B B B
    A A A
     B B
      A 

 
width = (2*N + 1)

sum of A elements is the twice the sum of odd numbers with N + 1 terms less the
number A elements in the center, which'll be double counted
where the sum of odd numbers with x terms is x^2
so 2(N+1)^2 - (2N + 1)

```math
2(N + 1)^2 - (2N + 1)
```

*/
function main(input){

  let body = document.querySelector('body')

  let data = []
  let AME = walk({
    title: 'A Diamond',
    input: input,
    offset: [0,0],
    steps: 65,
    manhattan: true,
    endOnEven: 0
  })
  data.push(AME.heatMap)
  let A_even = AME.total -1

  let AMO = walk({
    title: 'A Diamond',
    input: input,
    offset: [0,0],
    steps: 65,
    manhattan: true,
    endOnEven: 1
  })
  data.push(AMO.heatMap)
  let A_odd = AMO.total - 1

  let BME = walk({
    title: 'B Diamond',
    input: input,
    offset: [65,65],
    steps: 65, 
    manhattan: true,
    endOnEven: 0
  })
  data.push(BME.heatMap)
  let B_even = BME.total -1

  let BMO = walk({
    title: 'B Diamond',
    input: input,
    offset: [65,65],
    steps: 65, 
    manhattan: true,
    endOnEven: 1
  })
  data.push(BMO.heatMap)
  let B_odd = BMO.total -1

  for (let i = 0; i < data.length; i++){
    let plot = document.createElement('div')
    let id = crypto.randomUUID()
    plot.setAttribute('id', id)
    body.appendChild(plot)
    console.log(data[i])
    console.log(id)
    Plotly.newPlot(id, [ data[i] ], { autosize: false, width: 1000, height: 1000 })
  }

  console.log(A_even, A_odd, B_even, B_odd)

  let steps = (N) => 65 + N * 131
  Array.from([0, 1, 2, 3]).forEach( N => {
    let actual = walk({
      title: `Actually Walked - N = ${N}`,
      input: input,
      steps: steps(N),
      offset: [0,0],
      manhattan: false
    })
    let calculated = (N, A, B) => {
      let a_part = (2 * Math.pow(N,2) + 2 * N + 1) * A
      let b_part = (4 * Math.pow(N,2) + 2 * N) * B
      return a_part + b_part
    }
    console.log({
      N: N,
      actual: actual.total,
      calculated_even: calculated(N,A_even,B_even),
      calculated_odd: calculated(N,A_odd,B_odd)
    })
    let plot = document.createElement('div')
    let id = crypto.randomUUID()
    plot.setAttribute('id', id)
    body.appendChild(plot)
    Plotly.newPlot(id, [ actual.heatMap ], { autosize: false, width: 1000, height: 1000 })
  })
}

// a queue that does not
// allow for duplicated elements
class Queue{
  items = new Set()
  length = 0
  push(...args){
    for (let a of args){
      this.items.add(JSON.stringify(a))
    }
    this.length = this.items.size
  }
  shift(){
    let item = this.items.values().next().value
    this.items.delete(item)
    this.length = this.items.size
    return JSON.parse(item)
  }
}

class Garden{
  static rock = '#'
  constructor(map, starting_position){
    this.map = map
    this.starting_position = starting_position
    this.locsAtN = new Set()
    this.visited = new Set()
  }

  get(x,y){
    let R = this.map.length
    let C = this.map[0].length
    let _x = x >= 0 ? (x % R) : (x % R + R) % R
    let _y = y >= 0 ? (y % C) : (y % C + C) % C
    return this.map[_x][_y]
  }

  // finds the next available steps based on
  nextSteps(loc, n){
    let directions = [ [0, 1], [0, -1], [1, 0], [-1, 0] ]
    let nextSteps = []
    for (let d of directions){
      let dx, dy
      [dx,dy] = d
      let x2 = loc.x + dx
      let y2 = loc.y + dy
      // no walking into rocks
      if (this.get(x2,y2) === Garden.rock){
        continue
      }
      // if we have already determined we can end here
      // we don't need to come back
      if (this.locsAtN.has(JSON.stringify([x2,y2]))){
        continue
      }
      // make sure we're staying within the max steps
      if (loc.n + 1 > n){
        continue
      }
      nextSteps.push({
        x: x2,
        y: y2, 
        n: loc.n + 1
      })
    }
    return nextSteps
  }

  walk(n){
    let queue = new Queue()
    
    queue.push({
      x: this.starting_position[0],
      y: this.starting_position[1],
      n: 0
    })

    /*
      to reduce the search space, we know we'll eventually
      be able to stop on a given spot if we reach the 
      spot with an even number of steps remaining
    */
    const canEndHere = (N) => !Boolean((N-n) % 2)
    while (queue.length > 0){
      let curLoc = queue.shift()
      if (canEndHere(curLoc.n)){
        this.locsAtN.add(JSON.stringify([curLoc.x, curLoc.y]))
      }
      let next = this.nextSteps(curLoc, n)
      queue.push(...next)
    }

    return this.locsAtN.size
  }

  manhattan(loc){
    return Math.abs(loc.x - this.starting_position[0]) + Math.abs(loc.y - this.starting_position[1])
  }

  nextStepsManhattan(loc, n, endOnEven){
    let directions = [ 
      [-1,-1], [-1, 0], [-1, 1], 
      [ 0,-1],          [0,  1], 
      [1, -1], [1,  0], [1,  1] 
    ]
    let nextSteps = []
    for (let d of directions){
      let dx, dy
      [dx,dy] = d
      let x2 = loc.x + dx
      let y2 = loc.y + dy
      let neighbor = {
        x: x2,
        y: y2, 
        n: !loc.n 
      }
      // been here before
      if (this.visited.has(JSON.stringify(neighbor))){
        continue
      }
      // if we have already determined we can end here
      // we don't need to come back
      if (this.locsAtN.has(JSON.stringify([x2,y2]))){
        continue
      }
      // make sure we're staying within the max steps
      let m = this.manhattan(neighbor)
      if (m > n || m % 2 != endOnEven){
        continue
      }
      nextSteps.push(neighbor)
    }
    return nextSteps
  }

  walkManhattan(n, endOnEven){
    let queue = new Queue()
    
    queue.push({
      x: this.starting_position[0],
      y: this.starting_position[1],
      n: true
    })

    /*
      to reduce the search space, we know we'll eventually
      be able to stop on a given spot if we reach the 
      spot with an even number of steps remaining
    */
    const canEndHere = (loc) => {
      if (this.manhattan(loc) == 0){
        if (endOnEven == 0){
          return true
        } else {
          return false
        }
      }
      return this.get(loc.x,loc.y) !== Garden.rock
    }
    while (queue.length > 0){
      let curLoc = queue.shift()
      this.visited.add(JSON.stringify(curLoc))
      if (canEndHere(curLoc,endOnEven)){
        this.locsAtN.add(JSON.stringify([curLoc.x, curLoc.y]))
      }
      let next = this.nextStepsManhattan(curLoc, n, endOnEven)
      queue.push(...next)
    }

    return this.locsAtN.size
  }

  walkManhattanCountRocks(n, endOnEven){
    let queue = new Queue()
    
    queue.push({
      x: this.starting_position[0],
      y: this.starting_position[1],
      n: true
    })

    /*
      to reduce the search space, we know we'll eventually
      be able to stop on a given spot if we reach the 
      spot with an even number of steps remaining
    */
    const canEndHere = (loc) => {
      if (this.manhattan(loc) == 0){
        if (endOnEven == 0){
          return true
        } else {
          return false
        }
      }
      return this.get(loc.x,loc.y) == Garden.rock
    }
    while (queue.length > 0){
      let curLoc = queue.shift()
      this.visited.add(JSON.stringify(curLoc))
      if (canEndHere(curLoc,endOnEven)){
        this.locsAtN.add(JSON.stringify([curLoc.x, curLoc.y]))
      }
      let next = this.nextStepsManhattan(curLoc, n, endOnEven)
      queue.push(...next)
    }

    return this.locsAtN.size
  }
}