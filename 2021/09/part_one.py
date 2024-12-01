import math

# generate raw heatmap
input = open("day9/input.txt", "r").readlines()
heatmap = [ [int(x) for x in list(line.strip())] for line in input ]

# surround the heatmap grid in math.inf to simplify things later
for row in heatmap:
  row.insert(0, math.inf)
  row.append(math.inf)

padding = [math.inf] * len(heatmap[0])
heatmap.insert(0, padding)
heatmap.append(padding)

# define coordinates to check
# for diagonals: 
# coordinates = list(itertools.product(*[[-1, 0, 1],[-1, 0, 1]]))
relative_coordinates = [ [-1, 0], [1, 0], [0, -1], [0, 1] ]
lowpoints = []
for i in range(1, len(heatmap) - 1):
  for j in range(1, len(row) - 1):
    depth = heatmap[i][j]
    lowpoint = True
    for c in relative_coordinates:
      if depth >= heatmap[i + c[0]][j + c[1]]:
        lowpoint = False
        break
    if lowpoint: lowpoints.append(depth)

print(sum([ x + 1 for x in lowpoints]))