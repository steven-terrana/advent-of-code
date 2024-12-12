import os
from collections import deque
import networkx as nx

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = [int(n) for n in file.read().split()]

# add each stone to a queue
stones = deque()
for s in input:
    stones.append(s)


# use a directed graph as a cache where
# nodes are stones and edges are transformations after blinking.
# we need to give an edge weight to represent cases where a number
# results in the same stone output twice (e.g, [22] -> [2,2])
#
# for any given number, if you compute subsequent blinks long enough
# you complete the graph and there are no new nodes or edges.
#
# take note that these transformations are independent of other stones
# in a list, so you can process stones individually regardless of which
# blink iteration you're on.
g = nx.DiGraph()
blinked = []  # keep track of stones you've already transformed
while stones:
    s = stones.pop()
    if s in blinked:
        # seen this one before, no need to recompute
        continue
    if s == 0:
        g.add_edge(s, 1, weight=1)
        stones.append(1)
    elif len(str(s)) % 2 == 0:
        n = len(str(s)) // 2
        a = int("".join(list(str(s))[:n]))
        b = int("".join(list(str(s))[n:]))
        if a == b:
            g.add_edge(s, a, weight=2)
        else:
            g.add_edge(s, a, weight=1)
            g.add_edge(s, b, weight=1)
        stones.append(a)
        stones.append(b)
    else:
        g.add_edge(s, s * 2024, weight=1)
        stones.append(s * 2024)
    blinked.append(s)  # we've now transformed this stone


# now that we don't need to actually do transformations we can just keep
# track of our current stones. The act of blinking is now, for each stone,
# getting the edges in the graph. By using a dictionary of stone ids whose
# value is the quantity in our hand, we can ensure the length of a given iteration
# is at most the number of nodes in the graph.
def blink(_stones, n):
    stones = {}
    for s in set(_stones):
        stones[s] = _stones.count(s)

    for _ in range(n):
        updated = {}
        for s, n_duplicates in stones.items():
            for e in g.edges(s, data=True):
                (_, target, data) = e
                weight = data["weight"]
                if target in updated:
                    updated[target] += n_duplicates * weight
                else:
                    updated[target] = n_duplicates * weight
        stones = updated
    return sum(stones.values())


print(blink(input, 75))
