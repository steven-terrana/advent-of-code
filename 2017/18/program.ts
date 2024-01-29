// prevents TS errors
declare var self: Bun.Worker;

class Memory extends Map<string, number> {
  get(k: string) {
    if (!this.has(k)) {
      this.set(k, 0);
    }
    return super.get(k);
  }
}

let queue: number[] = [];
let isDeadlocked = false;
let isCompleted = false;
let memory = new Memory();
let instructions: string[];
let lastCommand = performance.now();

self.onmessage = async (event: MessageEvent) => {
  if (event.data?.event == "send") {
    queue.push(event.data?.frequency);
    // console.log(
    //   `worker ${self.Bun.env.id} received event: ${event.data.event} | adding to queue: ${queue}`
    // );
    if (isDeadlocked) {
      // console.log(
      //   `worker ${self.Bun.env.id} received event: ${event.data.event} | resuming execution`
      // );
      isDeadlocked = false;
      execute();
    }
  } else if (event.data?.event == "set") {
    // console.log(
    //   `worker ${self.Bun.env.id} received event: ${event.data.event} | setting register ${event.data.register} to ${event.data.value}`
    // );
    memory.set(event.data.register, event.data.value);
  } else if (event.data?.event == "execute") {
    // console.log(
    //   `worker ${self.Bun.env.id} received event: ${event.data.event} | beginning program`
    // );
    instructions = event.data.instructions;
    execute();
  } else if (event.data == "print") {
    // console.log(
    //   `worker ${
    //     self.Bun.env.id
    //   }: isCompleted: ${isCompleted}, isDeadlocked: ${isDeadlocked}, queue: ${queue}, memory: ${Array.from(
    //     memory.entries()
    //   )}`
    // );
  }
};

setInterval(() => {
  let time = performance.now();
  if (time - lastCommand > 2000) {
    console.log(`no change for Worker ${self.Bun.env.id}`);
    self.postMessage({
      event: "done",
    });
    self.terminate();
  }
}, 1000);

let i = 0;
function execute() {
  // console.log("program: ", i, instructions.length);
  for (; i < instructions.length; i++) {
    let command: string;
    let x: string;
    let y: string | number;
    [command, x, y] = instructions[i].split(" ");
    // console.log(`Worker ${self.Bun.env.id} executing: ${instructions[i]}`);
    y = isNaN(parseInt(y)) ? y : parseInt(y);
    if (command == "set") set(x, y);
    if (command == "add") add(x, y);
    if (command == "mul") mul(x, y);
    if (command == "mod") mod(x, y);
    if (command == "snd") snd(x);
    if (command == "rcv") {
      if (!rcv(x)) {
        // console.log(
        //   `Worker ${self.Bun.env.id} is deadlocked; pausing execution`
        // );
        return;
        // pause... can resume calling resume()
      }
    }
    if (command == "jgz") {
      let newLine = jgz(x, y);
      i = i + newLine - 1;
    }

    lastCommand = performance.now();
  }
  // console.log(`Worker ${self.Bun.env.id} finished program execution`);
}

// rcv X recovers the frequency of the last sound played, but only when the value of X is not zero. (If it is zero, the command does nothing.)
// returns false if the program should pause because we're waiting to receive
const rcv = (x: string): boolean => {
  if (queue.length == 0) {
    console.log(
      `Worker ${self.Bun.env.id} has nothing to receive - deadlocked;`
    );
    isDeadlocked = true;
    self.postMessage({
      event: "deadlocked",
    });
    return false;
  } else {
    let frequency = queue.pop()!;
    memory.set(x, frequency);
    console.log(
      `Worker ${self.Bun.env.id} received | register ${x} set to ${frequency}`
    );
    isDeadlocked = false;
    return true;
  }
};

// snd X plays a sound with a frequency equal to the value of X.
const snd = (x: string | number) => {
  let v = typeof x == "number" ? x : memory.get(x)!;
  postMessage({
    event: "send",
    frequency: v,
  });
};

// set X Y sets register X to the value of Y.
const set = (x: string, y: string | number) => {
  let v = typeof y == "number" ? y : memory.get(y)!;
  memory.set(x, v);
};

// add X Y increases register X by the value of Y.
const add = (x: string, y: number | string) => {
  let v = typeof y == "number" ? y : memory.get(y)!;
  memory.set(x, memory.get(x)! + v);
};

// mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
const mul = (x: string, y: number | string) => {
  let v = typeof y == "number" ? y : memory.get(y)!;
  memory.set(x, memory.get(x)! * v);
};

// mod X Y sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
const mod = (x: string, y: number | string) => {
  let v = typeof y == "number" ? y : memory.get(y)!;
  memory.set(x, memory.get(x)! % v);
};

// jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero.
const jgz = (x: string, y: number | string) => {
  let v = typeof y == "number" ? y : memory.get(y)!;
  return memory.get(x)! <= 0 ? 1 : v;
};
