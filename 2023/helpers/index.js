const fs = require('fs')

function getLines(filePath){
  data = fs.readFileSync(filePath, 'utf-8')
  return data.split('\n')
}

module.exports = { getLines }