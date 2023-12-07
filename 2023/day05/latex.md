# LaTex
## System of Equations
<table>
<tr>
<td> Status </td> <td> Response </td>
</tr>
<tr>
<td>
convert seed to soil
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq 49 \
x + 2 &   50\leq x\leq 97 \
x - 48 &   98\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert soil to fertilizer
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 39 &   0\leq x\leq 14 \
x - 15 &   15\leq x\leq 51 \
x - 15 &   52\leq x\leq 53 \
x &   54\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert fertilizer to water
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 42 &   0\leq x\leq 6 \
x + 50 &   7\leq x\leq 10 \
x - 11 &   11\leq x\leq 52 \
x - 4 &   53\leq x\leq 60 \
x &   61\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert water to light
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq 17 \
x + 70 &   18\leq x\leq 24 \
x - 7 &   25\leq x\leq 94 \
x &   95\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert light to temperature
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq 44 \
x + 36 &   45\leq x\leq 63 \
x + 4 &   64\leq x\leq 76 \
x - 32 &   77\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert temperature to humidity
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 1 &   0\leq x\leq 68 \
x - 69 &   69\leq x\leq 69 \
x &   70\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert humidity to location
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq 55 \
x + 4 &   56\leq x\leq 92 \
x - 37 &   93\leq x\leq 96 \
x &   97\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
</table>

## Merging Equations step by step
<table>
<tr>
<td> Composite Transformation </td> <td> Piecewise Inequality </td>
</tr>
<tr>
<td>
convert humidity to humidity
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 1 &   0\leq x\leq 55 \
x + 5 &   56\leq x\leq 64 \
x - 65 &   65\leq x\leq 65 \
x + 4 &   66\leq x\leq 92 \
x - 36 &   93\leq x\leq 96 \
x &   97\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert humidity to temperature
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 1 &   0\leq x\leq 43 \
x + 37 &   44\leq x\leq 55 \
x + 41 &   56\leq x\leq 58 \
x + 9 &   59\leq x\leq 64 \
x - 65 &   65\leq x\leq 65 \
x + 8 &   66\leq x\leq 72 \
x - 28 &   73\leq x\leq 92 \
x &   93\leq x\leq 96 \
x - 32 &   97\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert humidity to light
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 1 &   0\leq x\leq 16 \
x + 71 &   17\leq x\leq 23 \
x - 6 &   24\leq x\leq 43 \
x + 30 &   44\leq x\leq 55 \
x + 41 &   56\leq x\leq 58 \
x + 2 &   59\leq x\leq 64 \
x - 65 &   65\leq x\leq 65 \
x + 1 &   66\leq x\leq 72 \
x - 35 &   73\leq x\leq 92 \
x - 7 &   93\leq x\leq 94 \
x &   95\leq x\leq 96 \
x - 39 &   97\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert humidity to water
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 43 &   0\leq x\leq 5 \
x + 51 &   6\leq x\leq 9 \
x - 10 &   10\leq x\leq 16 \
x + 71 &   17\leq x\leq 23 \
x - 17 &   24\leq x\leq 43 \
x + 30 &   44\leq x\leq 55 \
x + 41 &   56\leq x\leq 58 \
x + 2 &   59\leq x\leq 64 \
x - 23 &   65\leq x\leq 65 \
x + 1 &   66\leq x\leq 72 \
x - 46 &   73\leq x\leq 87 \
x - 39 &   88\leq x\leq 92 \
x - 7 &   93\leq x\leq 94 \
x &   95\leq x\leq 96 \
x - 43 &   97\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert humidity to fertilizer
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 28 &   0\leq x\leq 5 \
x + 51 &   6\leq x\leq 9 \
x + 29 &   10\leq x\leq 16 \
x + 71 &   17\leq x\leq 23 \
x + 22 &   24\leq x\leq 31 \
x - 32 &   32\leq x\leq 43 \
x + 30 &   44\leq x\leq 55 \
x + 41 &   56\leq x\leq 58 \
x + 2 &   59\leq x\leq 64 \
x - 38 &   65\leq x\leq 65 \
x + 1 &   66\leq x\leq 72 \
x - 61 &   73\leq x\leq 87 \
x - 54 &   88\leq x\leq 90 \
x - 54 &   91\leq x\leq 92 \
x - 7 &   93\leq x\leq 94 \
x &   95\leq x\leq 96 \
x - 43 &   97\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert humidity to soil
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 28 &   0\leq x\leq 5 \
x + 53 &   6\leq x\leq 9 \
x + 29 &   10\leq x\leq 16 \
x + 73 &   17\leq x\leq 23 \
x + 22 &   24\leq x\leq 27 \
x + 24 &   28\leq x\leq 31 \
x - 32 &   32\leq x\leq 43 \
x + 32 &   44\leq x\leq 55 \
x + 43 &   56\leq x\leq 56 \
x - 7 &   57\leq x\leq 58 \
x + 4 &   59\leq x\leq 64 \
x - 38 &   65\leq x\leq 65 \
x + 3 &   66\leq x\leq 72 \
x - 61 &   73\leq x\leq 87 \
x - 54 &   88\leq x\leq 90 \
x - 54 &   91\leq x\leq 92 \
x - 5 &   93\leq x\leq 94 \
x + 2 &   95\leq x\leq 96 \
x - 41 &   97\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
</table>