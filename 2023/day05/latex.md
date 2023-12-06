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
<tr>
<td>
convert humidity to humidity
</td>
<td>

``` math
f(x) = \begin{cases}
x &   - \infty\leq x\leq -1 \
x + 1 &   0\leq x\leq 55 \
x + 5 &   56\leq x\leq 68 \
x - 65 &   69\leq x\leq 69 \
x + 4 &   70\leq x\leq 92 \
x - 37 &   93\leq x\leq 96 \
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
x + 1 &   0\leq x\leq 44 \
x + 37 &   45\leq x\leq 55 \
x + 41 &   56\leq x\leq 63 \
x + 9 &   64\leq x\leq 68 \
x - 61 &   69\leq x\leq 69 \
x + 8 &   70\leq x\leq 76 \
x - 28 &   77\leq x\leq 92 \
x - 69 &   93\leq x\leq 96 \
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
x + 1 &   0\leq x\leq 17 \
x + 71 &   18\leq x\leq 24 \
x - 6 &   25\leq x\leq 44 \
x + 30 &   45\leq x\leq 55 \
x + 34 &   56\leq x\leq 63 \
x + 2 &   64\leq x\leq 68 \
x - 68 &   69\leq x\leq 69 \
x + 1 &   70\leq x\leq 76 \
x - 35 &   77\leq x\leq 92 \
x - 76 &   93\leq x\leq 94 \
x - 69 &   95\leq x\leq 96 \
x - 32 &   97\leq x\leq 99 \
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
x + 43 &   0\leq x\leq 6 \
x + 51 &   7\leq x\leq 10 \
x - 10 &   11\leq x\leq 17 \
x + 60 &   18\leq x\leq 24 \
x - 17 &   25\leq x\leq 44 \
x + 19 &   45\leq x\leq 52 \
x + 26 &   53\leq x\leq 55 \
x + 30 &   56\leq x\leq 60 \
x + 34 &   61\leq x\leq 63 \
x + 2 &   64\leq x\leq 68 \
x - 68 &   69\leq x\leq 69 \
x + 1 &   70\leq x\leq 76 \
x - 35 &   77\leq x\leq 92 \
x - 76 &   93\leq x\leq 94 \
x - 69 &   95\leq x\leq 96 \
x - 32 &   97\leq x\leq 99 \
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
x + 82 &   0\leq x\leq 6 \
x + 90 &   7\leq x\leq 10 \
x + 29 &   11\leq x\leq 14 \
x - 25 &   15\leq x\leq 17 \
x + 45 &   18\leq x\leq 24 \
x - 32 &   25\leq x\leq 44 \
x + 4 &   45\leq x\leq 51 \
x + 4 &   52\leq x\leq 52 \
x + 11 &   53\leq x\leq 53 \
x + 26 &   54\leq x\leq 55 \
x + 30 &   56\leq x\leq 60 \
x + 34 &   61\leq x\leq 63 \
x + 2 &   64\leq x\leq 68 \
x - 68 &   69\leq x\leq 69 \
x + 1 &   70\leq x\leq 76 \
x - 35 &   77\leq x\leq 92 \
x - 76 &   93\leq x\leq 94 \
x - 69 &   95\leq x\leq 96 \
x - 32 &   97\leq x\leq 99 \
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
x + 82 &   0\leq x\leq 6 \
x + 90 &   7\leq x\leq 10 \
x + 29 &   11\leq x\leq 14 \
x - 25 &   15\leq x\leq 17 \
x + 45 &   18\leq x\leq 24 \
x - 32 &   25\leq x\leq 44 \
x + 4 &   45\leq x\leq 49 \
x + 6 &   50\leq x\leq 51 \
x + 6 &   52\leq x\leq 52 \
x + 13 &   53\leq x\leq 53 \
x + 28 &   54\leq x\leq 55 \
x + 32 &   56\leq x\leq 60 \
x + 36 &   61\leq x\leq 63 \
x + 4 &   64\leq x\leq 68 \
x - 66 &   69\leq x\leq 69 \
x + 3 &   70\leq x\leq 76 \
x - 33 &   77\leq x\leq 92 \
x - 74 &   93\leq x\leq 94 \
x - 67 &   95\leq x\leq 96 \
x - 30 &   97\leq x\leq 97 \
x - 80 &   98\leq x\leq 99 \
x &   100\leq x\leq \infty \
\end{cases}
```

</td>
</tr>
</table>