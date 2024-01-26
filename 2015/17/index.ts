import input from './input.txt'

function storeEggnog(eggnog: number, containers: number[]): number[][]{
    let options: number[][] = []

    const distribute = (eggnog: number, used: number[], remaining: number[]) => {
        if (remaining.length == 1){
            if (eggnog == remaining[0]){
                used.push(remaining[0])
                options.push(used)
            }
            return
        }
        for (let i = 0; i < remaining.length; i++){
            let c = remaining[i]
            if (c <= eggnog){
                let e = eggnog - c
                let u = used.slice()
                u.push(c)
                if (e == 0){
                    options.push(u)
                } else {
                    let r = remaining.slice(i+1)
                    distribute(e,u,r)
                }
            }
        }
    }

    distribute(eggnog, [], containers)
    return options
}

let containers: number[] = []
for(let line of input.split('\n')){
    containers.push(parseInt(line))
}

let options = storeEggnog(150, containers)
console.log('Part 1:', options.length)

let min = Math.min(...options.map(o => o.length))
let part2 = options.filter(o => o.length == min).length
console.log('Part 2:', part2)