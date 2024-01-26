# 25

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Solution

The first thing to do is derive a function $F(i,j)$ where $i$ is the row number and $j$ is the column number that returns the value of the table at $[i,j]$.

### Insight 1: Sum of Consecutive numbers

The value the first row in the table at column $j$ is equal to the sum of consecutive numbers ($S_c$) from $a_1 \dots a_n$.

$$
S_c = (a_n - a_1 + 1)(\frac{a_1 + a_n}{2}) \\
$$

given $a_1=1$ and $a_n=j$

$$
\begin{aligned}
S_c &= (j - 1 + 1)(\frac{1 + j}{2}) \\
    &= (j)(\frac{1 + j}{2}) \\
    &= \frac{j + j^2}{2}
\end{aligned}
$$

Intuitively, this is because each element of the first row is the termination of a new diagonal, where each new diagonal grows in length 1 unit.

### Insight 2: Quadratic Growth

The next insight is that within a column, the difference between values from row $1 \dots \infty$ is always $1$. 

This means that the growth is quadratic and can be found with the generalized equation

$$F(n) = An^2 + Bn + C$$

where $n=i-1$

Furthermore, we know that the first difference value between elements is equal to the column number itself.

### Putting it together

given we know $F(0)$ for a column is equal to the sum of consecutive numbers:

$$
\begin{matrix}
f_{i=1}(0) &=& \frac{j + j^2}{2} \\
f_{i=2}(1) &=& \frac{j + j^2}{2} + j  \\
f_{i=3}(2) &=& \frac{j + j^2}{2} + 2j + 1  \\
\end{matrix}
$$

using the generalized equation for a quadratic function:$f(n)=An^2 +Bn + C$


$$
\begin{cases}
f(0) = C \\
f(1) = A + B + C \\
f(2) = 4A + 2B + C
\end{cases}
$$

substitute C:
$$
\begin{cases}
f(1) = A + B + f(0) \\
f(2) = 4A + 2B + f(0)
\end{cases}
$$

eliminate A by multiplying by -4 and adding equations together:

$$
-4f(1) = -4A - 4B - 4f(0) \\
f(2) = 4A + 2B + f(0) \\
$$
$$
f(2) - 4f(1) = -2B - 3f(0) \\
$$

Solve for $B$
$$
B = \frac{f(2) + 3f(0) - 4f(1)}{-2}
$$


Solve for $A$:

$$
f(1) = A + B + C \\
A = B + C - f(1)
$$

put it all together:

$$
\begin{cases}
C=f(0)\\
B=\frac{f(2) + 3f(0) - 4f(1)}{2}\\
A=f(1)-B-C
\end{cases}
$$

we could go and substitute these out to derive a pure mathematical equation for $F(i,j)$ but from a code perspective this is sufficient to calculate the value:

$$
F(i,j) = An^2 + Bn + C\\
where\begin{cases}
A=f(1)-B-C \\
B=\frac{f(2) + 3f(0) - 4f(1)}{2}\\
C=f(0)\\
\end{cases} \\
and \begin{cases}
f_{i=1}(0) = \frac{j + j^2}{2} \\
f_{i=2}(1) = \frac{j + j^2}{2} + j  \\
f_{i=3}(2) = \frac{j + j^2}{2} + 2j + 1  \\
\end{cases}
$$