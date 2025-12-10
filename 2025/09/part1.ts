const coordinates = await Bun.file("input.txt").text().then(text => {
  return text.split("\n").map(line => {
    return line.split(",").map(n => parseInt(n.trim())) as [number,number]
  })
})

let biggest = 0
for (let a = 0; a < coordinates.length - 1; a++) {
  for (let b = a + 1; b < coordinates.length; b++) {
    let [ax, ay] = coordinates[a]
    let [bx, by] = coordinates[b]
    let area = Math.abs(ax - bx + 1) * Math.abs(ay - by + 1)
    biggest = Math.max(biggest, area)
  }
}

console.log(biggest)
