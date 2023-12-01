const assert = require('assert')
const test = require('node:test')
const p1 = require('./p1.js')

data = {
  '1abc2': 12,
  'pqr3stu8vwx': 38,
  'a1b2c3d4e5f': 15,
  'treb7uchet': 77
}

test('test conversion of inputs to number', async(t) => {
  for (const [input, output] of Object.entries(data)) {
    await t.test(`${input} yields ${output}`, (t) => {
      assert.equal(p1.getCalibrationValue(input), output)
    })
  };
})

