import {MinPriorityQueue} from '@datastructures-js/priority-queue'
import chalk from 'chalk'

interface Location {
    x: number,
    y: number
}

interface State {
    loc: Location,
    steps: number
}

function isWall(x: number, y: number){
    let i = x*x + 3*x + 2*x*y + y + y*y + favoriteNumber
    let bits = Array.from(i.toString(2)).filter(c => c == '1').length
    return !(bits % 2 == 0)
}

function findNextSteps(loc: Location): Location[]{
    let directions = [
        {x:  0, y: -1}, // up
        {x:  0, y:  1},  // down
        {x:  1, y:  0},  // right
        {x: -1, y:  0}  // left
    ]
    let nextSteps: Location[] = []
    for(let d of directions){
        let x = loc.x + d.x
        let y = loc.y + d.y
        if(x < 0 || y < 0 || isWall(x,y)){
            continue
        }
        let step = { x: x, y: y}
        nextSteps.push(step)
    }
    return nextSteps
}

const favoriteNumber = 1358
const target: Location = { x: 31, y: 39 }

let queue = new MinPriorityQueue()

// track where we've been and how many steps it took to get there.
// we'll filter out step options that get us to the same spot in more steps
let visited = new Map<string, number>()

let start: Location = { x: 1, y: 1 }

queue.enqueue({
    loc: start, 
    steps: 0
}, 0)

while (queue.size() > 0){
    let {loc, steps} = queue.dequeue().element
    visited.set(JSON.stringify(loc), steps)
    if (loc.x == target.x && loc.y == target.y){
        console.log('Part 1:', steps)
        break
    }
    let nextSteps = findNextSteps(loc)
    for (let i = 0; i < nextSteps.length; i++){
        let step = nextSteps[i]
        // filter out steps
        let hash = JSON.stringify(step)
        if(visited.has(hash)){
            if (visited.get(hash)! < steps + 1){
                continue
            }
        }
        // prioritize closest to target, tiebreak on steps
        queue.enqueue({
            loc: step,
            steps: steps + 1
        }, steps)
    }
}

queue.clear()
queue.enqueue({
    loc: start, 
    steps: 0
}, 0)
let distinct = new Set<string>
while (queue.size() > 0){
    let {loc, steps} = queue.dequeue().element
    distinct.add(JSON.stringify(loc))
    let nextSteps = findNextSteps(loc)
    for (let i = 0; i < nextSteps.length; i++){
        let step = nextSteps[i]
        if (steps + 1 > 50 || distinct.has(JSON.stringify(step))) {
            continue
        }
        // prioritize closest to target, tiebreak on steps
        queue.enqueue({
            loc: step,
            steps: steps + 1
        }, steps)
    }
}

console.log('Part 2:', distinct.size)