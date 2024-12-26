from collections import defaultdict
import itertools


def parse(input: str):
    edges = set(map(frozenset, [line.split("-") for line in input.split("\n")]))
    adjacency = defaultdict(lambda: set())
    for edge in edges:
        a, b = edge
        adjacency[a].add(b)
        adjacency[b].add(a)
    return (edges, adjacency)


def part1(edges, adjacency) -> int:
    triangles = set()
    for node in adjacency.keys():
        if node[0] != "t":
            continue
        neighbors = list(adjacency[node])
        for i in range(len(neighbors) - 1):
            for j in range(i + 1, len(neighbors)):
                e = frozenset((neighbors[i], neighbors[j]))
                if e in edges:
                    triangles.add(frozenset((node, neighbors[i], neighbors[j])))
    return len(triangles)


def is_clique(nodes, edges) -> bool:
    # a set of nodes is a click if every pair of nodes are connected
    pairs = itertools.combinations(nodes, 2)
    return all(frozenset(p) in edges for p in pairs)


def find_maximal_clique(nodes, edges):
    # returns the first instance of a clique of the maximum size
    for clique_size in range(len(nodes), 2, -1):
        possible_cliques = itertools.combinations(nodes, clique_size)
        for clique in possible_cliques:
            if is_clique(clique, edges):
                return clique
    return None


def part2(edges, adjacency) -> str:
    # every node has the same number of neighbors in this
    # situation, otherwise we would sort the dict to iterate
    # based on number of neighbors due to the fact that the
    # upper bound for maximal clique size is the maximum number
    # of edges a given node in the graph has.
    maximum_clique = ("", [])
    for node in adjacency.keys():
        neighbors = adjacency[node]
        local_maximum = find_maximal_clique(neighbors, edges)
        if local_maximum is not None and len(local_maximum) > len(maximum_clique[1]):
            maximum_clique = (node, local_maximum)
    clique = [maximum_clique[0]] + list(maximum_clique[1])
    return ",".join(sorted(clique))


def main(input: str):
    edges, adjacency = parse(input)

    print("part 1:", part1(edges, adjacency))
    print("part 2:", part2(edges, adjacency))


if __name__ == "__main__":
    import cProfile
    import pstats
    import os
    import time
    from colorama import Fore, Style

    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        input = f.read()

    with cProfile.Profile() as pr:
        start_time = time.time()
        main(input)
        end_time = time.time()
        print(
            Fore.CYAN
            + f"execution time: {end_time - start_time:.3f} seconds"
            + Style.RESET_ALL
        )

        # Save the profile data to a file
        with open(f"{os.path.dirname(__file__)}/solution.prof", "w") as f:
            stats = pstats.Stats(pr, stream=f)
            stats.strip_dirs()
            stats.sort_stats("cumtime")
            stats.dump_stats(f"{os.path.dirname(__file__)}/solution.prof")
