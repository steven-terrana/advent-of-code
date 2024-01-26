function getFactors(n: number, maxHouses: number=Infinity): number[]{
    let half: number[] = []
    for (let i = 1; i <= Math.sqrt(n); i++){
        if (n % i == 0){
            half.push(i)
        }
    }
    let factors: number[] = []
    half.forEach(factor => {
        factors.push(factor, n / factor)
    })
    return factors.filter(f => (f * maxHouses) >= n)
}

function findHouse(presents: number, multiplier: number, maxHouses: number=Infinity){
    let i = 1;
    while(true){
        let factors = getFactors(i,maxHouses)
        let p = factors.reduce((sum, f) => sum + (multiplier * f), 0)
        if(p >= presents){
            break
        }
        i++
    }
    return i
}


let presents = 29000000
console.log('Part 1:', findHouse(presents, 10))
console.log('Part 2:', findHouse(presents, 11, 50))