import { MinPriorityQueue } from "@datastructures-js/priority-queue"

interface State {
    x: number
    y: number
    history: string
}

function findNextSteps(passcode: string, state: State): State[]{
    const hasher = new Bun.CryptoHasher('md5')
    const [up, down, left, right] = hasher.update(`${passcode}${state.history}`).digest('hex')
    const isOpen = (s: string) => ['b','c','d','e','f'].includes(s)
    const directions = [
        { open: isOpen(up),    x:  0, y: -1, c: 'U' },
        { open: isOpen(down),  x:  0, y:  1, c: 'D' },
        { open: isOpen(left),  x: -1, y:  0, c: 'L' },
        { open: isOpen(right), x:  1, y:  0, c: 'R' }
    ]
    let next: State[] = []
    for (let d of directions.filter(d => d.open)){
        const s: State = {
            x: state.x + d.x,
            y: state.y + d.y,
            history: state.history + d.c
        }
        if(s.x < 0 || s.y < 0 || s.x > 3 || s.y > 3){
            continue
        }
        next.push(s)
    }
    return next
}

function shortest(passcode: string): State{
    // create a queue of next states
    let queue = new MinPriorityQueue()
    queue.enqueue({x: 0, y: 0, history: ''}, 0)

    const target: Partial<State> = { x: 3, y: 3 }

    while(queue.size() > 0){
        let state = queue.dequeue().element
        if (state.x == target.x && state.y == target.y){
            return state
        }
        // find next possible steps
        findNextSteps(passcode, state).forEach(s => {
            queue.enqueue(s, state.history.length)
        })
    }

    throw new Error('Unable to find a path')
}

function longest(passcode: string): number{
    // create a queue of next states
    let queue = new MinPriorityQueue()
    queue.enqueue({x: 0, y: 0, history: ''}, 0)

    const target: Partial<State> = { x: 3, y: 3 }

    let longest = -Infinity
    while(queue.size() > 0){
        let state = queue.dequeue().element
        if (state.x == target.x && state.y == target.y){
            if(state.history.length > longest){
                longest = state.history.length
            }
            continue
        }
        // find next possible steps
        findNextSteps(passcode, state).forEach(s => {
            queue.enqueue(s, state.history.length)
        })
    }

   return longest
}

console.log('Part 1:', shortest('ioramepc').history)
console.log('Part 2:', longest('ioramepc'))
