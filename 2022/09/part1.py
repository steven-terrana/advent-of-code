import os

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = [line.split() for line in file.read().split("\n")]

directions = {"R": (1, 0), "L": (-1, 0), "U": (0, 1), "D": (0, -1)}
h = (0, 0)
t = (0, 0)

for i in input:
    dir, steps = i
    steps = int(steps)
    dr, dc = directions[dir]
    for _ in range(steps):
        h = (h[0] + dr, h[1] + dc)
        # # to the right
        # if h[1] - t[1] == 2 and h[0] - t[0] == 0:
        #     t = (t[0], t[1] + 1)
        # # to the upper right
        # if h[1] - t[1] == 1 and h[0] - t[0] == -2:
        #     t = (t[0] + 1, t[1] - 1)
        print(h, t)
