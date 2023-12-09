import { Network } from './p1.js'
import gexf from 'graphology-gexf'
import fs from 'fs'

let network = Network.parse('input.txt')
let graphString = gexf.write(network.graph, {
  formatNode: (key, attributes) => {
    return {
      label: key,
      viz: {
        color: "#3EC240",
        size: 5
      }
    }
  }
})

fs.writeFileSync('visualize/public/graph.gexf', graphString)