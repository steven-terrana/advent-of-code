import os
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap

directions = {"^": (-1, 0), ">": (0, 1), "<": (0, -1), "v": (1, 0)}


def move(map, direction):
    # find current position
    for r in range(len(map)):
        if "@" in map[r]:
            position = (r, map[r].index("@"))
            break
    # calculate the number of boxes adjacent
    # to our position in the specified direction
    dr, dc = directions[direction]
    r, c = position
    n = 1
    while map[r + n * dr][c + n * dc] == "O":
        n += 1

    # if the next spot is a wall, leave
    if map[r + n * dr][c + n * dc] != ".":
        return

    n -= 1

    # move the boxes
    if direction == "<":
        map[r][c] = "."
        map[r][c - 1] = "@"
        for i in range(c - n - 1, c - 1):
            map[r][i] = "O"

    elif direction == ">":
        map[r][c] = "."
        map[r][c + 1] = "@"
        for i in range(c + 2, c + 2 + n):
            map[r][i] = "O"

    elif direction == "^":
        map[r][c] = "."
        map[r - 1][c] = "@"
        for i in range(r - n - 1, r - 1):
            map[i][c] = "O"

    elif direction == "v":
        map[r][c] = "."
        map[r + 1][c] = "@"
        for i in range(r + 2, r + 2 + n):
            map[i][c] = "O"


def as_img(map):
    data = []
    lookup = {".": 0, "#": 1, "O": 2, "@": 3}
    for r, row in enumerate(map):
        pixels = []
        for c, char in enumerate(row):
            pixels.append(lookup[char])
        data.append(pixels)
    return data


with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    map, instructions = file.read().split("\n\n")

map = [list(line) for line in map.split("\n")]
instructions = list(instructions.replace("\n", ""))


# inital plot
# fig, ax = plt.subplots()
# colors = ["#FFFFFF", "#AEAEAE", "#0000FF", "#FF00FF"]
# custom_cmap = ListedColormap(colors)
# img = ax.imshow(as_img(map), cmap=custom_cmap, interpolation="nearest")
# plt.colorbar(img, ax=ax)


for idx, d in enumerate(instructions):
    move(map, d)
    # # img.set_data(as_img(map))
    # plt.title(f"{idx} / {len(instructions)}")
    # plt.pause(0.01)

# plt.show()

score = 0
for r, row in enumerate(map):
    for c, char in enumerate(row):
        if char == "O":
            score += 100 * r + c

print(score)
