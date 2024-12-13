import os
import networkx as nx

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


def perimeter(region):
    """
    for each node, the sides exposed to the outside are:
        4 - the number of neighbors
    the total perimeter is the sum of these exposed sides
    """
    return sum([4 - len(list(g.neighbors(n))) for n in list(region)])


def perimeter_points(region):
    """
    conceptually our plan is to explode individual grid
    coordinates into 4 points for the 4 corners and then
    track the points that are part of the perimeter.

    for every node, a side is a part of the perimeter
    if it does not have a neighbor.
    """
    points = []
    for r, c in region:
        # top is exposed
        if (r - 1, c) not in region:
            points.extend([(r, c), (r, c + 1)])
        # bottom is exposed
        if (r + 1, c) not in region:
            points.extend([(r + 1, c), (r + 1, c + 1)])
        # left is exposed
        if (r, c - 1) not in region:
            points.extend([(r, c), (r, c + 1)])
        # right is exposed
        if (r, c + 1) not in region:
            points.extend([(r, c + 1), (r + 1, c + 1)])
    return points


def sides(region):
    """ """
    print(region)
    print(perimeter_points(region))


regions = list(nx.connected_components(g))
sides(regions[0])
