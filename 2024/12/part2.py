import os
import networkx as nx
import math
import matplotlib.pyplot as plt

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    garden = [list(line.strip()) for line in file.read().split("\n")]

g = nx.Graph()

# create a graph and connect nodes to
# their neighbors if they're the same plot type
for r, row in enumerate(garden):
    for c, plot in enumerate(row):
        g.add_node((r, c), type=plot)
        for nr, nc in [(r, c + 1), (r + 1, c)]:
            if 0 <= nr < len(garden) and 0 <= nc < len(garden[0]):
                if garden[nr][nc] == plot:
                    g.add_edge((r, c), (nr, nc))


def area(region):
    """region area is equal to number of nodes"""
    return len(region)


def sides(region):
    # "explodes" a grid coordinate into its
    # 4 corners. based on which sides of the
    # plot don't have neighbors, add those corner
    # coordinates to the perimeter graph
    p = nx.Graph()
    for r, c in region:
        up_left = (r, c)
        up_right = (r, c + 1)
        down_left = (r + 1, c)
        down_right = (r + 1, c + 1)
        # top is exposed
        if (r - 1, c) not in region:
            p.add_edge(up_left, up_right)
        # bottom is exposed
        if (r + 1, c) not in region:
            p.add_edge(down_left, down_right)
        # left is exposed
        if (r, c - 1) not in region:
            p.add_edge(up_left, down_left)
        # right is exposed
        if (r, c + 1) not in region:
            p.add_edge(up_right, down_right)

    # for this geometry, the number of side is
    # equal to the number of columns
    sides = 0
    for n in p.nodes():
        neighbors = p.neighbors(n)
        if len(list(neighbors)) == 4:
            sides += 2
        else:
            # a node is a corner if its neighbors
            # do not share either a row or column coordinate
            (a, b) = p.neighbors(n)
            ar, ac = a
            br, bc = b
            if ar != br and ac != bc:
                sides += 1

    ## uncomment if you want to see each region perimeter plotted
    # pos = {node: (node[1], -node[0]) for node in p.nodes()}
    # nx.draw(p, pos, with_labels=True)
    # plt.show()
    return sides


total = 0
for region in nx.connected_components(g):
    r, c = list(region)[0]
    total += area(region) * sides(region)

print(total)
