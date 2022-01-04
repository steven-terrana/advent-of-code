# Day 23

Split the input into 14 programs. The first line of each program is the `inp w` statement.

## Overview

Symbolically solving the 14 programs shows that they take two forms:

> z = z_prev * 26 + w + A

Where z_prev is the z output from the previous program and A is the parameter passed to the 6th instruction of the program.

If A is negative, the program instead can be simplified to:

> z = z_prev + w + 1 if (z_prev % 26) - B == w else z_prev // 26

Where z_prev is the z output from the previous program and B is the parameter passed to the 16th instruction of the program.

The only way for z to end at `0` for program's of the second type to always perform the `z_prev // 26` operation. 

This allows us to optimize the input space by calculating the required input digit for programs of the second type, leaving only 7 input digits to guess.

## Program Tables

### Program 1: z = w + 15

|          |  W  |  X  |  Y   |   Z    |
| :------: | :-: | :-: | :--: | :----: |
|  inp w   |  W  |     |      |   0    |
| mul x 0  |     |  0  |      |        |
| add x z  |     |  Z  |      |        |
| mod x 26 |     |  0  |      |        |
| div z 1  |     |     |      |   0    |
| add x 13 |     | 13  |      |        |
| eql x w  |     |  0  |      |        |
| eql x 0  |     |  1  |      |        |
| mul y 0  |     |     |  0   |        |
| add y 25 |     |     |  25  |        |
| mul y x  |     |     |  25  |        |
| add y 1  |     |     |  26  |        |
| mul z y  |     |     |      |   0    |
| mul y 0  |     |     |  0   |        |
| add y w  |     |     |  W   |        |
| add y 15 |     |     | W+15 |        |
| mul y x  |     |     | W+15 |        |
| add z y  |     |     |      | W + 15 |

### Program 2: z = z * 26 + w + 16

|          | W   |      X      |   Y    |        Z        |
| :------: | --- | :---------: | :----: | :-------------: |
|  inp w   | W   |             |        |        Z        |
| mul x 0  |     |      0      |        |                 |
| add x z  |     |      Z      |        |                 |
| mod x 26 |     |   Z / 26    |        |                 |
| div z 1  |     |             |        |        Z        |
| add x 13 |     | Z / 26 + 13 |        |                 |
| eql x w  |     |      0      |        |                 |
| eql x 0  |     |      1      |        |                 |
| mul y 0  |     |             |   0    |                 |
| add y 25 |     |             |   25   |                 |
| mul y x  |     |             |   25   |                 |
| add y 1  |     |             |   26   |                 |
| mul z y  |     |             |        |     Z *  26     |
| mul y 0  |     |             |   0    |                 |
| add y w  |     |             |   W    |                 |
| add y 16 |     |             | W + 16 |                 |
| mul y x  |     |             | W + 16 |                 |
| add z y  |     |             |        | Z * 26 + W + 16 |

### Program 3: z = z * 26 + w + 4

|          |  W  |        X         |   Y   |       Z       |
| :------: | :-: | :--------------: | :---: | :-----------: |
|  inp w   |  W  |                  |       |       Z       |
| mul x 0  |     |        0         |       |               |
| add x z  |     |        Z         |       |               |
| mod x 26 |     |   mod(Z / 26)    |       |               |
| div z 1  |     |                  |       |       Z       |
| add x 10 |     | mod(Z / 26) + 10 |       |               |
| eql x w  |     |        0         |       |               |
| eql x 0  |     |        1         |       |               |
| mul y 0  |     |                  |   0   |               |
| add y 25 |     |                  |  25   |               |
| mul y x  |     |                  |  25   |               |
| add y 1  |     |                  |  26   |               |
| mul z y  |     |                  |       |    Z * 26     |
| mul y 0  |     |                  |   0   |               |
| add y w  |     |                  |   W   |               |
| add y 4  |     |                  | W + 4 |               |
| mul y x  |     |                  | W + 4 |               |
| add z y  |     |                  |       | Z * 26 +W + 4 |

### Program 4: z = z * 26 + w + 14

