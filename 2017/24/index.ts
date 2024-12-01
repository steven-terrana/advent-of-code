import input from "./input.txt";

interface Component {
  id: number;
  ports: number[];
}

function parse(): Component[] {
  let components: Component[] = [];
  let lines = input.split("\n");
  for (let i = 0; i < lines.length; i++) {
    components.push({
      id: i,
      ports: lines[i].split("\n").map((n) => parseInt(n)),
    });
  }
  return components;
}

class Bridge {
  components: Component[] = [];
  end: number = 0;
  constructor(c?: Component) {
    if (c) {
      this.add(c);
    }
  }
  add(c: Component) {
    this.components.push(c);
    this.end = c.ports.find((n) => n != this.end)!;
  }
  has(c: Component) {
    return this.components.some((s) => s.id == c.id);
  }
  strength(): number {
    return this.components
      .map((c) => c.ports)
      .flat()
      .reduce((s, n) => s + n, 0);
  }
  copy(): Bridge {
    let n = new Bridge();
    n.components = this.components.slice();
    n.end = this.end;
    return n;
  }
}

function allBridges(components: Component[]): Bridge[] {
  let bridges: Bridge[] = components
    .filter((c) => c.ports.includes(0))
    .map((c) => new Bridge(c));

  const find = (b: Bridge): Bridge[] => {
    let next: Bridge[] = [];
    for (let component of components.filter((c) => !b.has(c))) {
      if (component.ports.includes(b.end)) {
        let n = structuredClone(b);
        n.add(component);
        next.push(n);
      }
    }
    return next;
  };

  bridges = bridges.map((b) => find(b)).flat();
  return bridges;
}

console.log(allBridges(parse()));
