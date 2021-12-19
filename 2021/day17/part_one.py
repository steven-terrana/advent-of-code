import re
import sympy
from sympy.solvers.diophantine.diophantine import diophantine

def parse_input():
  input = open("2021/day17/input.txt","r").read().strip()
  match = re.findall(r"-?\d+", input)
  return [ int(n) for n in match ]

def solve(y):
  n = sympy.Symbol('n', integer=True, positive=True)
  v = sympy.Symbol('v', integer=True)
  eq = n * v - (n**2 - n)/2 - y
  t, _ = sympy.symbols('t,t_0', integer=True)
  solution = diophantine(eq, t, [n,v])
  return solution

(x_min, x_max, y_min, y_max) = parse_input()

solutions = []
for y in range(y_min, y_max+1): solutions.extend(solve(y))

v_max = max([pair[1] for pair in solutions])
h_max = int((v_max * (v_max + 1))/2)
print(h_max)