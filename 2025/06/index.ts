const input = await Bun.file('input.txt').text()

const operations = {
    '*': (numbers: number[]) => numbers.reduce( (total, current) => total *= current, 1),
    '+': (numbers: number[]) => numbers.reduce( (total, current) => total += current, 0)
}

// part 1
let lines = []
for (let line of input.trim().split('\n')){
    const l = line.trim().split(/\s+/).map( n => {
        let x = parseInt(n)
        return isNaN(x) ? n : x
    })
    lines.push(l)
}

let part1 = 0
for (let c = 0; c < lines[0].length; c++){
    const problem = lines.map( line => line[c] )
    const o = problem.pop()
    const answer = operations[o](problem)
    part1 += answer
}

// part 2
let part2 = 0
let grid = input.split('\n').map(line => line.split(""))
let problem = []
for (let c = grid[0].length - 1; c >= 0; c--){
    const column = grid.map(l => l.at(c))
    const o = column.pop() as string
    problem.push(parseInt(column.join('')))
    if (o in operations){
        part2 += operations[o](problem)
        problem = []
        c--
    }
}

console.table({part1, part2})