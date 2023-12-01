const util = require('./util.js')

function getCalibrationValue(input){
  digits = input.match(/\d/g)
  return Number(digits[0] + digits[digits.length - 1])
}

async function main(){
  lines = await util.getLines('input.txt')
  sum = 0
  lines.map((input) => sum += getCalibrationValue(input))
  console.log(sum)
}

// only run this when invoked directly
if (require.main === module) {
  main()
}

// for unit tests
module.exports= { getCalibrationValue }