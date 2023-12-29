
# Day 21

## Building the Intuition

## Building the formula

### Width of the Diamond

$$f_{width}(N) = 2N+1$$

### A Elements
Counting the **A** elements in the diamond can be done using the sum of odd numbers theorem that states the sum of odd numbers:

$$1 + 3 + 5 + \dots + (2x - 1) = x^2$$

In our case, the number of terms is always 1 more than N so:

$$f_x(N) = N + 1$$

The width of the diamond is entirely **A** elements and is equal to $2N+1$.

Putting it all together, we can determine the total number of A elements within the diamond through $A(N)$.

$$
\begin{align*}
f_A(N) &= 2(N+1)^2 - f_{width}(N) \\
     &= 2(N + 1)^2 - (2N + 1) \\
     &= 2N^2+4N + 2 - 2N - 1 \\
     &= 2N^2 + 2N + 1
\end{align*}
$$

### B Elements

Counting the **B** elements in the diamond can be done with the sum of even numbers theorem that states

$$2 + 4 + 6 + \dots + (2x -1) = x(x+1)$$

therefore

$$
\begin{align*}
f_x(N) &= f_{width}(N) - 1 \\
       &= (2N + 1) -1 \\
       &= 2N
\end{align*}
$$

therefore

$$
\begin{align*}
f_B(N) &= 2N(2N + 1) \\
     &= 4N^2 + 2N
\end{align*}
$$

### Putting It All Together

$$
\begin{align*}
f_{spots}(N) &= f_A(N) \times A_{spots} + f_B(N) \times B_{spots} \\
    &= (2N^2 + 2N + 1) \times A_{spots} + (4N^2 + 2N) \times B_{spots}
\end{align*}
$$

## blah

$y = 14913N^2 + 15004N + 3778$


$$
\begin{align*}
f_{spots}(N) &= f_A(N) \times 3778 + f_B(N) \times B_{spots} \\
    &= (7556N^2 + 7556N + 3778)  + (4N^2 + 2N) \times B_{spots} \\
    &= (7556 +4B_{spots})N^2 + (7556 + 2B_{spots})N +3778
\end{align*}
$$


$$f(x) = ax^2 + bx + c$$

$$c=3778$$

$$a=14913 = 7556 + 4B$$

$$b=15004=7556 + 2B$$