import re
import sympy
from sympy.solvers.diophantine.diophantine import diophantine

def parse_input():
  input = open("2021/day17/input.txt","r").read().strip()
  match = re.findall(r"-?\d+", input)
  return [ int(n) for n in match ]

# determines if a probe fired with an initial velocity (iv)
# will hit a target area defined by x_range and y_range 
def is_valid(iv, x_range, y_range):
  (v_x, v_y) = iv
  (x_min, x_max) = x_range
  (y_min, y_max) = y_range

  x = 0
  y = 0
  while True:
    # increment location
    prev_x = x
    x += v_x
    y += v_y
    # increment velocity
    v_x -= 1
    if v_x < 0: v_x = 0
    v_y -= 1
    # is valid?
    if x_min <= x <= x_max and y_min <= y <= y_max:
      return True
    # is miss? 
    ## x-axis check: not moving and outside range
    if prev_x == x and any([x < x_min, x > x_max]):
      return False
    ## y-axis check: y < y_min
    if y < y_min:
      return False

# use sympy to solve for the lower and upper bounds
# of velocity for a given range. 
# 
# We could have used sympy to just get all the initial 
# velocites instead of just the upper/lower bounds.. 
# but.. i don't think sympy supports 
# systems of piecewise diophantine inequalities.
#
# system of equations:
#               equation        | when
#         n * v_x - (n^2 - n)/2 | n < v_x 
# 1. x = /
#        \
#         (v_x * (v_x + 1))/2   | n >= v_x 
# 2. y= n * v_y - (n^2 - n)/2
#
# constraints:
# 1. n > 0
# 2. x_min <= x <= x_max
# 3. y_min <= y <= y_max
# 4. all variables are integers
def get_bounds(_min, _max):
  solutions = []
  for d in range(_min, _max+1):
    n = sympy.Symbol('a', integer=True, positive=True)
    v = sympy.Symbol('v', integer=True)
    eq = n * v - (n**2 - n)/2 - d
    t, _ = sympy.symbols('t,t_0', integer=True)
    solutions.extend(diophantine(eq, t, [n,v]))
  velocities = [ v[1] for v in solutions ]
  upper = max(velocities)
  lower = min(velocities)
  return (lower, upper)

(x_min, x_max, y_min, y_max) = parse_input()
(yv_lower, yv_upper) = get_bounds(y_min, y_max)
(xv_lower, xv_upper) = get_bounds(x_min, x_max)

# "intelligent" brute force checking each possible
# initial velocity based on the upper/lower bounds
# determined by sympy
solution = []
for yv in range(yv_lower, yv_upper+1):
  for xv in range(xv_lower, xv_upper+1):
    iv = (xv,yv)
    if is_valid(iv, (x_min, x_max), (y_min,y_max)):
      solution.append(iv)

print(len(set(solution)))