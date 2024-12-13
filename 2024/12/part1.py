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


print(sum([area(r) * perimeter(r) for r in nx.connected_components(g)]))
