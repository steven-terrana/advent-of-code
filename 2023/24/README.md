# Day 24

## Part 1

Each HailStone moves linearly through a 3D space.

For Part 1, we're only considering the 2D XY space and are asked to count the hailstone pairs who intersect in a given test area defined by

$$
lower < I_x <= upper \\
lower < I_y <= upper
$$

To determine the intersection point of two lines defined by $y=m(x-x_0) + y_0$

so given two rocks $a$ and $b$: 

$$m_a(x-x_{a}) + y_{a}=m_b(x-_{b}) + y_{b}$$

$$\therefore x = \frac{m_a \cdot x_{a} - m_b \cdot x_{b} + y_{b} - y_{a}}{m_a - m_b}$$

We can then substitute this value of $x$ into one of the original line equations to get $y$.
$$y = m_a  (x - x_a) + y_a$$

Finally, we can make determine the time at which each stone was at this intersection point so that we can validate it happens in the future. 

$$
\begin{cases}
t_a = \frac{x-x_a}{v_{ax}} \\
t_b = \frac{x-x_b}{v_{bx}}
\end{cases}
$$

A hailstone pair will count if the following conditions are all true:

$$
\begin{cases}
lower < x <= upper \\
lower < y <= upper \\
t_a > 0 \\
t_b > 0
\end{cases}
$$

## Part 2

we need to find an $L(t)$ that collides with each individual hailstone.

$$
L(t)=\begin{cases}
L_x(t) = L_x + v_xt \\
L_y(t) = L_y + v_yt \\
L_z(t) = L_z + v_zt \\
\end{cases}
$$

The answer to Part 2 will be:

$$P_2 = L_x + L_y + L_z$$

Therefore, for a given hailstone $A(t)$ and time $t_1$ we can derive 3 equations

$$A(t_1) = L(t_1)$$

$$
\begin{cases}
A_x(t) = A_{x0} + v_{xa}t = L_x + v_xt_1 \\
A_y(t) = A_{y0} + v_{ya}t = L_y + v_yt_1\\
A_z(t) = A_{z0} + v_{za}t = L_z + v_zt_1 \\
\end{cases}
$$

Thus far, we have 7 unknowns and 3 equations. Each subsequent hailstone adds 3 equations but only 1 more unknown (the collision time). Therefore, with 3 hailstones we'll have more equations than unknowns and can derive the unknowns defining $L(t)$.