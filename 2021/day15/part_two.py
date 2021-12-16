import networkx as nx
from termcolor import colored
import itertools
import math

# build a directional graph where:
#  nodes:
#    are tuple coordinates such as (0,0)
#  edges:
#    - risk scores determined calculating the larger 
#      grids values on demand, rather than actually 
#      creating it
#    - edge from node A to node B with weight equal 
#      to the risk score of node B
#    - edge from node B to node A with weight equal 
#      to the risk score of node A
def build_graph(grid, multiplier):
  n = len(grid)
  graph = nx.DiGraph()
  nodes = itertools.product(range(multiplier * n),repeat=2)
  graph.add_nodes_from(nodes)
  # Define the relative coordinates for neighbors
  #                up     down     left    right
  neighbors = [ (-1, 0), (1, 0), (0, 1), (0, -1) ]
  for node in nx.nodes(graph):
    (r, c) = node
    for n in neighbors:
      r_b = r + n[0]
      c_b = c + n[1]
      node_b = (r_b, c_b)
      if graph.has_node(node_b):
        weight = calculate_weight(grid, r_b, c_b)
        graph.add_edge(node, node_b, weight=weight)
     
  return graph

# creating the larger grid based on the puzzle
# input seems harder than just calculating what
# value an arbitrary position would have based
# on the original grid
def calculate_weight(grid, r, c):
  # calculate R and C, which are the row
  # and column indices of the _tile_ we'd
  # be in based on the input coordinates 
  # of r and c
  n = len(grid)
  R = int(math.floor(r / n)) #
  C = int(math.floor(c / n))
  # get the original weight in the og tile
  weight = grid[ r % n ][ c % n ]
  # calculate the addition to the risk
  # score based on tile position
  x = R + C
  for i in range(x):
    weight += 1
    if weight > 9: weight = 1
  return weight

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
multiplier = 5
graph = build_graph(grid, multiplier)
start = (0,0)
end = (multiplier*len(grid)-1, multiplier*len(grid[0])-1)
length = nx.shortest_path_length(graph, source=start, target=end, weight="weight")
print(length)