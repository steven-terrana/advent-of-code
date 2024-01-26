import { expect, test, describe } from "bun:test"
import { calculatePaper, calculateRibbon } from './index.js'

describe.each([
    {present: '2x3x4', paper: 58, ribbon: 34},
    {present: '1x1x10', paper: 43, ribbon: 14}
])('Day 02', ({present, paper, ribbon}) => {
    test('Wrapping paper', () => {
        expect(calculatePaper(present)).toBe(paper)
    })
    test('Ribbon', () => {
        expect(calculateRibbon(present)).toBe(ribbon)
    })
})