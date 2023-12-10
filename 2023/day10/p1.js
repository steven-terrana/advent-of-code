import fs from 'fs'
import  Graph from 'graphology'
/*
| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; 
  there is a pipe on this tile, but your sketch doesn't show what shape the pipe has
*/
const egress = {
    up: ['|', 'F', '7'],
    down: ['|', 'L', 'J'],
    left: ['-', 'L', 'F'],
    right: ['-', 'J', '7']
}

const pipes = {
    '|': { up: egress.up, down: egress.down },
    '-': { left: egress.left, down: egress.right}, 
    'L': { up: egress.up, right: egress.right},
    ...    
}

// from our current position, determines direction to check
// and then chooses a direction
function walkMaze(){
    
}

let graph = parseGraph('test.txt')