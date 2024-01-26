const key = 'cuanljph'
const hasher = new Bun.CryptoHasher('md5')

function findIndex(n: number, hashingFunction: (x: string) => string){
    let found = 0
    let i = 0
    while(true){
        let hash = hashingFunction(`${key}${i}`)
        let m = /(.)\1\1/.exec(hash)
        if (m){
            let regex = new RegExp(m[1].repeat(5))
            for (let j = i + 1; j < i + 1000; j++){
                let hash2 = hashingFunction(`${key}${j}`)
                if(regex.test(hash2)){
                    found++
                    if(found == n){
                        return i
                    }
                    break
                }
            }
        }
        i++
    }
}

let cache = new Map<number, Map<string, string>>

function hasherFunction(n: number){
    return function(x: string){
        if (cache.get(n)?.has(x)){
            return cache.get(n)?.get(x)!
        }
        let hashed = x
        for(let i = 0; i < n; i++){
            hashed = hasher.update(hashed).digest('hex')
        }
        if (!cache.has(n)){
            cache.set(n, new Map<string,string>)
        }
        cache.get(n)?.set(x, hashed)
        return hashed
    }
}

console.log('Part 1:', findIndex(64, hasherFunction(1)))
console.log('Part 1:', findIndex(64, hasherFunction(2017)))