const input = await Bun.file('input.txt').text()

let part1 = 0
let part2 = 0
for (let line of input.split(",")){
    const [lower, upper] = line.split("-").map( (i: string) => parseInt(i) )
    const repeatsTwice = /^([1-9]\d*)\1$/;
    const repeatsNTimes = /^([1-9]\d*)\1+$/;

    for(let id = lower; id <= upper; id++){
        const idString = id?.toString()
        if (repeatsTwice.test(idString)){
            part1 += id 
        }
        if (repeatsNTimes.test(idString)){
            part2 += id
        }
    }
}
console.log('Part 1:', part1)
console.log('Part 2:', part2)