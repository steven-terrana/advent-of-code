import fs from 'fs'

/*
  the challenge is in the README.md.

  The approach here is to first realize that each map converting
  between types is a piecewise function that translates between
  coordinate systems. Representing it as such yields significant 
  efficiencies by using composite functions to simplify the system
  of equations down to a single transformation.

  see: 
  * https://en.wikipedia.org/wiki/Function_composition
  * https://ximera.osu.edu/csccmathematics/precalculus1/precalculus1/compositionPiecewise/piecewiseFunctions
 
  given the functions:
    f(seed) = soil
    g(soil) = fertilizer

  we can use composite functions to yield a g(f(seed)) = fertilizier through
  substitution. we can do this iteratively for each map to eventually yield
  a F(seed) = location that will be a single piecewise function that maps
  directly from seed inputs to location outputs.

  the generate_latex.js generates latex.md, which shows this construction
  of a series of piecewise transformations and then the step by step
  simplification through substitution to ultimately yield a single
  transformation.

  This significantly reduces the number of seed inputs we need to test to
  find the minimum. We just need to find the intersecting bounds between
  the seed ranges and the bounds of the piecewise functions. We know
  that the lowest bound for a given piecewise function will be the lowest
  value for that piece.

  This code took 22.5 ms to run on a 2018 i5 macbook
*/

/* 
  represents a single piecewise function translating from one
  coordinate system to another, such as seed to soil.
*/
export class PieceWise {
  constructor(pieces, from, to){
    this.from = from
    this.to = to
    this.pieces = PieceWise.fillGaps(pieces)
  }
  // determines which function applies and applies it
  evaluate(x){
    let piece = this.pieces.find( p => p.applies(x) )
    return piece ? piece.evaluate(x) : x
  }

  // serializes this PieceWise function to a 
  // markdown LaTeX code block of itself.
  toLaTex(){
    let latex = ["``` math", "f(x) = \\begin{cases}"]
    let p = []
    this.pieces.forEach( piece => {
      let func
      if (piece.shift == 0){
        func = "x"
      } else if (piece.shift < 0) {
        func = `x - ${Math.abs(piece.shift)}`
      } else if (piece.shift > 0){
        func = `x + ${piece.shift}`
      }
      let lower = piece.lower_bound == Number.NEGATIVE_INFINITY ? "- \\infty" : piece.lower_bound
      let higher = piece.upper_bound == Number.POSITIVE_INFINITY ? "\\infty" : piece.upper_bound
      let condition = `  ${lower}\\leq x\\leq ${higher}`
      p.push(`${func} & ${condition} \\`)
    })
    latex.push(...p)
    latex.push("\\end{cases}", "```", '')
    
    return latex.join('\n')
  }

  // ensures continuity by filling the gaps
  // in the domain. The challenge states that
  // gaps should simply return as an output the
  // input value
  static fillGaps(pieces){
    // sort domains from least to greatest so we can identify gaps
    let _pieces = pieces.sort( (a,b) => a.lower_bound - b.lower_bound)

    // add the piece for everything to the left
    let filled = []

    if (pieces[0].lower_bound != Number.NEGATIVE_INFINITY){
      let leftBookmark = new Piece({upper_bound: pieces[0].lower_bound - 1})
      filled.push(leftBookmark)
    }
    filled.push(pieces[0])

    // fill any internal gaps in the domain that exist
    for (let i = 1; i < _pieces.length; i++){
      let prev = _pieces[i-1]
      let gap = _pieces[i].lower_bound - prev.upper_bound
      if (gap > 1){
        let p = new Piece({lower_bound: prev.upper_bound+1, upper_bound: _pieces[i].lower_bound-1})
        filled.push(p)
      }
      filled.push(_pieces[i])
    }

    // add the piece for everything to the right
    let last = filled[filled.length-1]
    if (last.upper_bound != Number.POSITIVE_INFINITY){
      let rightBookmark = new Piece({lower_bound: filled[filled.length-1].upper_bound+1})
      filled.push(rightBookmark)
    }
    return filled
  }

