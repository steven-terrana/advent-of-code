import numpy as np 
import copy
from termcolor import colored

def parse_input(path):
  input = [ l.strip() for l in open(f"2021/day25/{path}", "r").readlines() ]
  r = len(input)
  c = len(input[0])
  grid = np.empty((r,c), dtype=np.str0)
  for r, row in enumerate(input):
    for c, value in enumerate(row):
      grid[r,c] = value
  return grid

def print_grid(grid):
  print("----------")
  for r in grid:
    for c in r:
      if c == ">": color="red"
      if c == "v": color="green"
      if c == ".": color="white"
      print(colored(c, color=color), end="")
    print()

def migrate(grid, direction):
  cucumbers = {
    ">": [0, 1],
    "v": [1, 0]
  }
  shape = np.shape(grid)
  new_grid = copy.deepcopy(grid)
  for r, row in enumerate(grid):
    for c, value in enumerate(row):
      if value == direction:
        n_r = r + cucumbers[direction][0]
        if n_r > shape[0] - 1: n_r = 0
        n_c = c + cucumbers[direction][1]
        if n_c > shape[1] - 1: n_c = 0
        if grid[n_r, n_c] == ".":
          new_grid[n_r, n_c] = direction
          new_grid[r,c] = '.'
  return new_grid


grid = parse_input("input.txt")

step = 0
while True:
  step += 1
  prior = copy.deepcopy(grid)
  grid = migrate(grid, ">")
  grid = migrate(grid, "v")
  if (prior == grid).all():
    print(f"no change after step {step}")
    break