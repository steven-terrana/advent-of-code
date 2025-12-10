type Point = [number, number]
type Edge = [Point, Point]
type Polygon = Edge[]

const coordinates: Point[] = await Bun.file("input.txt").text().then(text => {
  return text.split("\n").map(line => {
    return line.split(",").map(n => parseInt(n.trim())) as Point
  })
})

let edges: Edge[] = []
for (let a = 0; a < coordinates.length - 1; a++){
  edges.push([coordinates[a]!, coordinates[a + 1]!])
}
edges.push([coordinates.at(-1)!, coordinates[0]!])

function isOnEdge(p: Point){
  const [px, py] = p
  for (let [[ax, ay], [bx, by]] of edges){
    if (ax === bx && bx === px){
      let points = [ay, py, by].sort()
      if (points[1] === py){
        return true
      }
    } else if (by === py){
      // vertical edge
      let points = [ax, px, bx].sort()
      if (points[1] === px){
        return true
      }
    }
  }
  return false
}

function pointInPolygon(p: Point){
  const [px, py] = p
  if (isOnEdge(p)){
    return true
  }
  // raycast now horizontally to the right  
  const crossings = edges.filter( ([[ax, ay], [bx, by]]) => {
    if (px < Math.min(ax, bx)){
      return false
    }
    if (py !== [ay, py, by].sort().at(1)){
      return false
    }
    return true
  })
  return crossings.length % 2 === 1
}

function segmentsIntersect(e1: Edge, e2: Edge): boolean {
  const [[x1, y1], [x2, y2]] = e1
  const [[x3, y3], [x4, y4]] = e2

  const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
  if (denom === 0) return false // parallel

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
  const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom

  // strict interior intersection (not at endpoints)
  return t > 0 && t < 1 && u > 0 && u < 1
}

function segmentInPolygon(edge: Edge){
  const [[ax, ay], [bx, by]] = edge
  // check if segment crosses any polygon edge in the interior
  for (const polyEdge of edges) {
    if (segmentsIntersect(edge, polyEdge)) {
      return false
    }
  }
  // check midpoint is inside polygon
  const midX = (ax + bx) / 2
  const midY = (ay + by) / 2
  return pointInPolygon([midX, midY])
}

function calculateArea(a: Point, b: Point){
  const [ax, ay] = a
  const [bx, by] = b
  return (1 + Math.abs(ax - bx)) * (1 + Math.abs(ay - by))
}

function isValidRectangle(a: Point, b: Point){
  const [ax, ay] = a
  const [bx, by] = b
  const leftx = Math.min(ax, bx)
  const rightx = Math.max(ax, bx)
  const bottomy = Math.min(ay, by)
  const topy = Math.max(ay, by) 
  const left: Edge = [[leftx, bottomy], [leftx, topy]]
  const right: Edge = [[rightx, bottomy], [rightx, topy]]
  const bottom: Edge = [[leftx, bottomy], [rightx, bottomy]]
  const top: Edge = [[leftx, topy], [rightx, topy]]
  for (let s of [left, right, bottom, top]){
    if (!segmentInPolygon(s)){
      return false
    }
  }
  return true
}

// 1. find all the areas
// 2. sort by biggest areas
// 3. first valid rectangle found is biggest
let areas: [number, Point, Point][] = []
for (let a = 0; a < coordinates.length - 1; a++){
  for(let b = a + 1; b < coordinates.length; b++){
    let area = calculateArea(coordinates[a]!, coordinates[b]!)
    areas.push([area, coordinates[a]!, coordinates[b]!])
  }
}

areas.sort( (a, b) => b[0] - a[0])

let firstValid = areas.find( a => isValidRectangle(a[1], a[2]))

console.log(firstValid[0])