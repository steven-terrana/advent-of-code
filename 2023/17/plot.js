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

function main(input){
  let grid = input.split('\n').map(line => {
    return Array.from(line).map( n => parseInt(n))
  })

  let x = []
  for (let i = 0; i < grid.length; i++ ){
    x.push(i)
  }
  let y = []
  for (let i = 0; i < grid[0].length; i++){
    y.push(i)
  }

  Plotly.newPlot("plot", {
    "data": [{
      type: 'heatmap',
      z: grid
    }],
    "layout": { "width": 600, "height": 600}
  })

  // super slow and bad
  // Plotly.newPlot("plot", {
  //   "data": [{
  //     type: 'contour',
  //     x: x,
  //     y: y,
  //     z: grid,
  //   }],
  //   "layout": { "width": 600, "height": 600}
  // })
}