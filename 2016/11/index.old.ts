import input from './input.txt'
import {isEqual, groupBy} from 'lodash'
import {MaxPriorityQueue} from '@datastructures-js/priority-queue'
import chalk from 'chalk'

interface Part {
    type: 'generator'|'microchip'
    element: string
    floor: number
}

interface Elevator {
    floor: number
    capacity: number
}

interface State {
    parts: Part[]
    elevator: Elevator
    steps: number
}

// parse input to build initial state
function parse(): Part[] {
    let parts: Part[] = []
    let floors = input.split('\n')
    for (let i = 0; i <  floors.length; i++){
        const floor = floors[i]
        let generators = [...floor.matchAll(/\w+(?=\sgenerator)/g)].flat()
        generators.forEach( g => parts.push({
            type: 'generator',
            floor: i,
            element: g
        }))
        let microchips = [...floor.matchAll(/\w+(?=-compatible)/g)].flat()
        microchips.forEach( m => parts.push({
            type: 'microchip',
            floor: i, 
            element: m
        }))
    }
    return parts
}

function findAllCombinations(parts: Part[], capacity: number) {
    let result: Part[][] = [];

    function recurse(start: number, path: Part[]) {
        if (1 <= path.length && path.length <= capacity) {
            result.push(clone(path))
        }
        if(path.length == capacity){
            return
        }
        for (let i = start; i < parts.length; i++) {
            path.push(parts[i])
            recurse(i + 1, path)
            path.pop()
        }
    }

    recurse(0, [])
    return result
}

// determines the next possible states
// to find the next possible states -
// 1. the elevator can go up 1 floor or down 1 floor
// 2. in either of those use cases, the elevator can take every combination of 1 to its capacity elements with it
function getNextStates({parts, elevator, steps}: State){
    let states: State[] = []
    // find the combinations of parts we could move this turn
    let partsOnFloor = parts.filter(p => p.floor == elevator.floor)
    let combos = findAllCombinations(partsOnFloor, elevator.capacity)
    // create a new state for each combo where the elevator goes up
    if (elevator.floor + 1 <= 3){
        for(let i = 0; i < combos.length; i++){
            let c = combos[i]
            // get all the parts that aren't part of this combo
            let untouched = parts.filter(a => !c.some(b => isEqual(a,b)))
            let newE = structuredClone(elevator)
            newE.floor++
            let touched = clone(c)
            touched.forEach(a => a.floor++)
            states.push({
                parts: clone([...untouched, ...touched]),
                elevator: newE,
                steps: steps + 1
            })
        }
    }
    // create a new state for each combo where the elevator goes down
    // only go down if there are parts on a floor lower than the elevator
    if (elevator.floor > Math.min(...parts.map(p => p.floor))){
        for(let i = 0; i < combos.length; i++){
            let c = combos[i]
            // get all the parts that aren't part of this combo
            let untouched = parts.filter(a => !c.some(b => isEqual(a,b)))
            let newE = structuredClone(elevator)
            newE.floor--
            let touched = clone(c)
            touched.forEach(a => a.floor--)
            states.push({
                parts: clone([...untouched, ...touched]),
                elevator: newE,
                steps: steps + 1
            })
        }
    }
    // filter out invalid states
    let valid = states.filter(s => isValid(s))
    // return the next possible states
    return valid
}

// determines if a given arrangement of parts is valid.
// contextually, valid means that we haven't fried any microchips
function isValid(state: State): boolean{
    // make sure there are no unmatched microchips on a floor with an unmatched generator
    let floors: Map<number, Part[]> = groupBy(state.parts, 'floor')
    for (let floor of Object.values(floors)){
        if (floor.length < 2){
            continue
        }
        let chips = floor.filter((p: Part) => p.type == 'microchip')
        let generators = floor.filter( (p: Part) => p.type == 'generator')
        for(let chip of chips){
            let isPaired = false
            let maybeFried = false
            for(let generator of generators){
                if (chip.element == generator.element){
                    isPaired = true
                } else {
                    maybeFried = true
                }
            }
            if(!isPaired && maybeFried){
                return false
            }
        }
    }

    return true
}

function printState(state: State){
    let nothing = chalk.dim.white('. ')
    let color = chalk.blueBright
    console.log('-'.repeat(10))
    for (let i = 3; i >= 0; i--){
        let floor = [`F${i}`]
        floor.push(state.elevator.floor == i ? color('E') : nothing)
        let order = ['HG', 'HM', 'LG', 'LM']
        order.forEach( o => {
            let p = state.parts.find(s => (s.element[0].toUpperCase() + s.type[0].toUpperCase()) == o )!
            floor.push(p.floor == i ? color(o) : nothing)
        })
        console.log(floor.join(' '))
    }
}

const clone  = (state: Part[]) => state.map(p => structuredClone(p))
const arrEquals = (s1: Part[], s2: Part[]) => s1.every(a => s2.some(b => isEqual(a, b)))
// const getPriority = (state: State) => state.parts.reduce((s: number, p: Part) => s + p.floor, 0)
const getPriority = (state: State) => state.steps


let parts = parse()

// the queue of states to check next, prioritized by the sum of the floor numbers of each part
// we want to start with states that are closest to the top floor
// let queue = new MaxPriorityQueue<State>({ priority: getPriority })
let queue: State[] = [{
    parts: parts, 
    elevator: {floor: 0, capacity: 2},
    steps: 0
}]

// the previous states we've seen before
let visited: Partial<State>[] = []
while(queue.length > 0){
    let element = queue.shift()!
    let {steps, parts, elevator} = element
    visited.push({
        elevator: elevator,
        parts: parts
    })
    // end condition is when each part is on the top floor (3)
    if (parts.every((p: Part) => p.floor == 3)){
        console.log(steps)
        break
    }
    let states = getNextStates({steps, parts, elevator})
    states.forEach(state => {
        if(!visited.some(v => isEqual(v.elevator, state.elevator) && arrEquals(v.parts!, state.parts))){
            queue.push(state)
        }
    })
}