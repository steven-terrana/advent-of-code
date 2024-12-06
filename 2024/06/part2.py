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

# cardinal directional vectors sequenced clockwise
directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]


def stroll(map, g_r, g_c):
    """
    walk until the guard exits the map (returns False) or until
    we've been to this exact place heading this exact direction
    before - indicating we're in a loop.
    """
    turns = 0
    # state tuple now includes direction in addition to position
    visited = set([(directions[0], g_r, g_c)])
    while True:
        next_r = g_r + directions[turns % 4][0]
        next_c = g_c + directions[turns % 4][1]
        if not (0 <= next_r < len(map) and 0 <= next_c < len(map[0])):
            # exited without revisiting a state
            return False

        obstructed = map[next_r][next_c] == "#"
        if obstructed:
            turns += 1
        else:
            g_r = next_r
            g_c = next_c

        state = (directions[turns % 4], g_r, g_c)
        if state in visited:
            # revisited a state
            return True
        else:
            visited.add(state)


count = 0
for r in range(len(map)):
    for c in range(len(map[0])):
        if map[r][c] == ".":
            map[r][c] = "#"
            if stroll(map, g_r, g_c):
                count += 1
            map[r][c] = "."

print(count)
