import chalk from 'chalk'
import fs from 'fs'


let schematic = fs.readFileSync('test.txt', 'utf-8')
const regex = /(?<symbol>[^\d\.\n])|(?<number>\d+)/g;

const coloredString = schematic.replace(regex, (match, symbol, number) => {
  if (symbol) {
      return chalk.red(symbol);
  } else if (number) {
      return chalk.blue(number); 
  }
  return match;
});

console.log(coloredString)
