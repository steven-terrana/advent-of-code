import {describe, test, expect} from "bun:test"
import {part1, part2} from './index.ts'
import type { Arrow } from './index.ts'

describe.each([
    {input: '>', p1: 2},
    {input: '^v', p2: 3},
    {input: '^>v<', p1: 4, p2: 3},
    {input: '^v^v^v^v^v', p1: 2, p2: 11}
])('Day 03', ({input, p1, p2}) => {
    if (p1){
        test('Part 1', () => {
            expect(part1(input.split('') as Arrow[]) as number).toBe(p1)
        })
    }
    if (p2){
        test('Part 2', () => {
            expect(part2(input.split('') as Arrow[]) as number).toBe(p2)
        })
    }
})