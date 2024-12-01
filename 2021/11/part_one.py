import itertools

input = [ line.strip() for line in open("2021/day11/input.txt", "r").readlines() ]

def increment(grid):
  for x, row in enumerate(grid): 
    for y, val in enumerate(row):
      grid[x][y] += 1

def flash(grid):
  # get relative coordinates for all neighbors 
  neighbors = list(itertools.product([-1, 0, 1], repeat=2))
  neighbors.remove((0,0)) # remove self

  # track octopuses flashed this step
  flashed = set()

  # trigger flashes
  flag = True
  while flag:
    flag = False
    for x, row in enumerate(grid):
      for y, value in enumerate(row):
        if value > 9 and (x,y) not in flashed:
          flag = True
          flashed.add((x,y))
          for n in neighbors: 
            (rx, ry) = n
            rel_x = x + rx
            rel_y = y + ry
            # no negative access
            if rel_x < 0 or rel_y < 0: continue
            try: grid[rel_x][rel_y] += 1
            except IndexError: continue
  
  # reset all flashed octopuses to zero
  for o in flashed: 
    (x,y) = o
    grid[x][y] = 0

  return len(flashed)

# create grid
grid = []
for x, line in enumerate(input):
  grid.append([])
  for y, value in enumerate(list(line)):
    grid[-1].append(int(value))

# step
count = 0
for step in range(100):
  increment(grid)
  count += flash(grid)

print(count)