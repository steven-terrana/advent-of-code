/**
 * This example shows how to load a GEXF graph file (using the dedicated
 * graphology parser), and display it with some basic map features: Zoom in and
 * out buttons, reset zoom button, and a slider to increase or decrease the
 * quantity of labels displayed on screen.
 */

import Sigma from "sigma";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";

// Load external GEXF file:
fetch("./graph.gexf")
  .then((res) => res.text())
  .then((gexf) => {
    // Parse GEXF string:
    const graph = parse(Graph, gexf);
    
    // Retrieve some useful DOM elements:
    const container = document.getElementById("sigma-container");
    const renderer = new Sigma(graph, container);
  });