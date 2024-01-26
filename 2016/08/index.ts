import commands from './input.txt'
import chalk from 'chalk'
import sharp from 'sharp'
import OCRAD from 'ocrad.js'
import photon from '@silvia-odwyer/photon-node'
import jimp from 'jimp'
import Tesseract from 'tesseract.js'

// create a 2D array 50x6 with a starting value of 0
type Grid = number[][]
let grid: Grid = Array.from(Array(6), () => Array(50).fill(0))

// rect AxB turns on all of the pixels in a rectangle at the top-left of the screen which is A wide and B tall.
function rect(grid: Grid, a: number, b: number){
    for(let i = 0; i < b; i++){
        for (let j = 0; j < a; j++){
            grid[i][j] = 1
        }
    }
}

// rotate row y=A by B shifts all of the pixels in row A (0 is the top row) right by B pixels.
// Pixels that would fall off the right end appear at the left end of the row.
function rotateRow(grid: Grid, a: number, b: number){
    for(let i = 0; i < b; i++){
        grid[a].unshift(grid[a].pop()!)
    }
}

// rotate column x=A by B shifts all of the pixels in column A (0 is the left column) down by B pixels.
// Pixels that would fall off the bottom appear at the top of the column.
function rotateCol(grid: Grid, a: number, b: number){
    let column: number[] = []
    for(let i = 0; i < grid.length; i++){
        column.push(grid[i][a])
    }
    rotateRow([column], 0, b)
    for(let i = 0; i < grid.length; i++){
        grid[i][a] = column[i]
    }
}

function print(grid: Grid){
    for(let i = 0; i < grid.length; i++){
        let row: string[] = []
        for (let j = 0; j < grid[0].length; j++){
            row.push(grid[i][j] == 1 ? chalk.bold.bgGray.blueBright('1') : ' ')
        }
        console.log(row.join(' '))
    } 
}

function countLit(grid: Grid): number{
    let lit = 0
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[0].length; j++){
            lit += grid[i][j]
        }
    }
    return lit
}

for(let command of commands.split('\n')){
    let [a, b] = [...command.matchAll(/\d+/g)].map(n => parseInt(n[0]))
    if(command.startsWith('rect')){
        rect(grid, a, b)
    }
    if(command.startsWith('rotate row')){
        rotateRow(grid, a, b)
    }
    if(command.startsWith('rotate column')){
        rotateCol(grid, a, b)
    }
}

let part1 = countLit(grid)
console.log('Part 1:', part1)

// fast way: just print the grid and use your brain for OCR
print(grid)

async function convertGridToPNG(grid: Grid, outputPath: string): Promise<void> {
    const height = grid.length;
    const width = grid[0].length;

    // Create a buffer from the 2D grid
    const buffer = Buffer.alloc(width * height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Assuming 0 is white and 1 is black
            const color = grid[y][x] === 1 ? 0 : 255;
            buffer.writeUInt8(color, y * width + x);
        }
    }

    // Save the buffer as a PNG
    await sharp(buffer, { raw: { width, height, channels: 1 } })
        .resize(grid[0].length * 100, grid.length * 100)
        .toFormat('png')
        .toFile(outputPath);
}

await convertGridToPNG(grid, 'display.png')