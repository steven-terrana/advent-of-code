import { test, expect } from 'bun:test'
import {lookAndSay} from '.'

test.each([
    { input: '1', output: '11'},
    { input: '11', output: '21'},
    { input: '21', output: '1211'},
    { input: '1211', output: '111221'},
    { input: '111221', output: '312211'},
])('Part 1', ({input, output}) => {
    expect(lookAndSay(input)).toBe(output)
})