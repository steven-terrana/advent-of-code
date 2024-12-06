with open("input.txt", "r") as file:
    map = [list(line) for line in file.read().split("\n")]

# get starting position of the guard
g_r = None
g_c = None
for r, row in enumerate(map):
    if "^" in row:
        g_r = r
        g_c = row.index("^")
        break

# keep track of how many times we've turned
turns = 0

# cardinal directional vectors sequenced clockwise
directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]

# keep track of where the guard has been
visited = set([(g_r, g_c)])

# keep walking until we exit the map
while True:
    next_r = g_r + directions[turns % 4][0]
    next_c = g_c + directions[turns % 4][1]

    # check if next step exits the map
    if not (0 <= next_r < len(map) and 0 <= next_c < len(map[0])):
        break

    # if the next step is obstructed, simply turn in place
    # otherwise, take the step
    obstructed = map[next_r][next_c] == "#"
    if obstructed:
        turns += 1
    else:
        g_r = next_r
        g_c = next_c
        visited.add((g_r, g_c))

print(len(visited))
