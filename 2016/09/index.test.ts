import { expect, test } from 'bun:test'
import { decompress } from '.'

test('ADVENT is 6', () => {
    expect(decompress('ADVENT')).toBe(6)
})

test('A(1x5)BC is 6', () => {
    expect(decompress('A(1x5)BC')).toBe(7)
})

test('(3x3)XYZ is 9', () => {
    expect(decompress('(3x3)XYZ')).toBe(9)
})

test('A(2x2)BCD(2x2)EFG is 11', () => {
    expect(decompress('A(2x2)BCD(2x2)EFG')).toBe(11)
})

test('(6x1)(1x3)A is 6', () => {
    expect(decompress('(6x1)(1x3)A')).toBe(6)
})

test('X(8x2)(3x3)ABCY is 6', () => {
    expect(decompress('X(8x2)(3x3)ABCY')).toBe(18)
})

