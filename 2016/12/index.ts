import raw from "./input.txt";

class Memory extends Map<string, number> {
  get(register: string) {
    if (!this.has(register)) {
      this.set(register, 0);
    }
    return super.get(register);
  }
}

let syntax = {
  // cpy x y copies x (either an integer or the value of a register) into register y.
  cpy: (a: string | number, b: string, l: number): number => {
    if (typeof a == "string") {
      memory.set(b, memory.get(a)!);
    } else {
      memory.set(b, a);
    }
    return l + 1;
  },
  // inc x increases the value of register x by one.
  inc: (a: string, l: number): number => {
    memory.set(a, memory.get(a)! + 1);
    return l + 1;
  },
  // dec x decreases the value of register x by one.
  dec: (a: string, l: number): number => {
    memory.set(a, memory.get(a)! - 1);
    return l + 1;
  },
  // jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.
  jnz: (a: string | number, y: number, l: number): number => {
    if (typeof a == "string") {
      return memory.get(a) == 0 ? l + 1 : l + y;
    } else {
      return a == 0 ? l + 1 : l + y;
    }
  },
};

function execute() {
  let program = raw.split("\n");
  for (let i = 0; i < program.length; i++) {
    let parts = program[i].split(" ");
    let [instruction, a, b] = program[i].split(" ");
    a = isNaN(parseInt(a)) ? a : parseInt(a);
    b = isNaN(parseInt(b)) ? b : parseInt(b);
    if (parts.length == 2) {
      i = syntax[instruction](a, i) - 1;
    } else if (parts.length == 3) {
      i = syntax[instruction](a, b, i) - 1;
    }
  }
}

let memory = new Memory();
execute();
console.log("Part 1:", memory.get("a"));
memory.clear();
memory.set("c", 1);
execute();
console.log("Part 2:", memory.get("a"));
