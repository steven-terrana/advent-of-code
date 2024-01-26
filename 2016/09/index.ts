import compressed from './input.txt'

export function decompress(x: string, recurse = (x: string) => x.length): number{
    let remaining = x
    let decompressed = 0
    while(remaining.length > 0){
        if (/^\((\d+)x(\d+)\)/.test(remaining)){
            let m = /^\((\d+)x(\d+)\)/.exec(remaining)
            let characters = parseInt(m[1])
            let repeat = parseInt(m[2])
            let compressedSubstring = remaining.substring(m[0].length, m[0].length + characters)
            decompressed += recurse(compressedSubstring, recurse) * repeat
            remaining = remaining.substring(m[0].length + characters)
        } else { 
            decompressed += remaining[0].length
            remaining = remaining.substring(1)
        }
    }
    return decompressed
}

if (import.meta.main){
    console.log(decompress(compressed))
    console.log(decompress(compressed, decompress))
}

// console.log('Part 1:', decompress(compressed).length)