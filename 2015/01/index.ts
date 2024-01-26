import input from './input.txt'

/*
    an elevator reads instructions to move between floors
    ( -> go up 1 floor
    ) -> go down 1 floor
*/

/*
    given a set of instructions find the final floor 
    the elevator stops on
*/
export function part1(input: string){
    let floor = 0
    for(let i = 0; i < input.length; i++){
        if (input[i] == '('){
            floor++
        } else if (input[i] == ')'){
            floor--
        }
    }
    return floor
}

/*
    given an input, find the number of instructions it
    takes to reach the target floor
*/
export function part2(input: string, target: number){
    let floor = 0
    for(let i = 0; i < input.length; i++){
        if (input[i] == '('){
            floor++
        } else if (input[i] == ')'){
            floor--
        }
        if (floor === target){
            return i + 1
        }
    }
}

if (import.meta.main) {
    console.log('Part 1:', part1(input))
    console.log('Part 2:', part2(input, -1))
}