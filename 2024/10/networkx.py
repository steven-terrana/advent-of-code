import os
import networkx as nx
import matplotlib.pyplot as plt

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = file.read()

grid = [[int(n) for n in list(line)] for line in input.split("\n")]

graph = nx.DiGraph()

# add nodes
for r, row in enumerate(grid):
    for c, value in enumerate(row):
        graph.add_node((r, c), value=value)

# add edges
for r, row in enumerate(grid):
    for c, value in enumerate(row):
        for n in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr = r + n[0]
            nc = c + n[1]
            if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
                if grid[nr][nc] - grid[r][c] == 1:
                    graph.add_edge((r, c), (nr, nc))

potential_trailheads = [n for n, attr in graph.nodes(data=True) if attr["value"] == 0]
summits = [n for n, attr in graph.nodes(data=True) if attr["value"] == 9]

## solve
part1 = 0
part2 = 0
for t in potential_trailheads:
    for s in summits:
        if nx.has_path(graph, t, s):
            part1 += 1
            part2 += len(list(nx.all_simple_paths(graph, t, s)))

print(part1)
print(part2)
