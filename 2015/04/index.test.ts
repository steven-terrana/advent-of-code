import {expect, test} from 'bun:test'
import { getNumber } from '.'

test.each([
    {key: 'abcdef', number: 609043},
    {key: 'pqrstuv', number: 1048970} 
])('Part 1', ({key, number}) => {
    expect(getNumber(key)).toBe(number)
})