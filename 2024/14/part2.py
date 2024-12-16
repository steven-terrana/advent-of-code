import os
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation, FFMpegWriter


class Vector:
    def __init__(self, pr, pc, vc, vr):
        self.pc = pc
        self.pr = pr
        self.vr = vr
        self.vc = vc

    def pos_at(self, t):
        return (self.pc + self.vr * t, self.pr + self.vc * t)

    @staticmethod
    def parse(line):
        import re

        n = map(int, re.findall(r"-?\d+", line))
        return Vector(*n)


def print_grid(grid):
    for r in grid:
        print("".join(map(str, r)))


class Grid:
    def __init__(self, width, length):
        self.w = width
        self.l = length

    def display(self, vectors, t):
        pos = [v.pos_at(t) for v in vectors]
        g = [[0 for _ in range(self.w)] for _ in range(self.l)]

        for r, c in pos:
            g[r % self.l][c % self.w] += 1

        return g


def spatial_autocorrelation(grid):
    """quantifies how similar pixels are to each other"""
    rows, cols = len(grid), len(grid[0])
    matches = 0
    total_neighbors = 0
    for i in range(rows):
        for j in range(cols):
            if i > 0:  # Compare with top neighbor
                matches += grid[i][j] == grid[i - 1][j]
                total_neighbors += 1
            if j > 0:  # Compare with left neighbor
                matches += grid[i][j] == grid[i][j - 1]
                total_neighbors += 1
    return matches / total_neighbors if total_neighbors > 0 else 0


# we solved this first by visual inspection...
# there were odd amounts of organization to the pixels at
# t = 57 160 263.  so inspecting img(t) = 57 + 103 * t
# resulted in the answer pretty quickly.
#
# for a data-based solution, we can assume that an organized
# picture will have a higher degree of spatial autocorrelation
# than the static noise in most frames. so to automate finding
# the right time, calculate the correlation over the first 10K
# seconds and print the index of the most correlated picture

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    vectors = [Vector.parse(line) for line in file.read().split("\n")]

g = Grid(101, 103)

img = g.display(vectors, 10403)

# inital plot
fig, ax = plt.subplots()
heatmap = ax.imshow(img, cmap="viridis", interpolation="nearest")
plt.colorbar(heatmap, ax=ax)
plt.title("t=0")


t = 0
correlation = []
start_frame = 6600
for t in range(6600, 6800):
    img = g.display(vectors, t)
    correlation.append(spatial_autocorrelation(img))
    plt.title(f"t = {t}, s = {correlation[-1]}")
    heatmap.set_data(img)
    plt.pause(0.01)

index = correlation.index(max(correlation))
print(start_frame + index)

heatmap.set_data(g.display(vectors, start_frame + index))
plt.title(f"t={start_frame + index}, correlation = {correlation[index]}")
plt.show()
