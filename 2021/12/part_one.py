import networkx as nx
import copy

input = [ x.strip().split("-") for x in open("2021/day12/input.txt", "r").readlines() ]

graph = nx.Graph()
graph.add_edges_from(input)

def find_paths(graph, paths):
  # for every path so far:
  for path in paths:
    # take the current cave and find its neighbors
    node = path[-1]
    # print(f'currently at: {node}')
    if node == "end": continue
    neighbors = list(nx.all_neighbors(graph, node))
    # for each neighbor
    for cave in neighbors:
      # cant visit small caves twice
      if cave.lower() == cave and cave in path: continue
      # print(f'  found valid neighbor: {cave}')
      p = copy.deepcopy(path)
      p.append(cave)
      paths.append(p)


paths = [["start"]]
find_paths(graph, paths)
paths = list(filter(lambda p: p[-1] == "end", paths))
print(f'there are {len(paths)} paths')
# for path in paths: print(path)
