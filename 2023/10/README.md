# Part 2

In part 1, we determined the cycle in the graph. The nodes in this cycle can be viewed as the boundary points of a [lattice polygon](https://mathworld.wolfram.com/LatticePolygon.html), conveniently in clockwise order.

Given these points are in a clockwise order, we can treat each boundary point as a vertex and use the [Shoelace Formula](https://en.wikipedia.org/wiki/Shoelace_formula#Shoelace_formula) to determine the area of the polygon. 

$$
A = \frac{1}{2} \left| \sum_{i=1}^{n} (x_i y_{i+1} - y_i x_{i+1}) \right|
$$

We can then use [Pick's Theorem](https://en.wikipedia.org/wiki/Pick%27s_theorem) to determine the inner points of the polygon.

$$
A = I + \frac{B}{2} - 1 \\
$$

$$
\therefore I = A - \frac{B}{2} + 1
$$

where:
* $I$ the number of interior points
* $B$ the number of boundary points
* $A$ the total area of the polygon