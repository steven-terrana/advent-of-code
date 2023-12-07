import { getLines } from "../helpers/index.js"


export function parseSeeds(input){
  return input[0].split(":")[1].split(" ").map( s => parseInt(s.trim())).filter(n => n)
}

class Mapper{
  description = undefined
  ranges = []
  set description(d){
    this.description = d
  }
  addRange(r){
    this.ranges.push(r)
  }
  transform(input){
    // if we didn't find a match within the ranges.. then 
    // the output value is the same as the input value
    let output = input

    // for each range, check if the input falls within the source range
    for (const r of this.ranges){
      let destinationStart = r[0]
      let sourceStart = r[1]
      let range = r[2]
      if ( sourceStart <= input && input <= sourceStart + range - 1){
        let delta = destinationStart - sourceStart
        output = input + delta
        break
      }
    }
    
    return output
  }
}

export function parseMappers(input){
  let m = []
  var mapper
  input.slice(1,).forEach( line => {
    if (line == ''){
      // empty line indicates end of mapper definition
      // so if mapper is defined, push it
      mapper && m.push(mapper)
      mapper = new Mapper()
    }
    // line starts with character
    if (/^\D/.test(line)){
      mapper.description = line
    }
    // line is numbers separated by spaces
    if (/(\d+\s)+/.test(line)){
      let range = line.split(" ").map(n => parseInt(n))
      mapper.addRange(range)
    }    
  })
  if (mapper){
    m.push(mapper)
  }
  return m
}

export function calculateLocation(mappers, seed){
  return mappers.reduce( (location, m) => m.transform(location), seed)
}

let input = getLines("input.txt")
let seeds = parseSeeds(input)
let mappers = parseMappers(input)
let minLocation = Math.min(...seeds.map( s => calculateLocation(mappers, s)))

console.log(minLocation)