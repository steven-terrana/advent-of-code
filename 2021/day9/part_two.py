import math
import copy

# generate raw heatmap
input = open("day9/input.txt", "r").readlines()
heatmap_raw = [ [int(x) for x in list(line.strip())] for line in input ]

# surround the heatmap grid in math.inf to simplify things later
heatmap = copy.deepcopy(heatmap_raw)
## pad left and right borders with inf
for row in heatmap:
  row.insert(0, math.inf)
  row.append(math.inf)

## bad top and bottom with inf
padding = [math.inf] * len(heatmap[0])
heatmap.insert(0, padding)
heatmap.append(padding)

# Determine lowpoints:
#   a lowpoint will be anywhere where the points 
#   neighbors are all greater than the current depth
relative_coordinates = [ [-1, 0], [1, 0], [0, -1], [0, 1] ]
lowpoints = []
## iterate over the heatmap, skipping the inf padding
for x in range(1, len(heatmap) - 1):
  row = heatmap[x]
  for y in range(1, len(row) - 1):
    depth = heatmap[x][y]
    lowpoint = True
    for c in relative_coordinates:
      if depth >= heatmap[x + c[0]][y + c[1]]:
        lowpoint = False
        break
    if lowpoint: 
      lowpoints.append({
        depth: depth,
        "x": x-1,
        "y": y-1
      })

# Create Basin Map:
#  1. create a new 2D grid where every point is None 
#     that isn't a peak (depth of 9)
#  2. plot each lowpoint on the map using a Basin ID
#  3. iterate over the values in the map:
#       if a point has a neighbor that isn't None 
#       or 9 it means the point shares the Basin Id (the neighbor's value)
#  4. perform this loop until the basin ID's 
#     have filled the map and no None's remian

## 1. Create Basin Map 
basin_map = []
for row in heatmap_raw:
  basin_map.append([])
  for value in row: 
    basin_map[-1].append(None if value != 9 else 9)

## 2. plot lowpoints 
for idx, lowpoint in enumerate(lowpoints):
  basin_map[lowpoint["x"]][lowpoint["y"]] = -1 * (idx+1)

## 3 + 4: loop until map is filled
### while there are Nones left in the map
while sum([row.count(None) for row in basin_map]) > 0:
  ### iterate over the map
  for x, row in enumerate(basin_map):
    for y, value in enumerate(row):
      ### ignore peaks
      if value == 9: continue
      ### check each neighbor for a Basin ID 
      for c in relative_coordinates:
        (rx, ry) = c
        ### negative index accessing not allowed here, skip
        if x + rx < 0 or y + ry < 0: continue
        ### get the neighbor's value
        try: neighbor = basin_map[x + rx][y + ry]
        except IndexError: continue
        ### check if the neighbor is a Basin ID
        if neighbor not in [None, 9]:
          basin_map[x][y] = neighbor

# at this point the map is filled out with 
# Basin ID's and 9s. A basin's size is equal
# to the number of times the Basin ID appears
sizes = []
for idx in range(len(lowpoints)):
  basin_id = -1 * (idx + 1)
  sizes.append(sum([row.count(basin_id) for row in basin_map]))

# multiply the 3 largest basin sizes
sizes.sort()
print(sizes[-1] * sizes[-2] * sizes[-3])