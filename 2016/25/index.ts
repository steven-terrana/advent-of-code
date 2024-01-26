let i, a, b, d;

i = 0;
main: while (true) {
  a = i;
  d = a + 633 * 4;
  let out = [];
  iLoop: while (true) {
    a = d;
    while (a != 0) {
      b = a % 2;
      a = Math.floor(a / 2);
      out.push(b);
      if (out.length == 16) {
        if (
          out[0] == 0 &&
          out[1] == 1 &&
          out[2] == 0 &&
          out[3] == 1 &&
          out[4] == 0 &&
          out[5] == 1 &&
          out[6] == 0 &&
          out[7] == 1 &&
          out[8] == 0 &&
          out[9] == 1 &&
          out[10] == 0 &&
          out[11] == 1 &&
          out[12] == 0 &&
          out[13] == 1 &&
          out[14] == 0 &&
          out[15] == 1
        ) {
          console.log(out);
          console.log(i);
          break main;
        } else {
          break iLoop;
        }
      }
    }
  }
  i++;
}
