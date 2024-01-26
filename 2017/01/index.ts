import captcha from "./input.txt";

function sum(captcha: string, offset: number) {
  let x = Array.from(captcha);
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    if (x[i] == x[(i + offset) % x.length]) {
      sum += parseInt(x[i]);
    }
  }
  return sum;
}

console.log("Part 1:", sum(captcha, 1));
console.log("Part 1:", sum(captcha, Math.floor(captcha.length / 2)));
