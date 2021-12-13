import collections
import networkx as nx
import copy

from networkx.generators import small

input = [ x.strip().split("-") for x in open("2021/day12/input.txt", "r").readlines() ]

graph = nx.Graph()
graph.add_edges_from(input)

# return True if this cave is not permitted
def some_annoying_condition(path, cave):
  # start not allowed
  if cave == "start": return True
  # big is allowed
  if cave.upper() == cave: return False
  # small caves have more rules....
  if cave.lower() == cave:
    # if never visited, allowed
    if cave not in path: return False  
    # if already visited, only allowed if no other caves have been visited twice
    else: 
      small_caves_in_path = list(filter(lambda cave: cave.lower() == cave, path))
      occurences = collections.Counter(small_caves_in_path)
      return 2 in occurences.values()

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
      if some_annoying_condition(path, cave): continue
      # print(f'  found valid neighbor: {cave}')
      p = copy.deepcopy(path)
      p.append(cave)
      paths.append(p)


paths = [["start"]]
find_paths(graph, paths)
paths = list(filter(lambda p: p[-1] == "end", paths))
print(f'there are {len(paths)} paths')
# for path in paths: print(path)
