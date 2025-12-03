const input = await Bun.file('input.txt').text()

type Battery = number[]
const batteries: Battery[] = input.split('\n').map( line => line.split('').map(i => parseInt(i)))

function max(battery: Battery, cells: number = 2): number {
    let result = []
    let start = 0
    for (let i = cells - 1; i >= 0; i--){
        let left = battery.slice(start, battery.length - i)
        let biggest = Math.max(...left)
        result.push(biggest)
        let biggestIdx = left.findIndex( c => c === biggest )
        start = start + biggestIdx + 1
    }
    return parseInt(result.join(''))
}

let part1 = batteries.reduce((total: number, b: Battery) => total + max(b), 0)
let part2 = batteries.reduce((total: number, b: Battery) => total + max(b, 12), 0)
console.table({part1, part2})