function dragonData(input: string, diskSize: number): string{
    let data = input
    while(data.length < diskSize){
        let a = data
        let b = Array.from(a).reverse().map(c => {
            if(c == '1'){
                return '0'
            } else if (c == '0'){
                return '1'
            } else {
                return c
            }
        }).join('')
        data = a + '0' + b
    }
    return data.substring(0, diskSize)
}

function checksum(initial: string, diskSize: number): string{
    let data = dragonData(initial, diskSize)
    let checksum: string
    do{
        checksum = ''
        let d = Array.from(data)
        for(let i = 0; i < d.length-1; i+=2){
            if(d[i] == d[i+1]){
                checksum += '1'
            } else {
                checksum += '0'
            }
        }
        data = checksum
    }while(checksum.length % 2 == 0)
    return checksum
}

console.log('Part 1:', checksum('10001110011110000', 272))
console.log('Part 2:', checksum('10001110011110000', 35651584))