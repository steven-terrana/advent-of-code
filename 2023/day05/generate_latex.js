import fs from 'fs'
import { PieceWise, parseSystem } from "./p2.js"

let input = fs.readFileSync('test.txt', 'utf-8').split("\n\n")
let system = parseSystem(input)


let content = [
  "# LaTex", 
  "## System of Equations",
  "<table>",
  "<tr>",
  "<td> Status </td> <td> Response </td>",
  "</tr>"
]

system.forEach( piecewise => {
  content.push(...[
    "<tr>", 
    "<td>",
    `convert ${piecewise.from} to ${piecewise.to}`, 
    "</td>", 
    "<td>", 
    "", 
    piecewise.toLaTex(), 
    "</td>", 
    '</tr>'
  ])
})


content.push("</table>", "")
content.push('## Merging Equations step by step')  
content.push("<table>", "<tr>", "<td> Composite Transformation </td> <td> Piecewise Inequality </td>", "</tr>")

system.slice(1).reduce( (composite, piecewise) => {
  let c = PieceWise.merge(composite, piecewise)
  content.push(...[
    "<tr>", 
    "<td>",
    `convert ${c.from} to ${c.to}`, 
    "</td>", 
    "<td>", 
    "", 
    c.toLaTex(), 
    "</td>", 
    '</tr>'
  ])
  return c
}, system[0])

content.push("</table>")

fs.writeFileSync('./latex.md', content.join("\n"))