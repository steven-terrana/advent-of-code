import input from "./input.txt";

import { MinPriorityQueue } from "@datastructures-js/priority-queue";

class Item {
  type: string;
  element: string;
  constructor(type: string, element: string) {
    this.type = type;
    this.element = element;
  }
  eq(i: Item): boolean {
    return this.type == i.type && this.element == i.element;
  }
  toString(): string {
    return `${this.element}-${this.type[0].toUpperCase()}`;
  }
}

class Floor {
  items: Item[];
  constructor(items: Item[]) {
    this.items = items;
  }
  isValid(): boolean {
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
  eq(f: Floor): boolean {
    if (this.items.length != f.items.length) {
      return false;
    }
    return this.items.every((i, idx) => i.eq(f.items[idx]));
  }
  copy(): Floor {
    return new Floor(this.items.map((i) => new Item(i.type, i.element)));
  }
}

class State {
  floors: Floor[];
  elevator: number;
  steps: number;
  constructor(floors: Floor[], elevator: number, steps: number) {
    this.floors = floors;
    this.elevator = elevator;
    this.steps = steps;
  }
  isValid(): boolean {
    if (this.elevator < 0 || this.elevator >= this.floors.length) {
      return false;
    }
    return this.floors.every((f) => f.isValid());
  }
  asElementAgnostic(): number[][] {
    let floors: number[][] = [];
    for (let i = 0; i < this.floors.length; i++) {
      floors.push([
        this.floors[i].items.filter((i) => i.type == "chip").length,
        this.floors[i].items.filter((i) => i.type == "generator").length,
      ]);
    }
    return floors;
  }

  eq(s: State): boolean {
    // return (
    //   this.elevator == s.elevator &&
    //   this.floors.every((a) => s.floors.some((b) => a.eq(b)))
    // );

    let a = this.asElementAgnostic();
    let b = s.asElementAgnostic();

    let isEquivalent =
      this.elevator == s.elevator &&
      a.every((A, idx) => b[idx][0] == A[0] && b[idx][1] == A[1]);

    // console.log(a, b, isEquivalent);

    return isEquivalent;
  }
  complete(): boolean {
    let allItems = this.floors.map((f) => f.items).flat().length;
    let numFloors = this.floors.length;
    return this.floors[numFloors - 1].items.length == allItems;
  }
  copy(): State {
    return new State(
      this.floors.map((f) => f.copy()),
      this.elevator,
      this.steps
    );
  }
  next(visited: State[]): State[] {
    let next: State[] = [];
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
        let sourceFloor = n.floors[n.elevator];
        let targetFloor = n.floors[elevator];
        for (let item of combo) {
          sourceFloor.items = sourceFloor.items.filter((i) => !i.eq(item));
          targetFloor.items.push(item);
        }
        n.steps++;
        n.elevator = elevator;
        if (n.isValid() && !visited.some((v) => v.eq(n))) {
          next.push(n);
          visited.push(n);
        }
      }
    }
    return next;
  }

  static initial(): State {
    let lines = input.split("\n");
    let floors: Floor[] = [];
    for (let line of lines) {
      let items: Item[] = [];
      let gen = [...line.matchAll(/\w+(?=\sgenerator)/g)].flat();
      gen.forEach((e) => items.push(new Item("generator", e)));
      let chips = [...line.matchAll(/\w+(?=-compatible)/g)].flat();
      chips.forEach((e) => items.push(new Item("chip", e)));
      floors.push(new Floor(items));
    }
    return new State(floors, 0, 0);
  }
}

function combinations(items: Item[], n: number) {
  let result: Item[][] = [];

  function recurse(start: number, path: Item[]) {
    if (1 <= path.length && path.length <= n) {
      result.push(path.slice());
    }
    if (path.length == n) {
      return;
    }
    for (let i = start; i < items.length; i++) {
      path.push(items[i]);
      recurse(i + 1, path);
      path.pop();
    }
  }

  recurse(0, []);
  return result;
}

function printState(s: State) {
  let items = s.floors.map((f) => f.items).flat();
  let max = Math.max(...items.map((i) => i.element.length)) + 2;
  let floors: string[][] = [];
  let f = s.floors.map((f) => f.items.map((i) => i.toString()));
  for (let i = 0; i < f.length; i++) {
    let j = Array(items.length + 1).fill(" ".repeat(max));
    j[0] = i == s.elevator ? "E" : "";
    f[i].forEach((e, idx) => (j[idx + 1] = e));
    floors.push(j);
  }
  floors.reverse();
  console.table(floors);
}

function minSteps(initial: State) {
  let queue = new MinPriorityQueue<State>({
    priority: (s: State) => s.steps,
  });

  queue.enqueue(initial);
  let visited = [initial];

  while (queue.size() > 0) {
    let state = queue.dequeue().element!;
    // printState(state);
    if (state.complete()) {
      return state.steps;
    }
    state.next(visited).forEach((s: State) => {
      queue.enqueue(s);
    });
  }
  throw new Error("no path found");
}

console.log("Part 1:", minSteps(State.initial()));

let initial = State.initial();
initial.floors[0].items.push(
  new Item("chip", "elerium"),
  new Item("generator", "elerium"),
  new Item("chip", "dilithium"),
  new Item("generator", "dilithium")
);

console.log("Part 2:", minSteps(initial));