  // composes two piecewise functions across
  // domains
  static merge(a, b){
    let pieces = []
    a.pieces.forEach( a_piece => {
      b.pieces.forEach( b_piece => {
        let merged = Piece.merge(a_piece, b_piece)
        if (merged){
          pieces.push(merged)
        } 
      })
    })
    let p = new PieceWise(pieces, a.from, b.to)
    return p
  }
}

// represents a single piece of a PieceWise function
export class Piece{
  constructor({shift, lower_bound, upper_bound}){
    this.shift = !isNaN(shift) ? shift : 0
    this.lower_bound = !isNaN(lower_bound) ? lower_bound : Number.NEGATIVE_INFINITY
    this.upper_bound = !isNaN(upper_bound) ? upper_bound : Number.POSITIVE_INFINITY
  }
  evaluate(x) {
    return x + this.shift
  }
  applies(x){
    return this.lower_bound <= x && x <= this.upper_bound
  }
  // 
  static merge(a, b){
    // let's assuming a applies and translate b's bounds to a's units
    let b_lower = (b.lower_bound - a.shift)
    let b_upper = (b.upper_bound - a.shift)
    if (a.upper_bound < b_lower || b_upper < a.lower_bound){
      return undefined
    }
    let lower = Math.max(a.lower_bound, b_lower)
    let upper = Math.min(a.upper_bound, b_upper)
    let shift = a.shift + b.shift
    let piece = new Piece({shift: shift, lower_bound: lower, upper_bound: upper})
    return piece
  }
}

// returns a list of seed ranges [lower_bound, upper_bound]
export function parseSeedRanges(input){
  let ranges = []
  let numbers = Array.from(input.matchAll(/\d+/g)).map( n => parseInt(n) )
  for (let i = 0; i < numbers.length - 1; i=i+2){
    ranges.push([ numbers[i], numbers[i] + numbers[i+1] - 1 ])
  }
  return ranges
}

// parses the input to create a list of PieceWise function
export function parseSystem(input) {
  return input.map( i => {
    // each line is a piece of the piecewise function
    let lines = i.split('\n')
    let m = lines[0].split(" ")[0].split("-to-")
    let from = m[0]
    let to = m[1]
    let pieces = lines.slice(1).map( p => {
      let numbers = p.split(" ").map( n => parseInt(n) )
      let sourceStart = numbers[0]
      let destinationStart = numbers[1]
      let range = numbers[2]
      let piece = new Piece({
        shift: sourceStart - destinationStart, 
        lower_bound: destinationStart, 
        upper_bound: destinationStart + range - 1
      })
      return piece
    })
    return new PieceWise(pieces, from, to)
  })
}

// iteratively composes the functions to yield a single transformation
export function simplifySystem(system){
  return system.slice(1).reduce( (composite, piecewise) => {
    return PieceWise.merge(composite, piecewise)
  }, system[0])
}

const start = performance.now();

let input = fs.readFileSync('input.txt', 'utf-8').split("\n\n")
let seedRanges = parseSeedRanges(input[0])
let system = parseSystem(input.slice(1, input.length))
let composite = simplifySystem(system)


let minimum = seedRanges.reduce( (minimum, range) => {
  let lower = range[0]
  let upper = range[1]

  let locations = []
  composite.pieces.forEach( piece => {
    if (piece.upper_bound < lower || upper < piece.lower_bound){
      return undefined
    }
    let piece_lower = Math.max(piece.lower_bound, lower)
    locations.push(piece_lower + piece.shift)
  })
  
  return Math.min(...locations, minimum)
}, Number.POSITIVE_INFINITY)

console.log(minimum)


const end = performance.now();
console.log(`Execution time: ${end - start} ms`);