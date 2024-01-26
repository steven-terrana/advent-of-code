function crackDoor1(doorId: string, leadingZeros: number=5, passwordLength: number=8): string{
    const hasher = new Bun.CryptoHasher('md5')
    let password: string[] = []
    let i = 0
    while(password.length < passwordLength){
        let val = hasher.update(`${doorId}${++i}`).digest('hex')
        if(val.startsWith('0'.repeat(leadingZeros))){
            password.push(val[leadingZeros])
        }
    }
    return password.join('')
}

function crackDoor2(doorId: string, leadingZeros: number=5, passwordLength: number=8): string{
    const hasher = new Bun.CryptoHasher('md5')
    let password = Array(passwordLength)
    let i = 0
    while(password.includes(undefined)){
        let val = hasher.update(`${doorId}${++i}`).digest('hex')
        if(val.startsWith('0'.repeat(leadingZeros))){
            let position = parseInt(val[leadingZeros])
            if (isNaN(position) || position < 0 || position > passwordLength - 1 || password[position] != undefined){
                continue
            }
            password[position] = val[leadingZeros+1] 
        }
    }
    return password.join('')
}

const doorId = 'uqwqemis'
console.log('Part 1:', crackDoor1(doorId))
console.log('Part 2:', crackDoor2(doorId))