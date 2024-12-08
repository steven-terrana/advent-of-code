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
        # antinode 1 is point a - slope
        antinodes.add((a[0] - dr, a[1] - dc))
        # antinode 2 is point b + slope
        antinodes.add((b[0] + dr, b[1] + dc))


# filter the antinodes based on if they're on the map
antinodes_on_map = [
    n for n in antinodes if 0 <= n[0] < len(map) and 0 <= n[1] < len(map[0])
]

print(len(antinodes_on_map))
