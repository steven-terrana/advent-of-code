const XRegExp = require('xregexp')

const r = new XRegExp("(?<=(eight|three))", 'g')
const test = 'abceighthree'

for (const m of test.matchAll(r)){
  console.log(m[1])
}