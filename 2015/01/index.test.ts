import { expect, test } from "bun:test"
import { part1, part2 } from "."

test.each([
    { input: '(())', output: 0},
    { input: '()()', output: 0},
    { input: '(((', output: 3},
    { input: '(()(()(', output: 3},
    { input: '))(((((', output: 3},
    { input: '())', output: -1},
    { input: '))(', output: -1},
    { input: ')))', output: -3},
    { input: ')())())', output: -3}
])(`$input is $output`, ({input, output}) => {
    expect(part1(input)).toBe(output)
})

test.each([
    { input: ')', output: 1},
    { input: '()())', output: 5},
])('$input is $output', ({input, output}) => {
    expect(part2(input, -1)).toBe(output)
})