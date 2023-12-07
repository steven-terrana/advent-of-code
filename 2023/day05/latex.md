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
convert seed to fertilizer
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 39 &   0\leq x\leq 14 \
x - 15 &   15\leq x\leq 49 \
x - 13 &   50\leq x\leq 51 \
x + 2 &   52\leq x\leq 97 \
x - 63 &   98\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert seed to water
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 28 &   0\leq x\leq 13 \
x + 35 &   14\leq x\leq 14 \
x + 27 &   15\leq x\leq 21 \
x + 35 &   22\leq x\leq 25 \
x - 26 &   26\leq x\leq 49 \
x - 24 &   50\leq x\leq 51 \
x - 2 &   52\leq x\leq 58 \
x + 2 &   59\leq x\leq 97 \
x - 74 &   98\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert seed to light
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 21 &   0\leq x\leq 13 \
x + 28 &   14\leq x\leq 14 \
x + 20 &   15\leq x\leq 21 \
x + 28 &   22\leq x\leq 25 \
x - 26 &   26\leq x\leq 43 \
x + 44 &   44\leq x\leq 49 \
x - 31 &   50\leq x\leq 51 \
x - 9 &   52\leq x\leq 58 \
x - 5 &   59\leq x\leq 92 \
x + 2 &   93\leq x\leq 97 \
x - 4 &   98\leq x\leq 98 \
x - 81 &   99\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert seed to temperature
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 21 &   0\leq x\leq 13 \
x + 28 &   14\leq x\leq 14 \
x + 20 &   15\leq x\leq 21 \
x + 64 &   22\leq x\leq 25 \
x - 26 &   26\leq x\leq 43 \
x + 12 &   44\leq x\leq 49 \
x - 31 &   50\leq x\leq 51 \
x - 9 &   52\leq x\leq 53 \
x + 27 &   54\leq x\leq 58 \
x + 31 &   59\leq x\leq 68 \
x - 1 &   69\leq x\leq 81 \
x - 37 &   82\leq x\leq 92 \
x - 30 &   93\leq x\leq 97 \
x - 36 &   98\leq x\leq 98 \
x - 81 &   99\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert seed to humidity
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 22 &   0\leq x\leq 13 \
x + 29 &   14\leq x\leq 14 \
x + 21 &   15\leq x\leq 21 \
x + 64 &   22\leq x\leq 25 \
x - 25 &   26\leq x\leq 43 \
x + 13 &   44\leq x\leq 49 \
x - 30 &   50\leq x\leq 51 \
x - 8 &   52\leq x\leq 53 \
x + 27 &   54\leq x\leq 58 \
x + 31 &   59\leq x\leq 68 \
x &   69\leq x\leq 69 \
x - 70 &   70\leq x\leq 70 \
x - 1 &   71\leq x\leq 81 \
x - 36 &   82\leq x\leq 92 \
x - 29 &   93\leq x\leq 97 \
x - 35 &   98\leq x\leq 98 \
x - 80 &   99\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
<tr>
<td>
convert seed to location
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 22 &   0\leq x\leq 13 \
x + 29 &   14\leq x\leq 14 \
x + 21 &   15\leq x\leq 21 \
x + 68 &   22\leq x\leq 25 \
x - 25 &   26\leq x\leq 43 \
x + 17 &   44\leq x\leq 49 \
x - 30 &   50\leq x\leq 51 \
x - 8 &   52\leq x\leq 53 \
x + 31 &   54\leq x\leq 58 \
x + 35 &   59\leq x\leq 61 \
x - 6 &   62\leq x\leq 65 \
x + 31 &   66\leq x\leq 68 \
x + 4 &   69\leq x\leq 69 \
x - 70 &   70\leq x\leq 70 \
x + 3 &   71\leq x\leq 81 \
x - 36 &   82\leq x\leq 91 \
x - 32 &   92\leq x\leq 92 \
x - 25 &   93\leq x\leq 97 \
x - 31 &   98\leq x\leq 98 \
x - 80 &   99\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
</table>