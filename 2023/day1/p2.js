const { getLines } = require('../helpers')

function getCalibrationValue(input){
  // build a map of words to their integer counterparts
  const word2num = {
    'one': 1,
    'two': 2,
    'three': 3, 
    'four': 4, 
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
  }

  // build a regular expression that matches all digits
  // as well as the word representation of those digits
  // reverse lookup (?<=) is used to catch overlaps in digit words 
  keys = Object.keys(word2num)
  regex = new RegExp(`(?<=(\\d|${keys.join('|')}))`, 'g')

  // builds an array of integers for each digit represented in the input
  // if the digit is in the word2num object as a key, we use that numeric value
  // otherwise, just convert it directly through Number()
  digits = Array.from(input.matchAll(regex)).map((match) => {
    digit = match[1]
    if (keys.includes(digit)) {
      return word2num[digit]
    } else {
      return Number(digit)
    }
  })

  // concatenating 2 digits a, b is the same thing as 10 * a + b
  // ex: 1, 2 = 12 = 10 * 1 + 2
  // ex: 3,9 = 39 = 10 * 3 + 9
  return 10 * digits[0] + digits[digits.length - 1]
}

function sumCalibrationValues(inputs){
  return inputs.reduce((sum, input) => sum += getCalibrationValue(input), 0);
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