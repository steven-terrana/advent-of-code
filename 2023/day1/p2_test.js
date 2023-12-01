const assert = require('assert')
const test = require('node:test')
const p2 = require('./p2.js')

data = {
  "two1nine": 29,
  "eightwothree": 83,
  "abcone2threexyz": 13, 
  "xtwone3four": 24, 
  "4nineeightseven2": 42, 
  "zoneight234": 14,
  "7pqrstsixteen": 76,
  "eighthree": 83
}
test('test conversion of inputs to number', async(t) => {
  for (const [input, output] of Object.entries(data)) {
    await t.test(`${input} yields ${output}`, (t) => {
      assert.equal(p2.getCalibrationValue(input), output)
    })
  };
})


// test ('summing inputs yields the right value', (t) => {
//   sum = 0
//   Object.keys(data).map( (input) => {
//     sum += p2.getCalibrationValue(input)
//   });
//   assert(sum, 281)
// })