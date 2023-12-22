const fileInput = document.querySelector('input[type="file"]');
const eventLog = document.querySelector(".event-log-contents");
const reader = new FileReader();

function handleEvent(event) {
  if (event.type === "load") {
    main(reader.result)
  }
}

function addListeners(reader) {
  reader.addEventListener("loadstart", handleEvent);
  reader.addEventListener("load", handleEvent);
  reader.addEventListener("loadend", handleEvent);
  reader.addEventListener("progress", handleEvent);
  reader.addEventListener("error", handleEvent);
  reader.addEventListener("abort", handleEvent);
}

function handleSelected(e) {
  const selectedFile = fileInput.files[0];
  if (selectedFile) {
    addListeners(reader);
    reader.readAsText(selectedFile);
  }
}

fileInput.addEventListener("change", handleSelected);


let i = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)`

main(i)

function main(input){

  let lines = input.split('\n')
  const directions = {
    'U': [0,  1],
    'D': [0,  -1],
    'L': [-1, 0],
    'R': [1, 0,]
  }
  let perimeter = 0
  let x, y, minX, minY, maxX, maxY
  x=0; minX = x; maxX = x;
  y=0; minY = y; maxY = y;

  let polygon = []

  let traces = []
  for(let i = 0; i < lines.length; i++){
    console.log('instruction: ', lines[i])
    let d, m, c
    [d, m, c] = lines[i].split(' ')
    m = parseInt(m)
    perimeter += m


    console.log('x', x, 'xNew', x + m * directions[d][0])
    console.log('y', y, 'yNew', y + m * directions[d][1])
    let traceX = [x, x + m * directions[d][0]]
    let traceY = [y, y + m * directions[d][1]]
    x += m * directions[d][0]
    y += m * directions[d][1]

    minX = Math.min(x, minX)
    minY = Math.min(y, minY)
    maxX = Math.max(x, maxX)
    maxY = Math.max(y, maxY)
    traces.push({
      x: traceX.slice(), 
      y: traceY.slice(),
      mode: 'lines+markers',
      type: 'scatter'
    })
  }

  console.log(traces)

  Plotly.newPlot("plot", traces, {
    title: 'AoC Day18',
    showlegend: false,
    width: 1 * (maxX - minX),
    height: 1 * (maxY - minY),
    xaxis: {
      tickvals: _.range(minX, maxX + 1),
      ticktext: _.range(minX, maxX + 1)
    },
    yaxis: {
      tickvals: _.range(minY, maxY + 1),
      ticktext: _.range(minY, maxY + 1)
    }
  })
}

/**
 * Performs the even-odd-rule Algorithm (a raycasting algorithm) to find out whether a point is in a given polygon.
 * This runs in O(n) where n is the number of edges of the polygon.
 *
 * @param {Array} polygon an array representation of the polygon where polygon[i][0] is the x Value of the i-th point and polygon[i][1] is the y Value.
 * @param {Array} point   an array representation of the point where point[0] is its x Value and point[1] is its y Value
 * @return {boolean} whether the point is in the polygon (not on the edge, just turn < into <= and > into >= for that)
 */
const pointInPolygon = function (polygon, point) {
  //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
  let odd = false;
  //For each edge (In this case for each point of the polygon and the previous one)
  for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
      //If a line from the point into infinity crosses this edge
      if (((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) // One point needs to be above, one below our y coordinate
          // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
          && (point[0] < ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))) {
          // Invert odd
          odd = !odd;
      }
      j = i;

  }
  //If the number of crossings was odd, the point is in the polygon
  return odd;
};
