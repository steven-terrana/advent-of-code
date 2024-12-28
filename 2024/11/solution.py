import networkx as nx
from functools import cache


def build_cache(stones):
    queue = stones.copy()
    # use a directed graph as a cache where
    # nodes are stones and edges are transformations after blinkincache.
    # we need to give an edge weight to represent cases where a number
    # results in the same stone output twice (e.g, [22] -> [2,2])
    #
    # for any given number, if you compute subsequent blinks long enough
    # you complete the graph and there are no new nodes or edges.
    #
    # take note that these transformations are independent of other stones
    # in a list, so you can process stones individually regardless of which
    # blink iteration you're on.
    cache = nx.DiGraph()
    blinked = []  # keep track of stones you've already transformed
    while queue:
        stone = queue.pop()
        if stone in blinked:
            # seen this one before, no need to recompute
            continue

        # blink conditions:
        #  0 -> 1
        #  even characters -> split in two down middle
        #  odd characters -> multiply by 2024
        if stone == 0:
            cache.add_edge(stone, 1, weight=1)
            queue.append(1)
        elif len(str(stone)) % 2 == 0:
            n = len(str(stone)) // 2
            a = int("".join(list(str(stone))[:n]))
            b = int("".join(list(str(stone))[n:]))
            if a == b:
                cache.add_edge(stone, a, weight=2)
            else:
                cache.add_edge(stone, a, weight=1)
                cache.add_edge(stone, b, weight=1)
            queue.append(a)
            queue.append(b)
        else:
            cache.add_edge(stone, stone * 2024, weight=1)
            queue.append(stone * 2024)
        blinked.append(stone)  # we've now transformed this stone
    return cache


@cache
def get_edges(cache, stone):
    result = []
    for e in cache.edges(stone, data=True):
        _, target, data = e
        result.append((target, data["weight"]))
    return result


def blink(cache, _stones, n):
    # now that we don't need to actually do transformations we can just keep
    # track of our current stones. The act of blinking is now, for each stone,
    # getting the edges in the graph. By using a dictionary of stone ids whose
    # value is the quantity in our hand, we can ensure the length of a given iteration
    # is at most the number of nodes in the graph.
    stones = {}
    for s in set(_stones):
        stones[s] = _stones.count(s)

    # if n is an integer, blink that many times and return
    # if n is a list of integers, blink the max number of times
    # and return a dictionary of blinks to number of stones
    if isinstance(n, int):
        num_blinks = n
        milestones = [n]

    if isinstance(n, list):
        num_blinks = max(n)
        milestones = n

    results = {}
    for i in range(num_blinks):
        updated = {}
        for s, n_duplicates in stones.items():
            for target, weight in get_edges(cache, s):
                if target in updated:
                    updated[target] += n_duplicates * weight
                else:
                    updated[target] = n_duplicates * weight
        stones = updated
        if i + 1 in milestones:
            results[i + 1] = sum(stones.values())

    return results


def main(input: str):
    stones = [int(s) for s in input.split()]
    cache = build_cache(stones)
    results = blink(cache, stones, [25, 75])
    print("Part 1:", results[25])
    print("Part 2:", results[75])


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