|          |  W  |        X        |   Y    |       Z        |
| :------: | :-: | :-------------: | :----: | :------------: |
|  inp w   |  W  |                 |        |                |
| mul x 0  |     |        0        |        |                |
| add x z  |     |        Z        |        |                |
| mod x 26 |     |   mod(Z, 26)    |        |                |
| div z 1  |     |                 |        |       Z        |
| add x 15 |     | mod(Z, 26) + 15 |        |                |
| eql x w  |     |        0        |        |                |
| eql x 0  |     |        1        |        |                |
| mul y 0  |     |                 |   0    |                |
| add y 25 |     |                 |   25   |                |
| mul y x  |     |                 |   25   |                |
| add y 1  |     |                 |   26   |                |
| mul z y  |     |                 |        |     Z * 26     |
| mul y 0  |     |                 |   0    |                |
| add y w  |     |                 |   W    |                |
| add y 14 |     |                 | W + 14 |                |
| mul y x  |     |                 | W + 14 |                |
| add z y  |     |                 |        | Z * 26 + W +14 |

### Program 5: z = z // 26 if (z % 26) - 8 == w else z + w + 1

|          |  W  |       X        |     Y      |           Z           |
| :------: | :-: | :------------: | :--------: | :-------------------: |
|  inp w   |  W  |                |            |           Z           |
| mul x 0  |     |       0        |            |                       |
| add x z  |     |       Z        |            |                       |
| mod x 26 |     |   mod(z, 26)   |            |                       |
| div z 26 |     |                |            |        z / 26         |
| add x -8 |     | mod(z, 26) - 8 |            |                       |
| eql x w  |     |     0 or 1     |            |                       |
| eql x 0  |     |     1 or 0     |            |                       |
| mul y 0  |     |                |     0      |                       |
| add y 25 |     |                |     25     |                       |
| mul y x  |     |                |  25 or 0   |                       |
| add y 1  |     |                |  26 or 1   |                       |
| mul z y  |     |                |            |       z or z/26       |
| mul y 0  |     |                |     0      |                       |
| add y w  |     |                |     W      |                       |
| add y 1  |     |                |   W + 1    |                       |
| mul y x  |     |                | W + 1 or 0 |                       |
| add z y  |     |                |            | (z + w + 1) or (z/26) |

### Program 6: z = z // 26 if (z % 26) - 10 == w else z + w + 5

|           |  W  |        X        |     Y      |           Z           |
| :-------: | :-: | :-------------: | :--------: | :-------------------: |
|   inp w   |  W  |                 |            |           Z           |
|  mul x 0  |     |        0        |            |                       |
|  add x z  |     |        Z        |            |                       |
| mod x 26  |     |   mod(z, 26)    |            |                       |
| div z 26  |     |                 |            |        z / 26         |
| add x -10 |     | mod(z, 26) - 10 |            |                       |
|  eql x w  |     |     0 or 1      |            |                       |
|  eql x 0  |     |     1 or 0      |            |                       |
|  mul y 0  |     |                 |     0      |                       |
| add y 25  |     |                 |     25     |                       |
|  mul y x  |     |                 |  25 or 0   |                       |
|  add y 1  |     |                 |  26 or 1   |                       |
|  mul z y  |     |                 |            |       z or z/26       |
|  mul y 0  |     |                 |     0      |                       |
|  add y w  |     |                 |     W      |                       |
|  add y 5  |     |                 |   W + 5    |                       |
|  mul y x  |     |                 | W + 5 or 0 |                       |
|  add z y  |     |                 |            | (z + w + 5) or (z/26) |

### Program 7: z = z * 26 + w + 1

|          |  W  |        X         |   Y   |       Z        |
| :------: | :-: | :--------------: | :---: | :------------: |
|  inp w   |  W  |                  |       |       Z        |
| mul x 0  |     |        0         |       |                |
| add x z  |     |        Z         |       |                |
| mod x 26 |     |   mod(Z / 26)    |       |                |
| div z 1  |     |                  |       |       Z        |
| add x 11 |     | mod(Z / 26) + 11 |       |                |
| eql x w  |     |        0         |       |                |
| eql x 0  |     |        1         |       |                |
| mul y 0  |     |                  |   0   |                |
| add y 25 |     |                  |  25   |                |
| mul y x  |     |                  |  25   |                |
| add y 1  |     |                  |  26   |                |
| mul z y  |     |                  |       |     Z * 26     |
| mul y 0  |     |                  |   0   |                |
| add y w  |     |                  |   W   |                |
| add y 1  |     |                  | W + 1 |                |
| mul y x  |     |                  | W + 1 |                |
| add z y  |     |                  |       | Z * 26 + W + 1 |

