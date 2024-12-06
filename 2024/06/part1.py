with open("input.txt", "r") as file:
    map = [list(line) for line in file.read().split("\n")]

g_r = None
g_c = None
for r, row in enumerate(map):
    if "^" in row:
        g_r = r
        g_c = row.index("^")
        break
print(g_r, g_c)

directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]
turns = 0
visited = set([(g_r, g_c)])

while True:
    # check next step
    next_r = g_r + directions[turns % 4][0]
    next_c = g_c + directions[turns % 4][1]
    if not (0 <= next_r < len(map) and 0 <= next_c < len(map[0])):
        break

    obstructed = map[next_r][next_c] == "#"
    if obstructed:
        turns += 1
    else:
        g_r = next_r
        g_c = next_c
        visited.add((g_r, g_c))

print(len(visited))
