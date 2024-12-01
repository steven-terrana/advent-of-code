import re
import numpy as np

class CuboidAction:
  '''represents an action to perform on a Cuboid'''

  @staticmethod
  def normalize(coordinates):
    left = coordinates[0]
    left += 50
    if left < 0: left = 0

    right = coordinates[1]
    right += 50
    if right > 100: right = 100
    return (left, right)

  def __init__(self, value, x, y, z):
    self.value = value
    self.x = CuboidAction.normalize(x)
    self.y = CuboidAction.normalize(y)
    self.z = CuboidAction.normalize(z)

  def perform(self, grid):
    (xl, xr) = self.x
    (yl, yr) = self.y
    (zl, zr) = self.z
    grid[xl:xr+1, yl:yr+1, zl:zr+1] = self.value
    return grid

def parse_input(path):
  '''parses the input and returns a list of CuboidActions'''
  input = open(f"2021/day22/{path}", "r").readlines()
  cuboids = []
  for line in input:
    action = line.split()[0]
    value = 0 if action == "off" else 1
    numbers = np.array([ int(n) for n in re.findall(r"-?\d+", line) ])
    cuboids.append(CuboidAction(value, *numbers.reshape(3,2)))
  return cuboids

grid = np.full((101,101,101), fill_value=0)
for action in parse_input("input.txt"): 
  grid = action.perform(grid)

flat = np.reshape(grid, (1, 101**3))[0]
print(sum(flat))