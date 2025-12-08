import Graph from "graphology"
import {countConnectedComponents} from 'graphology-components';

class Point {
  x: number
  y: number
  z: number
  id: string | undefined = undefined
  constructor(x: number, y: number, z: number){
    this.x = x
    this.y = y
    this.z = z
  }
  dist(b: Point){
    const dx = Math.abs(this.x - b.x)
    const dy = Math.abs(this.y - b.y)
    const dz = Math.abs(this.z - b.z)
    return Math.sqrt(dx**2 + dy**2 + dz**2)
  }
  toString(){
    if (!this.id){
      this.id = [this.x, this.y, this.z].join(',')
    }
    return this.id
  }
}

const points = await Bun.file("input.txt").text()
.then(text => {
  return text.split('\n').map(line => {
    return new Point(...line.split(',').map(n => parseInt(n.trim())) as [number, number, number])
  }
)})

const g = new Graph()
points.forEach(p => g.addNode(p.toString()))

const heap: [number, Point, Point][] = []

for (let aIdx = 0; aIdx < points.length - 1; aIdx++){
  const a = points[aIdx] as Point
  for (let bIdx = aIdx + 1; bIdx < points.length; bIdx++){
    const b = points[bIdx] as Point
    const dist = a.dist(b)
    heap.push([dist, a, b])
  }
}

heap.sort( (a, b) => a[0] - b[0])

let i = 0
for (let i = 0; i < heap.length; i++){
  const h = heap[i]
  g.addEdge(h[1].toString(), h[2].toString()) 
  if (countConnectedComponents(g) === 1){
    console.log('part 2:', h[1].x * h[2].x)
    break
  }
}