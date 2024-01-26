import raw from './input.txt'

let input = eval(raw)

let n = 0
function sum(obj: any, filter: string|undefined=undefined){
    if (obj instanceof Array){
        obj.forEach( element => {
            sum(element, filter)
        })
    } else if (obj instanceof Object){
        let values = Object.values(obj)
        if (filter != undefined && values.includes(filter)){
            return
        }
        Object.values(obj).forEach( element => {
            sum(element, filter)
        })
    } else {
        if (typeof obj === 'number'){
            n += obj
        }
    }
}

sum(input)
console.log('Part 1:', n)

n=0
sum(input, 'red')
console.log('Part 2:', n)