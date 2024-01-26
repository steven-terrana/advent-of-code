export function lookAndSay(input: string){
    let str = Array.from(input)
    let output = ''

    let previous = undefined
    let counter = 0
    while(str.length){
        const current = str.shift()
        if(current != previous && previous != undefined){
            output += `${counter}${previous}`
            counter = 1
        } else {
            counter++
        }
        previous = current
    }
    output += `${counter}${previous}`

    return output
}

if (import.meta.main){
    let part1, part2
    let input = '1113222113'
    for(let i = 0; i < 50; i ++){
        input = lookAndSay(input)
        if (i == 39){
            part1 = input.length
        }
    }
    part2 = input.length
    console.log('Part 1:', part1)
    console.log('Part 2:', part2)
}