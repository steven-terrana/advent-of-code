import ingredientsRaw from './input.txt'

interface Ingredient{
    name: string;
    capacity: number;
    durability: number;
    flavor: number; 
    texture: number;
    calories: number;
}

let ingredients: Ingredient[] = []
for (let line of ingredientsRaw.split('\n')){
    let parts = line.split(' ')
    ingredients.push({
        name: parts[0].slice(0,-1),
        capacity: parseInt(parts[2]),
        durability: parseInt(parts[4]),
        flavor: parseInt(parts[6]),
        texture: parseInt(parts[8]),
        calories: parseInt(parts[10])
    })
}

/*
    given a total to distribute T and a number of elements
    to distribute to K, returns an array of all possible
    distributions.  so.. distribute(4, 2) yields:
    [
        [0, 4]
        [1, 3]
        [2, 2]
        [3, 1]
        [4, 0]
    ]
*/
function distribute(T: number, K: number){
    let options: number[][] = []
    const dist = (existing: number[], N: number, items: number[]) => {
        if (items.length == 1){
            existing.push(N)
            options.push(existing)
            return
        }
        for (let n = 0; n <= N; n++){
            let e = existing.slice()
            let new_i = items.slice()
            let i = new_i.shift()
            i = n
            e.push(i)
            dist(e, N - n, new_i)
        }
    }
    dist([], T, Array(K).fill(0))    
    return options
}

let options = distribute(100, ingredients.length)

let bestScore = -Infinity
let bestDietScore = -Infinity
for(let o of options){
    let capacity = 0
    let durability = 0
    let flavor = 0
    let texture = 0
    let calories = 0
    for (let i: number = 0; i < o.length; i++){
        capacity += o[i] * ingredients[i].capacity
        durability +=o[i] * ingredients[i].durability
        flavor +=o[i] * ingredients[i].flavor
        texture +=o[i] * ingredients[i].texture
        calories +=o[i] * ingredients[i].calories
    }
    let score = Math.max(capacity, 0) * 
                Math.max(durability, 0) * 
                Math.max(flavor, 0) *
                Math.max(texture, 0)
    if (score > bestScore){
        bestScore = score
    }
    if (calories == 500 && score > bestDietScore){
        bestDietScore = score
    }
}

console.log('Part 1:', bestScore)
console.log('Part 2:', bestDietScore)