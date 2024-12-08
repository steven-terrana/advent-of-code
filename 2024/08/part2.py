import os
import itertools

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    map = [list(line) for line in file.read().split("\n")]

# create a dictionary of frequencies and their corresponding antenna locations
antenna_locations = {}
for r, row in enumerate(map):
    for c, char in enumerate(row):
        if char != ".":
            if char not in antenna_locations:
                antenna_locations[char] = []
            antenna_locations[char].append((r, c))

# antinodes can be found by:
# 1. find every unique pair of antenna of the same frequency
# 2. for each pair, calculate the slope of the line intersecting the two
# 3. extrapolate the points on the line before and after the antenna
antinodes = set()
for frequency, locations in antenna_locations.items():
    for pair in itertools.combinations(locations, 2):
        # slope is delta row over delta column
        (a, b) = pair
        dr = b[0] - a[0]
        dc = b[1] - a[1]
        # antinodes to the left are point a - slope until outside map
        r = a[0] - dr
        c = a[1] - dc
        while 0 <= r < len(map) and 0 <= c < len(map[0]):
            antinodes.add((r, c))
            r -= dr
            c -= dc
        # antinode 2 is point b + slope until outside the map
        r = b[0] + dr
        c = b[1] + dc
        while 0 <= r < len(map) and 0 <= c < len(map[0]):
            antinodes.add((r, c))
            r += dr
            c += dc

# if a given frequency has more than 1 antenna,
# add all the antenna locations as antinodes
for freq, loc in antenna_locations.items():
    if len(loc) > 1:
        antinodes.update(loc)

print(len(antinodes))
