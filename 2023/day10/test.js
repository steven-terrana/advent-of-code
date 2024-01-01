/*
  traverses a 2D matrix diagnolly from bottom left to top right
  and returns a list of rays represented by the coordinates the 
  ray will intersect.
*/
function diagnolRays(matrix) {
  let rays = []
  const numRows = matrix.length;
  const numCols = matrix[0].length;
  
  // Iterate over the sum of the indices, which ranges from 0 to (numRows + numCols - 2)
  for (let sum = 0; sum <= numRows + numCols - 2; sum++) {
    let row, col;
    
    if (sum < numRows) { // upper left half of diagnol
      row = sum;
      col = 0;
    } else { // bottom right half of diagnol
      row = numRows - 1;
      col = sum - numRows + 1;
    }
    
    // traverse the diagonal
    let ray = []
    while (row >= 0 && col < numCols) {
      if (row < numRows) {
        ray.push([row,col])
      }
      row--;
      col++;
    }
    rays.push(ray)
  }
  return rays
}

console.log(diagnolRays([
  [ 1,  2,  3 ],
  [4, 5, 6],
  [7,8,9]
]))


console.log(diagnolRays([
  [ 1,  2,  3,  4,  5],
  [ 6,  7,  8,  9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  // [21, 22, 23, 24, 25]
]))