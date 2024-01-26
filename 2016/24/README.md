# 24

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.23. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Solution

```
###########
#0.1.....2#
#.#######.#
#4.......3#
###########
```

```mermaid
flowchart LR
    0 --2--> 1
    0 --8--> 2
    0 --10-->3
    0 --2-->4

    1 <--6--> 2
    1 <--8--> 3
    1 <--4--> 4

    2 <--2--> 3

    4 <--8--> 3
    4 <--10--> 2
    
```
