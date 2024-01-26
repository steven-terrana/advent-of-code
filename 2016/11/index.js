// input.txt
var input_default = `The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.`;

// index.ts
var combinations = function(items, n) {
  let result = [];
  function recurse(start, path) {
    if (1 <= path.length && path.length <= n) {
      result.push(path.slice());
    }
    if (path.length == n) {
      return;
    }
    for (let i = start;i < items.length; i++) {
      path.push(items[i]);
      recurse(i + 1, path);
      path.pop();
    }
  }
  recurse(0, []);
  return result;
};

class Item {
  type;
  element;
  constructor(type, element) {
    this.type = type;
    this.element = element;
  }
  eq(i) {
    return this.type == i.type && this.element == i.element;
  }
}

class Floor {
  items;
  constructor(items) {
    this.items = items;
  }
  isValid() {
    let chips = this.items.filter((i) => i.type == "chip");
    let gen = this.items.filter((i) => i.type == "generator");
    for (let c of chips) {
      let isPaired = false;
      let maybeFried = false;
      for (let g of gen) {
        if (c.element == g.element) {
          isPaired = true;
        } else {
          maybeFried = true;
        }
      }
      if (!isPaired && maybeFried) {
        return false;
      }
    }
    return true;
  }
  eq(f) {
    if (this.items.length != f.items.length) {
      return false;
    }
    return this.items.every((i, idx) => i.eq(f.items[idx]));
  }
  copy() {
    return new Floor(this.items.map((i) => new Item(i.type, i.element)));
  }
}

class State {
  floors;
  elevator;
  steps;
  constructor(floors, elevator, steps) {
    this.floors = floors;
    this.elevator = elevator;
    this.steps = steps;
  }
  isValid() {
    if (this.elevator < 0 || this.elevator > this.floors.length) {
      return false;
    }
    return this.floors.every((f) => f.isValid());
  }
  eq(s) {
    return this.elevator == s.elevator && this.floors.every((f, i) => f.eq(s.floors[i]));
  }
  complete() {
    let allItems = this.floors.reduce((s, f) => s + f.items.length, 0);
    return this.floors[this.floors.length - 1].items.length == allItems;
  }
  copy() {
    return new State(this.floors.map((f) => f.copy()), this.elevator, this.steps);
  }
  next() {
    let next = [];
    const minFloor = this.floors.findIndex((f) => f.items.length > 0);
    const maxFloor = this.floors.length - 1;
    for (let dir of [-1, 1]) {
      let elevator = this.elevator + dir;
      if (elevator < minFloor || elevator > maxFloor) {
        continue;
      }
      const combos = combinations(this.floors[this.elevator].items, 2);
      for (let combo of combos) {
        let n = this.copy();
        let idx = n.elevator + dir;
        let sourceFloor = n.floors[n.elevator];
        let targetFloor = n.floors[idx];
        for (let item of combo) {
          sourceFloor.items = sourceFloor.items.filter((i) => !i.eq(item));
          targetFloor.items.push(item);
        }
        n.steps++;
        n.elevator += dir;
        if (n.isValid()) {
          next.push(n);
        }
      }
    }
    return next;
  }
  static initial() {
    let lines = input_default.split("\n");
    let floors = [];
    for (let line of lines) {
      let items = [];
      let gen = [...line.matchAll(/\w+(?=\sgenerator)/g)].flat();
      gen.forEach((e) => items.push(new Item("generator", e)));
      let chips = [...line.matchAll(/\w+(?=-compatible)/g)].flat();
      chips.forEach((e) => items.push(new Item("chip", e)));
      floors.push(new Floor(items));
    }
    return new State(floors, 0, 0);
  }
}
console.profile();
var queue = [State.initial()];
var visited = new Set;
while (queue.length > 0) {
  let state = queue.shift();
  if (state.complete()) {
    console.log("Part 1:", state.steps);
    break;
  }
  visited.add(JSON.stringify(state));
  queue.push(...state.next().filter((s) => !visited.has(JSON.stringify(s))));
}
console.profileEnd();
