import fs from 'fs'
import chalk from 'chalk'

const old_galaxy = "@"

function transpose(array){
  let newArray = []
  for(let i = 0; i < array.length; i++){
    for (let j = 0; j < array[0].length; j++){
      if (i == 0){
        newArray.push([ array[i][j] ])
      } else {
        newArray[j].push(array[i][j])
      }
    }
  }
  return newArray
}

function expandRows(array){
  let newRow = Array(array[0].length).fill(old_galaxy)
  return array.map( line => {
    if (line.every(c => ['.',old_galaxy].includes(c))){
      return newRow
    }
    return line
  })
}

function parseImage(file){
  let lines = fs.readFileSync(file, 'utf-8').split('\n').map( l => l.split(''))
  lines = expandRows(lines)
  lines = transpose(lines)
  lines = expandRows(lines)
  lines = transpose(lines)
  return lines
}

// returns an array of coordinates representing the
// individual galaxy locations
function parseGalaxies(image){
  let galaxies = []
  image.map( (line, row) => {
    let matches = Array.from(line.join('').matchAll(/#/g))
    matches.forEach(m => {
      galaxies.push([row, m.index])
    })
  })
  return galaxies
}

function computePermutations(galaxies){
  let permutations = []
  for(let i = 0; i < galaxies.length - 1; i++){
    for (let j=i+1; j < galaxies.length; j++){
      permutations.push([galaxies[i], galaxies[j]])
    }
  }
  return permutations
}

function prettyPrint(image, path){
  console.log('-----')
  for (let i = 0; i < image.length; i++){
    console.log(image[i].map( (c, j)=>{
      if (path.some( p => p[0] == i && p[1] == j )){
        return chalk.blueBright(c)
      } else {
        return chalk.white.dim(c)
      }
    }).join(''))
  }
  console.log('-----')
}

function computeShortestDistance(image, a, b, expansionFactor){
  let minRow = Math.min(a[0], b[0])
  let maxRow = Math.max(a[0], b[0])
  let minCol = Math.min(a[1], b[1])
  let maxCol = Math.max(a[1], b[1])
  let sum = 0
  let path = []
  for (let x = minCol; x <= maxCol; x++){
    path.push([minRow, x])
    let a = (image[minRow][x] == old_galaxy ? expansionFactor : 1)
    sum += a
  }
  for (let y = minRow+1; y <= maxRow; y++){
    path.push([y, maxCol])
    let a = (image[y][maxCol] == old_galaxy ? expansionFactor : 1)
    sum += a
  }
  // prettyPrint(image, path)
  return sum - 1
}

function sumShortestDistances(image, permutations, expansionFactor){
  return permutations.reduce( (sum, p) => sum += computeShortestDistance(image, p[0], p[1], expansionFactor), 0)
}

const image = parseImage('input.txt')
const galaxies = parseGalaxies(image)
const permutations = computePermutations(galaxies)
console.log('part 1: ', sumShortestDistances(image, permutations, 2))
console.log('part 2: ', sumShortestDistances(image, permutations, 1e6))