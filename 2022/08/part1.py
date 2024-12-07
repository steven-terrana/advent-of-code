import os

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = file.read()

rows = input.split("\n")
trees = [[int(n) for n in list(row)] for row in rows]

directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

R = len(trees)
C = len(trees[0])


visible = 0
for r in range(R):
    for c in range(C):
        # left
        left = trees[r][:c]
        if all([t < trees[r][c] for t in left]):
            visible += 1
            continue
        # right
        right = trees[r][c + 1 :]
        if all([t < trees[r][c] for t in right]):
            visible += 1
            continue
        # up
        up = [row[c] for row in trees[:r]]
        if all([t < trees[r][c] for t in up]):
            visible += 1
            continue
        # down
        down = [row[c] for row in trees[r + 1 :]]
        if all([t < trees[r][c] for t in down]):
            visible += 1
            continue

print(visible)
