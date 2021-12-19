import re
import sympy
from sympy.solvers.diophantine.diophantine import diophantine
import itertools

def parse_input():
  input = open("2021/day17/test.txt","r").read().strip()
  match = re.findall(r"-?\d+", input)
  return [ int(n) for n in match ]

# def get_velocities():
#   input = open("2021/day17/velocities.txt", "r").read()
#   match = re.findall(r"-?\d+,-?\d+", input)
#   velocities = []
#   for m in match:
#     velocities.append(tuple([int(n) for n in m.split(",")]))
#   return velocities

def solve(d):
  n = sympy.Symbol('n', integer=True, positive=True)
  v = sympy.Symbol('v', integer=True)
  eq = n * v - (n**2 - n)/2 - d
  t, _ = sympy.symbols('t,t_0', integer=True)
  solution = diophantine(eq, t, [n,v])
  return solution

(x_min, x_max, y_min, y_max) = parse_input()
y_solutions = []
for y in range(y_min, y_max+1): y_solutions.extend(solve(y))
x_solutions = []
for x in range(x_min, x_max+1): x_solutions.extend(solve(x))

print(f'x_solutions = {x_solutions}')
print((16,7) in x_solutions)

x_n = set([ pair[0] for pair in x_solutions ])
y_n = set([ pair[0] for pair in y_solutions ])
common = x_n.intersection(y_n)

velocities = set()
for n in common:
  valid_x = [ v[1] for v in x_solutions if v[0] == n ]
  valid_y = [ v[1] for v in y_solutions if v[0] == n ]
  n_permutations = list(itertools.product(valid_x, valid_y))
  velocities = velocities.union(n_permutations)

print(len(velocities))