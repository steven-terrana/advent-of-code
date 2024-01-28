import input from "./input.txt";
interface Program {
  id: string;
  neighbors: Program[];
}

function parse(): Map<string, Program> {
  let p = new Map<string, Program>();

  for (let line of input.split("\n")) {
    let parts = line.split(" ");
    p.set(parts[0], {
      id: parts[0],
      neighbors: [],
    });
  }
  for (let line of input.split("\n")) {
    let parts = line.split(" <-> ");
    let source = p.get(parts[0])!;
    let targets = parts[1].split(", ");
    for (let target of targets) {
      let t = p.get(target);
      if (t == undefined) {
        throw new Error(`could not find node ${target}`);
      }
      if (!source.neighbors.some((n) => n.id == t.id)) {
        source.neighbors.push(t);
      }
      if (!t.neighbors.some((n) => n.id == source.id)) {
        t.neighbors.push(source);
      }
    }
  }
  return p;
}

// returns node id's for the component of which the input node is a part
// see: https://en.wikipedia.org/wiki/Component_(graph_theory)
function getComponent(node: Program): Set<string> {
  let queue = [node];
  let visited = new Set<string>();
  visited.add(node.id);
  while (queue.length > 0) {
    let n = queue.shift();
    n?.neighbors.forEach((neighbor) => {
      if (!visited.has(neighbor.id)) {
        queue.push(neighbor);
        visited.add(neighbor.id);
      }
    });
  }
  return visited;
}

let nodes = parse();
let remaining = new Set<string>(Array.from(nodes.values()).map((n) => n.id));
let components = 0;
let part1;
while (remaining.size > 0) {
  components++;
  let id = remaining.entries().next().value[0];
  let component = getComponent(nodes.get(id)!);
  if (component.has("0")) {
    part1 = component.size;
  }
  component.forEach((c) => remaining.delete(c));
}

console.log("Part 1:", part1);
console.log("Part 2:", components);
