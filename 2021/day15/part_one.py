import networkx as nx
from termcolor import colored
import matplotlib.pyplot as plt
import itertools

# build a directional graph where:
#  nodes:
#    are tuple coordinates such as (0,0)
#  edges:
#    - risk scores determined by the puzzle input (grid variable)
#    - edge from node A to node B with weight equal to the risk score of node B
#    - edge from node B to node A with weight equal to the risk score of node A
def build_graph(grid):
  graph = nx.DiGraph()
  nodes = itertools.product(range(len(grid)),repeat=2)
  graph.add_nodes_from(nodes)
  # Define the relative coordinates for neighbors
  #                up     down     left    right
  neighbors = [ (-1, 0), (1, 0), (0, -1), (0, 1) ]
  for node in nx.nodes(graph):
    (r, c) = node
    for n in neighbors:
      r_b = r + n[0]
      c_b = c + n[1]
      node_b = (r_b, c_b)
      if graph.has_node(node_b):
        graph.add_edge(node, node_b, weight=grid[r_b][c_b])
     
  return graph

# for debugging: 
#  print the grid while highlighting
#  the shortest path
def print_path(grid, path):
  for r, row in enumerate(grid):
    for c in range(len(row)):
      if (r, c) in path: 
        print(colored(grid[r][c], 'red', attrs=['bold']), end=' ')
      else:
        print(grid[r][c], end=' ')
    print("")

grid = [[ int(x) for x in list(line.strip()) ] for line in open("2021/day15/input.txt", "r").readlines() ]
graph = build_graph(grid)
start = (0,0)
end = (len(grid)-1, len(grid[0])-1)

# used for debugging
# path = nx.shortest_path(graph, source=start, target=end, weight="weight")
# print_path(grid, path)  

length = nx.shortest_path_length(graph, source=start, target=end, weight="weight")
print(length)