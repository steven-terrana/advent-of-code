import input from './input.txt'

// perfect sum problem or subset-sum problem
// variant of the knapsack problem when weight == value

let presents: number[] = input.split('\n').map(p => parseInt(p))

const sum = (x: number[]) => x.reduce( (s, p) => s + p, 0)
const product = (x: number[]) => x.reduce( (s,p) => s * p, 1)

function findSubsets(presents: number[], target: number): number[][] {
    let result: number[][] = []
    let stack: number[] = []

    function backtrack(start: number, remaining: number) {
        // base case: we've reached our target sum!
        if (remaining === 0) {
            result.push([...stack])
            return
        }

        for (let i = start; i < presents.length; i++) {
            // if current element is greater than the remaining sum, skip
            if (presents[i] > remaining) continue

            stack.push(presents[i])
            backtrack(i + 1, remaining - presents[i])
            stack.pop()
        }
    }

    // Start the backtracking process
    backtrack(0, target);

    return result;
}

function findQuantum(presents: number[], compartments: number){
    // step 1: make sure this is even possible
    let total = sum(presents)
    if (total % compartments != 0){
        throw new Error(`if the total weight isn't divisible by the number of compartments we can't have equal sums!`)
    }

    // step 2: find all the possible subsets that match the target sum
    let target = total / compartments
    let subsets = findSubsets(presents, target)

    // step 3: find the minimal length of a subset that sums to the target
    let minLength = Infinity
    subsets.forEach( s => minLength = Math.min(minLength, s.length))

    // step 4: filter our subsets to just those with this target length
    let f = subsets.filter(l => l.length == minLength)

    // step 5: the winner will be the one that has the smallest product
    let p = f.map(product)
    let minQuantum = Infinity
    p.forEach( s => minQuantum = Math.min(minQuantum, s))
    return minQuantum
}

console.log('Part 1:', findQuantum(presents, 3))
console.log('Part 2:', findQuantum(presents, 4))