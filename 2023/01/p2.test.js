const { getCalibrationValue, sumCalibrationValues } = require('./p2.js')

data = [
  {
    input: "two1nine",
    calibration: 29
  },
  {
    input: "eightwothree", 
    calibration: 83,
  },
  {
    input: "abcone2threexyz", 
    calibration: 13 },
  {
    input: "xtwone3four", 
    calibration: 24 }, 
  {
    input: "4nineeightseven2", 
    calibration: 42 }, 
  {
    input: "zoneight234", 
    calibration: 14},
  {
    input: "7pqrstsixteen", 
    calibration: 76},
  {
    input: "eighthree", 
    calibration: 83,
    // indicate this was not one of the examples given
    extra: true
  }
]

describe('Part 2', () => {
  test.each(data)('$input => $calibration', ({input, calibration}) => {
    expect(getCalibrationValue(input)).toBe(calibration)
  })
  test.each([{ sum: 281 }])('sum of calibrations is $sum', ({sum}) => {
    // get the inputs that were provided by the challenge
    inputs = data.filter( i => !i?.extra ).map( i => i.input )
    expect(sumCalibrationValues(inputs)).toBe(sum)
  })
})