### Program 8: z = z // 26 if (z % 26) - 3 == w else z + w + 3

|          |  W  |       X        |     Y      |           Z           |
| :------: | :-: | :------------: | :--------: | :-------------------: |
|  inp w   |  W  |                |            |           Z           |
| mul x 0  |     |       0        |            |                       |
| add x z  |     |       Z        |            |                       |
| mod x 26 |     |   mod(z, 26)   |            |                       |
| div z 26 |     |                |            |        z / 26         |
| add x -3 |     | mod(z, 26) - 3 |            |                       |
| eql x w  |     |     0 or 1     |            |                       |
| eql x 0  |     |     1 or 0     |            |                       |
| mul y 0  |     |                |     0      |                       |
| add y 25 |     |                |     25     |                       |
| mul y x  |     |                |  25 or 0   |                       |
| add y 1  |     |                |  26 or 1   |                       |
| mul z y  |     |                |            |       z or z/26       |
| mul y 0  |     |                |     0      |                       |
| add y w  |     |                |     W      |                       |
| add y 3  |     |                |   W + 3    |                       |
| mul y x  |     |                | W + 3 or 0 |                       |
| add z y  |     |                |            | (z + w + 3) or (z/26) |

### Program 9: z = z * 26 + w + 3

|          |  W  |        X         |   Y   |       Z        |
| :------: | :-: | :--------------: | :---: | :------------: |
|  inp w   |  W  |                  |       |       Z        |
| mul x 0  |     |        0         |       |                |
| add x z  |     |        Z         |       |                |
| mod x 26 |     |   mod(Z / 26)    |       |                |
| div z 1  |     |                  |       |       Z        |
| add x 14 |     | mod(Z / 26) + 14 |       |                |
| eql x w  |     |        0         |       |                |
| eql x 0  |     |        1         |       |                |
| mul y 0  |     |                  |   0   |                |
| add y 25 |     |                  |  25   |                |
| mul y x  |     |                  |  25   |                |
| add y 1  |     |                  |  26   |                |
| mul z y  |     |                  |       |     Z * 26     |
| mul y 0  |     |                  |   0   |                |
| add y w  |     |                  |   W   |                |
| add y 3  |     |                  | W + 3 |                |
| mul y x  |     |                  | W + 3 |                |
| add z y  |     |                  |       | Z * 26 + W + 3 |

### Program 10: z = z // 26 if (z % 26) - 4 == w else z + w + 7

|          |  W  |       X        |     Y      |           Z           |
| :------: | :-: | :------------: | :--------: | :-------------------: |
|  inp w   |  W  |                |            |           Z           |
| mul x 0  |     |       0        |            |                       |
| add x z  |     |       Z        |            |                       |
| mod x 26 |     |   mod(z, 26)   |            |                       |
| div z 26 |     |                |            |        z / 26         |
| add x -4 |     | mod(z, 26) - 4 |            |                       |
| eql x w  |     |     0 or 1     |            |                       |
| eql x 0  |     |     1 or 0     |            |                       |
| mul y 0  |     |                |     0      |                       |
| add y 25 |     |                |     25     |                       |
| mul y x  |     |                |  25 or 0   |                       |
| add y 1  |     |                |  26 or 1   |                       |
| mul z y  |     |                |            |       z or z/26       |
| mul y 0  |     |                |     0      |                       |
| add y w  |     |                |     W      |                       |
| add y 7  |     |                |   W + 7    |                       |
| mul y x  |     |                | W + 7 or 0 |                       |
| add z y  |     |                |            | (z + w + 7) or (z/26) |

### Program 11: z = z * 26 + w + 5

