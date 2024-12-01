const { getLines } = require("../helpers")

// the calibration value is the first and last digit concatenated
function getCalibrationValue(input){
  digits = input.match(/\d/g)
  return Number(digits[0] + digits[digits.length - 1])
}

// sum the calibration value from each line
function sumCalibrationValues(inputs){
  return inputs.reduce((s, input) => s += getCalibrationValue(input), 0)
}

function main(){
  inputs = getLines('input.txt')
  console.log(sumCalibrationValues(inputs))
}

// only run this when invoked directly
if (require.main === module) {
  main()
}

// for unit tests
module.exports = { sumCalibrationValues, getCalibrationValue }