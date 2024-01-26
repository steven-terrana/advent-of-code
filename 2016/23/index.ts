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
  cpy: (
    a: string | number,
    b: string | number,
    program: string[],
    l: number
  ): number => {
    if (typeof b == "number") {
      return l + 1;
    }
    if (typeof a == "string") {
      memory.set(b, memory.get(a)!);
    } else {
      memory.set(b, a);
    }
    return l + 1;
  },
  // inc x increases the value of register x by one.
  inc: (a: string, program: string[], l: number): number => {
    memory.set(a, memory.get(a)! + 1);
    return l + 1;
  },
  // dec x decreases the value of register x by one.
  dec: (a: string, program: string[], l: number): number => {
    memory.set(a, memory.get(a)! - 1);
    return l + 1;
  },
  // jnz x y jumps to an instruction y away (positive means forward; negative means backward), but only if x is not zero.
  jnz: (
    x: string | number,
    y: string | number,
    program: string[],
    l: number
  ): number => {
    // first check for an available optimization
    if (y == -2) {
      // add
      let a = program[l - 2].split(" ");
      let b = program[l - 1].split(" ");
      if (a[0] == "inc" && b[0] == "dec" && b[1] == x) {
        memory.set(a[1], memory.get(b[1])! + memory.get(a[1])!);
        memory.set(b[1], 0);
        return l + 1;
      }
      // } else if (y == -5) {
      //   // multiply
      //   let a = program[l - 5].split(" ");
      //   let b = program[l - 4].split(" ");
      //   let c = program[l - 3].split(" ");
      //   let d = program[l - 2].split(" ");
      //   let e = program[l - 1].split(" ");
      //   if (
      //     a[0] == "cpy" &&
      //     b[0] == "inc" &&
      //     c[0] == "dec" &&
      //     d[0] == "jnz" &&
      //     e[0] == "dec" &&
      //     d[2] == "-2" &&
      //     a[2] == c[1] &&
      //     e[1] == x
      //   ) {
      //     memory.set(
      //       b[1],
      //       memory.get(b[1])! -
      //         1 +
      //         memory.get(a[1])! * (memory.get(e[1])! + 1) -
      //         memory.get(a[1])! +
      //         1
      //     );
      //     memory.set(c[1], 0);
      //     memory.set(e[1], 0);
      //     return l + 1;
      //   }
    }
    let comp = typeof x == "string" ? memory.get(x)! : x;
    let jump = typeof y == "string" ? memory.get(y)! : y;
    return comp == 0 ? l + 1 : l + jump;
  },
};

function execute() {
  let program = raw.split("\n");
  let i = 0;
  let toggleHistory = [];
  while (i < program.length) {
    let parts = program[i].split(" ");
    let [instruction, a, b] = program[i].split(" ");
    a = isNaN(parseInt(a)) ? a : parseInt(a);
    b = isNaN(parseInt(b)) ? b : parseInt(b);
    if (parts[0] == "tgl") {
      let v = memory.get(a)!;
      let line = program[i + v];
      let lineParts = line?.split(" ");
      // If an attempt is made to toggle an instruction outside the program, nothing happens.
      if (i + v >= program.length || i + v < 0) {
        toggleHistory.push({
          i: i + v,
          msg: "outside bounds",
        });
      } else if (lineParts.length == 2) {
        // For one-argument instructions, inc becomes dec, and all other one-argument instructions become inc.
        if (lineParts[0] == "inc") {
          line = line.replace(/^\w+/, "dec");
          toggleHistory.push({ i: i + v, prev: program[i + v], new: line });
          program[i + v] = line;
        } else {
          line = line.replace(/^\w+/, "inc");
          toggleHistory.push({
            i: i + v,
            prev: program[i + v],
            new: line,
          });
          program[i + v] = line;
        }
      } else if (lineParts.length == 3) {
        // For two-argument instructions, jnz becomes cpy, and all other two-instructions become jnz.
        if (lineParts[0] == "jnz") {
          line = line.replace(/^\w+/, "cpy");
          toggleHistory.push({
            i: i + v,
            prev: program[i + v],
            new: line,
          });
          program[i + v] = line;
        } else {
          line = line.replace(/^\w+/, "jnz");
          toggleHistory.push({
            i: i + v,
            prev: program[i + v],
            new: line,
          });
          program[i + v] = line;
        }
      }
      i++;
    } else if (parts.length == 2) {
      i = syntax[instruction](a, program, i);
    } else if (parts.length == 3) {
      i = syntax[instruction](a, b, program, i);
    }
  }
}

let memory = new Memory();
// execute();
// console.log(memory.get("a"));

memory.set("a", 7);
execute();
console.log("Part 1:", memory.get("a"));

memory.clear();
memory.set("a", 12);
execute();
console.log("Part 2:", memory.get("a"));