|          |  W  |        X         |   Y   |       Z        |
| :------: | :-: | :--------------: | :---: | :------------: |
|  inp w   |  W  |                  |       |       Z        |
| mul x 0  |     |        0         |       |                |
| add x z  |     |        Z         |       |                |
| mod x 26 |     |   mod(Z / 26)    |       |                |
| div z 1  |     |                  |       |       Z        |
| add x 14 |     | mod(Z / 26) + 14 |       |                |
| eql x w  |     |        0         |       |                |
| eql x 0  |     |        1         |       |                |
| mul y 0  |     |                  |   0   |                |
| add y 25 |     |                  |  25   |                |
| mul y x  |     |                  |  25   |                |
| add y 1  |     |                  |  26   |                |
| mul z y  |     |                  |       |     Z * 26     |
| mul y 0  |     |                  |   0   |                |
| add y w  |     |                  |   W   |                |
| add y 5  |     |                  | W + 5 |                |
| mul y x  |     |                  | W + 5 |                |
| add z y  |     |                  |       | Z * 26 + W + 5 |

### Program 12: z = z // 26 if (z % 26) - 5 == w else z + w + 13

|          |  W  |       X        |      Y      |           Z            |
| :------: | :-: | :------------: | :---------: | :--------------------: |
|  inp w   |  W  |                |             |           Z            |
| mul x 0  |     |       0        |             |                        |
| add x z  |     |       Z        |             |                        |
| mod x 26 |     |   mod(z, 26)   |             |                        |
| div z 26 |     |                |             |         z / 26         |
| add x -5 |     | mod(z, 26) - 5 |             |                        |
| eql x w  |     |     0 or 1     |             |                        |
| eql x 0  |     |     1 or 0     |             |                        |
| mul y 0  |     |                |      0      |                        |
| add y 25 |     |                |     25      |                        |
| mul y x  |     |                |   25 or 0   |                        |
| add y 1  |     |                |   26 or 1   |                        |
| mul z y  |     |                |             |       z or z/26        |
| mul y 0  |     |                |      0      |                        |
| add y w  |     |                |      W      |                        |
| add y 13 |     |                |   W + 13    |                        |
| mul y x  |     |                | W + 13 or 0 |                        |
| add z y  |     |                |             | (z + w + 13) or (z/26) |

### Program 13: z = z // 26 if (z % 26) - 8 == w else z + w + 3

|          |  W  |       X        |     Y      |           Z           |
| :------: | :-: | :------------: | :--------: | :-------------------: |
|  inp w   |  W  |                |            |           Z           |
| mul x 0  |     |       0        |            |                       |
| add x z  |     |       Z        |            |                       |
| mod x 26 |     |   mod(z, 26)   |            |                       |
| div z 26 |     |                |            |        z / 26         |
| add x -8 |     | mod(z, 26) - 8 |            |                       |
| eql x w  |     |     0 or 1     |            |                       |
| eql x 0  |     |     1 or 0     |            |                       |
| mul y 0  |     |                |     0      |                       |
| add y 25 |     |                |     25     |                       |
| mul y x  |     |                |  25 or 0   |                       |
| add y 1  |     |                |  26 or 1   |                       |
| mul z y  |     |                |            |       z or z/26       |
| mul y 0  |     |                |     0      |                       |
| add y w  |     |                |     W      |                       |
| add y 3  |     |                |   W + 3    |                       |
| mul y x  |     |                | W + 3 or 0 |                       |
| add z y  |     |                |            | (z + w + 3) or (z/26) |

### Program 14: z = z // 26 if (z % 26) - 11 == w else z + w + 10

|           |  W  |        X        |      Y      |           Z            |
| :-------: | :-: | :-------------: | :---------: | :--------------------: |
|   inp w   |  W  |                 |             |           Z            |
|  mul x 0  |     |        0        |             |                        |
|  add x z  |     |        Z        |             |                        |
| mod x 26  |     |   mod(z, 26)    |             |                        |
| div z 26  |     |                 |             |         z / 26         |
| add x -11 |     | mod(z, 26) - 11 |             |                        |
|  eql x w  |     |     0 or 1      |             |                        |
|  eql x 0  |     |     1 or 0      |             |                        |
|  mul y 0  |     |                 |      0      |                        |
| add y 25  |     |                 |     25      |                        |
|  mul y x  |     |                 |   25 or 0   |                        |
|  add y 1  |     |                 |   26 or 1   |                        |
|  mul z y  |     |                 |             |       z or z/26        |
|  mul y 0  |     |                 |      0      |                        |
|  add y w  |     |                 |      W      |                        |
| add y 10  |     |                 |   W + 10    |                        |
|  mul y x  |     |                 | W + 10 or 0 |                        |
|  add z y  |     |                 |             | (z + w + 10) or (z/26) |