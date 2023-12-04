const { getCalibrationValue, sumCalibrationValues } = require('./p1.js')

data = [
  {
    input: '1abc2', 
    calibration: 12 
  },
  { 
    input: 'pqr3stu8vwx', 
    calibration: 38 
  },
  { 
    input: 'a1b2c3d4e5f', 
    calibration: 15 
  },
  { 
    input: 'treb7uchet', 
    calibration: 77 
  }
]

describe('Part 1', () => {
  test.each(data)('$input => $calibration', ({input, calibration}) => {
    expect(getCalibrationValue(input)).toBe(calibration)
  })
  test.each([{ sum: 142 }])('sum of calibrations is $sum', ({sum}) => {
    inputs = data.map(i => i.input)
    expect(sumCalibrationValues(inputs)).toBe(sum)
  })
})
