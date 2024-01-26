import strings from './input.txt'

function threeVowels(x: string): boolean {
    const vowels: string[] = ['a','e','i','o','u']
    return Array.from(x).filter(c => vowels.includes(c)).length >= 3
}

function twiceInRow(x: string): boolean {
    const regex: RegExp = new RegExp('(.)\\1')
    return regex.test(x)
}

function cantHave(x: string): boolean {
    const nopeList: string[] = ['ab', 'cd', 'pq', 'xy']
    return !nopeList.some(nope => x.includes(nope))
}

function twiceInRowNoOverlap(x: string): boolean {
    const regex: RegExp = new RegExp('(.)(.).*\\1\\2')
    return regex.test(x)
}

function sandwich(x: string): boolean {
    const regex: RegExp = new RegExp('(.)\\w\\1')
    return regex.test(x)
}

type Condition = (x: string) => boolean

function isNice(x: string, conditions: Condition[]): boolean{
    return conditions.every( c => c(x) )
}

const part1Conditions = [threeVowels, twiceInRow, cantHave]
const part1: number = strings.split('\n').reduce( (sum,x) => sum + +isNice(x, part1Conditions), 0 )
console.log('Part 1:', part1)

const part2Conditions = [twiceInRowNoOverlap, sandwich]
const part2: number = strings.split('\n').reduce( (sum,x) => sum + +isNice(x, part2Conditions), 0 )
console.log('Part 2:', part2)