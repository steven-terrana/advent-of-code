import input from './input.txt' 

function isABBA(ip: string): boolean{
    let outside = false
    let inside = false
    let brackets = ip[0] == '[' ? true : false
    for(let i = 1; i < ip.length; i++){
        let a = ip[i-1]
        let b = ip[i]
        let c = ip[i+1]
        let d = ip[i+2]
        if (b == '['){
            brackets = true
        } else if (b == ']'){
            brackets = false
        } else if (brackets){
            if (b === c && a === d && a !== b){
                inside = true
            }
        } else if (!brackets){
            if (b === c && a === d && a !== b){
                outside = true
            }
        }
    }
    return outside && !inside
}

function isSSL(ip: string): boolean{
    // all substrings inside brackets
    let inside: string[] = []
    // all substrings outside brackets
    let outside: string[] = []
    // whether or not the current index is inside a bracket
    let bracket = false
    // the substring being accumulated
    let current = ''
    // a list of aba candidate substrings found outside brackets
    let abaCandidates: string[] = []
    for(let i = 0; i < ip.length; i++){
        let prev = ip[i-1]
        let c = ip[i]
        let next = ip[i+1]
        if (!bracket){
            if(prev === next && prev !== c){
                abaCandidates.push(prev+c+next)
            }
        }
        if(c == '['){
            outside.push(current)
            current = ''
            bracket = true
        } else if (c == ']'){
            inside.push(current)
            current = ''
            bracket = false
        } else {
            current += c
        }
    }

    // if any of the aba candidates have a
    // bab substring within one of the inside bracket
    // substrings then this is a valid SSL ip
    for(let aba of abaCandidates){
        let a = aba[0]
        let b = aba[1]
        for (let sub of inside){
            if (sub.includes(b+a+b)){
                return true
            }
        }
    }
    return false
}

let abba = 0
let ssl = 0
for(let line of input.split('\n')){
    if(isABBA(line)){
        abba++
    }
    if (isSSL(line)){
        ssl++
    }
}
console.log('Part 1:', abba)
console.log('Part 2:', ssl)