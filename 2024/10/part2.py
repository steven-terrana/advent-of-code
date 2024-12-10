import os

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = file.read()

map = []
for line in input.split("\n"):
    row = []
    for c in list(line):
        if c == ".":
            row.append(c)
        else:
            row.append(int(c))
    map.append(row)

neighbors = [(0, 1), (0, -1), (1, 0), (-1, 0)]
trail_length = 9


def count_trails(r, c):
    trails = [[(r, c)]]
    found = []
    while len(trails) > 0:
        t = trails.pop()
        for n in neighbors:
            tr = t[-1][0] + n[0]
            tc = t[-1][1] + n[1]
            if 0 <= tr < len(map) and 0 <= tc < len(map[0]):
                if map[tr][tc] == len(t):
                    new_trail = t.copy()
                    new_trail.append((tr, tc))
                    if map[tr][tc] == trail_length:
                        found.append(new_trail)
                    else:
                        trails.append(new_trail)
    return len(found)


score = 0
for r in range(len(map)):
    for c in range(len(map[0])):
        if map[r][c] == 0:
            score += count_trails(r, c)

print(score)
