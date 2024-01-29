import input from "./input.txt";

const workerURL = new URL("program.ts", import.meta.url).href;

const workerA = new Worker(workerURL, { env: { id: "A" } });
const workerB = new Worker(workerURL, { env: { id: "B" } });

workerA.addEventListener("open", () => {
  workerA.postMessage({
    event: "set",
    register: "p",
    value: 0,
  });
  workerA.postMessage({
    event: "execute",
    instructions: input.split("\n"),
  });
});

workerB.addEventListener("open", () => {
  workerB.postMessage({
    event: "set",
    register: "p",
    value: 1,
  });
  workerB.postMessage({
    event: "execute",
    instructions: input.split("\n"),
  });
});

workerA.onmessage = (event: MessageEvent) => {
  if (event.data?.event == "send") {
    workerB.postMessage(event.data);
  }
};

let messagesSent = 0;
workerB.onmessage = (event: MessageEvent) => {
  if (event.data?.event == "send") {
    workerA.postMessage(event.data);
    messagesSent++;
  } else if (event.data?.event == "done") {
    console.log("Worker B sent:", messagesSent);
  }
};
