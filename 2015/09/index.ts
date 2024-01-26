import input from './input.txt'

type City = string
type Distance = number
type DistanceMatrix = Map<City, Map<City, Distance>>

function parseMap(): DistanceMatrix{
    let m: DistanceMatrix = new Map<City, Map<City, Distance>>
    for (let line of input.split('\n')){
        let parts = line.split(' ')
        let A = parts[0] as City
        let B = parts[2] as City
        let distance = parseInt(parts[4]) as Distance
        [A, B].forEach(city => {
            if(!m.has(city)){
                m.set(city, new Map<City, Distance>)
                m.get(city)?.set(city, 0)
            }
        })
        m.get(A)?.set(B, distance)
        m.get(B)?.set(A, distance)
    }
    return m
}

function traverse(edges: DistanceMatrix, path: City[], remaining: City[], distance: Distance){
    let next = remaining.filter(city => !path.includes(city))
    // if there are no cities left to visit then check if this path
    // was shorter than the shortest found path
    if (next.length == 0){
        if (distance < shortest){
            shortest = distance
        }
        if (distance > longest){
            longest = distance
        }
        return
    }
    // try all possible next steps
    for (let city of next){
        let p: City[] = [...path, city]
        let r = next.filter( c => c != city)
        let d: Distance = p.length > 1 ? distance + edges.get(path[path.length-1])?.get(city)! : 0
        traverse(edges, p, r, d)
    }
}

const edges = parseMap()
let shortest = Infinity
let longest = -Infinity

traverse(edges, [], Array.from(edges.keys()), 0)

console.log('Part 1:', shortest)
console.log('Part 2:', longest)