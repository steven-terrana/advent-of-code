async function getLines(filePath){
  const fs = require('fs').promises;
  data = await fs.readFile(filePath, 'utf-8')
  return data.split('\n')
}

module.exports = { getLines }