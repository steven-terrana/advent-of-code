// calculates the value of the cell in the table defined by [row,col]
// the README explains the math behind this function
function calculateRepetitions(row: number, col: number): number{
    let f0 = (col + col**2)/2
    let f1 = f0 + col
    let f2 = f0 + 2 *col + 1
    let C = f0
    let B = (f2 + 3 * f0 - 4 * f1) / -2
    let A = f1 - B - C
    let n = row - 1
    console.log(row,col)
    return A * n**2 + B * n + C
}

let value = 20151125
let repetitions = calculateRepetitions(2947,3029)
for (let i = 1; i < repetitions; i++){
    value *= 252533
    value %= 33554393
}

console.log(value)