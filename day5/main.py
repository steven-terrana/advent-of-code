from fractions import Fraction

input = open("day5/input.txt", "r").read().splitlines()

class Line:
  def __init__(self, raw_coordinates):
    split = raw_coordinates.split("->")
    (self.x1, self.y1) = [ int(p) for p in split[0].split(",") ]
    (self.x2, self.y2) = [ int(p) for p in split[1].split(",") ]

  def print_grid(self, grid):
    for row in grid: print(" ".join([str(x) for x in row]))

  def calculate_slope(self):
    slope_x, slope_y = None, None
    if self.x1 == self.x2: 
      slope_x = 0
      slope_y = 1 if self.y1 < self.y2 else -1
    elif self.y1 == self.y2: 
      slope_x = 1 if self.x1 < self.x2 else -1
      slope_y = 0
    else: 
      slope_x = 1 if self.x1 < self.x2 else -1
      slope_y = 1 if self.y1 < self.y2 else -1

    return [slope_x, slope_y]
    
  def plot(self, grid):
    # print('==============')
    # print(f'plotting from {self.x1},{self.y1} -> {self.x2},{self.y2}')
    # print('==============')
    slope_x, slope_y = self.calculate_slope()
    x = self.x1
    y = self.y1
    while True:
      # self.print_grid(grid)
      # print(f'plotting point: {x}, {y}')
      if y > len(grid) or x > len(grid[0]): break
      grid[x][y] += 1
      if x == self.x2 and y == self.y2:
        break     
      x += slope_x
      y += slope_y 
    
    # self.print_grid(grid)
  
  def get_x(self): return [ self.x1, self.x2 ]
  def get_y(self): return [ self.y1, self.y2 ]

# create lines 
lines = []
for raw_coordinates in input: lines.append(Line(raw_coordinates))
# print(f'there are {len(lines)} lines')

# create grid
max_x = max([ max(line.get_x()) for line in lines ]) + 1
max_y = max([ max(line.get_y()) for line in lines ]) + 1
grid = []
for y in range(max_x): 
  grid.append([])
  for x in range(max_y):
    grid[-1].append(0)

# plot lines
for line in lines: line.plot(grid)

# calculate # of intersections
sum = 0
for row in grid: 
  # print(' '.join([str(x) for x in row]))
  sum += len(list(filter(lambda x: x > 1, row)))

print(f'# of intersections: {sum}')