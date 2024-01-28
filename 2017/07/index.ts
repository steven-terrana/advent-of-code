import input from "./input.txt";

interface Program {
  name: string;
  weight: number;
  parent?: Program;
  children: Program[];
}

function parse(): Program {
  let nodes = new Map<string, Program>();
  let children = new Map<string, string[]>();
  let parents = new Map<string, string>();

  for (let line of input.split("\n")) {
    let parts = line.split(" ");
    let name = parts[0];
    let c: string[] = [];
    if (parts.includes("->")) {
      let arrow = parts.indexOf("->");
      c = parts
        .slice(arrow + 1)
        .join("")
        .split(",");
      c.forEach((i) => parents.set(i, name));
    }
    children.set(name, c);
    nodes.set(name, {
      name: name,
      weight: parseInt(parts[1].slice(1, -1)),
      children: [],
      parent: undefined,
    });
  }

  children.forEach((kids, parent) => {
    let n = kids.map((name) => nodes.get(name)!);
    nodes.get(parent)!.children = n;
  });

  parents.forEach((v, k) => (nodes.get(k)!.parent = nodes.get(v)!));

  let all = Array.from(nodes.values());
  return all.find((n) => n.parent == undefined)!;
}

function getNodes(p: Program): Program[] {
  let nodes: Program[] = [p];
  let queue = [...p.children];
  while (queue.length > 0) {
    let n = queue.shift()!;
    nodes.push(n);
    queue.push(...n.children);
  }
  return nodes;
}

function getWeight(p: Program) {
  return getNodes(p).reduce((s, n) => s + n.weight, 0);
}

function balance(p: Program): number | undefined {
  let weights = new Map<string, Program[]>();
  for (let program of p.children) {
    let w = getWeight(program).toString();
    if (!weights.has(w)) {
      weights.set(w, []);
    }
    weights.get(w)!.push(program);
  }

  let weightToChange;
  let a, b;

  for (let [k, v] of weights) {
    if (v.length == 1) {
      weightToChange = v[0];
      a = parseInt(k);
    } else {
      b = parseInt(k);
    }
  }

  if (a == undefined || b == undefined || weightToChange == undefined) {
    return undefined;
  }

  weightToChange.weight -= a - b;
  return weightToChange?.weight;
}

const getDepth = (root: Program): number => {
  let depth = 0;
  let node = root;
  while (node.children.length > 0) {
    node = node.children[0];
    depth++;
  }
  return depth;
};

let root = parse();
console.log("Part 1:", root.name);

// for part 2, we can get all the nodes and sort them
// based on their depth from least to highest
// then we can iterate over the nodes and the first one
// to be unbalanced will yield our answer
let nodes = getNodes(root);
nodes.sort((a, b) => getDepth(a) - getDepth(b));

for (let node of nodes) {
  if (node.children.length == 0) {
    continue;
  }
  let b = balance(node);
  if (b != undefined) {
    console.log("Part 2:", b);
    break;
  }
}
