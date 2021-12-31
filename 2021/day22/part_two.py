import re
import numpy as np
from collections import defaultdict

def parse_input(path):
  '''
  returns a list of lists where the first element
  is True (on) or False (off) and the second element
  is a tuple of tuples representing the x,y,z bounds:
    ( (x0, x1), (y0, y1), (z0, z1) )
  '''
  input = open(f"2021/day22/{path}", "r").readlines()
  cubes = []
  for line in input:
    action = line.split()[0]
    value = action == "on"
    numbers = np.array([ int(n) for n in re.findall(r"-?\d+", line) ])
    cube = [ value, tuple([tuple(t) for t in numbers.reshape(3,2)]) ]
    cubes.append(cube)
  return cubes

def intersect(a, b):
  '''
  returns a new cube representing the interesection
  of a and b if there is an intersection, None otherwise.
  '''
  intersection = []
  for i in range(3):
    intersection.append([])
    d0 = a[i]
    d1 = b[i]
    # if no intersection in this dimension 
    # then there's no intersection overall
    if d0[1] < d1[0] or d1[1] < d0[0]: return None
    # lower bound
    intersection[-1].append(d1[0] if d0[0] < d1[0] else d0[0])
    # upper bound
    intersection[-1].append(d1[1] if d0[1] > d1[1] else d0[1])
  return tuple([ tuple(t) for t in intersection ])

def calculate_volume(cube):
  '''
  calculates the volume of a given cube
  '''
  (x,y,z) = cube
  x_len = abs(x[1] - x[0]) + 1
  y_len = abs(y[1] - y[0]) + 1
  z_len = abs(z[1] - z[0]) + 1
  return x_len * y_len * z_len

def get_total(count):
  '''
  determines the total number of on cubes
  based on the count dict
  '''
  total = 0
  for cube, times in count.items():
    total += calculate_volume(cube) * times
  return total

# To determine the number of on cubes, keep track of all 
# original cubes and intersections (also cubes) as well 
# as the number of times those cubes should be counted in the
# total summation. 
#
# considerations:
#  1. iterate over each reboot step
#  2. if the reboot step is an "on" cube, track it
#  3. check for intersections with all previous cubes
#     and reset the tracker for the intersection
cuboids = parse_input("input.txt")
cubes = defaultdict(int) # avoid missing key error and return 0
for (on, current_cube) in cuboids:
  # new tracker for simultaneous updating
  new_cubes = defaultdict(int)

  if on: 
    new_cubes[current_cube] += 1

  # check for intersections against all previously
  # tracked cubes and intersections
  for cube in cubes:
    intersection = intersect(current_cube, cube)
    if intersection:
      new_cubes[intersection] -= cubes[cube]

  # update the tracker
  for cube in new_cubes:
    cubes[cube] += new_cubes[cube]

print(get_total(cubes))