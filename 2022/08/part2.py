import os

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = file.read()

rows = input.split("\n")
trees = [[int(n) for n in list(row)] for row in rows]

directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

R = len(trees)
C = len(trees[0])


def visibility(h, trees):
    v = 0
    for t in trees:
        v += 1
        if t >= h:
            break
    return v


def scenic_score(r, c):
    h = trees[r][c]
    # left
    left = trees[r][:c]
    left.reverse()
    left_vis = visibility(h, left)
    # right
    right = trees[r][c + 1 :]
    right_vis = visibility(h, right)
    # up
    up = [row[c] for row in trees[:r]]
    up.reverse()
    up_vis = visibility(h, up)
    # down
    down = [row[c] for row in trees[r + 1 :]]
    down_vis = visibility(h, down)
    # calculate scenic score
    s = left_vis * right_vis * up_vis * down_vis
    return s


score = 0
for r in range(1, R - 1):
    for c in range(1, C - 1):
        score = max(score, scenic_score(r, c))

print(score)
