export function getNumber(key: string, leadingZeros: number=5): number{
    const hasher = new Bun.CryptoHasher('md5')
    let i = 0
    while(true){
        let val = hasher.update(`${key}${++i}`).digest('hex')
        if(val.startsWith('0'.repeat(leadingZeros))){
            break
        }
    }
    return i
}

if (import.meta.main){
    console.log('Part 1:', getNumber('bgvyzdsv', 5))
    console.log('Part 2:', getNumber('bgvyzdsv', 6))
}