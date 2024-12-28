import networkx as nx
import matplotlib.pyplot as plt


def parse(input: str):
    grid = [list(line) for line in input.split("\n")]
    garden = nx.Graph()

    # create a graph and connect nodes to
    # their neighbors if they're the same plot type
    for r, row in enumerate(grid):
        for c, plot in enumerate(row):
            garden.add_node((r, c), type=plot)
            for nr, nc in [(r, c + 1), (r + 1, c)]:
                if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
                    if grid[nr][nc] == plot:
                        garden.add_edge((r, c), (nr, nc))
    return garden


def area(region):
    """region area is equal to number of nodes"""
    return len(region)


def perimeter(garden, region):
    """
    for each node, the sides exposed to the outside are:
        4 - the number of neighbors
    the total perimeter is the sum of these exposed sides
    """
    return sum([4 - len(list(garden.neighbors(n))) for n in list(region)])


def sides(region):
    # "explodes" a grid coordinate into its
    # 4 corners. based on which sides of the
    # plot don't have neighbors, add those corner
    # coordinates to the perimeter graph
    p = nx.Graph()
    for r, c in region:
        up_left = (r, c)
        up_right = (r, c + 1)
        down_left = (r + 1, c)
        down_right = (r + 1, c + 1)
        # top is exposed
        if (r - 1, c) not in region:
            p.add_edge(up_left, up_right)
        # bottom is exposed
        if (r + 1, c) not in region:
            p.add_edge(down_left, down_right)
        # left is exposed
        if (r, c - 1) not in region:
            p.add_edge(up_left, down_left)
        # right is exposed
        if (r, c + 1) not in region:
            p.add_edge(up_right, down_right)

    # for this geometry, the number of side is
    # equal to the number of columns
    sides = 0
    for n in p.nodes():
        neighbors = p.neighbors(n)
        if len(list(neighbors)) == 4:
            sides += 2
        else:
            # a node is a corner if its neighbors
            # do not share either a row or column coordinate
            (a, b) = p.neighbors(n)
            ar, ac = a
            br, bc = b
            if ar != br and ac != bc:
                sides += 1

    ## uncomment if you want to see each region perimeter plotted
    # pos = {node: (node[1], -node[0]) for node in p.nodes()}
    # nx.draw(p, pos, with_labels=True)
    # plt.show()
    return sides


def main(input: str):
    garden = parse(input)
    regions = nx.connected_components(garden)

    part1 = 0
    part2 = 0

    for region in regions:
        a = area(region)
        part1 += a * perimeter(garden, region)
        part2 += a * sides(region)

    print("Part 1:", part1)
    print("Part 2:", part2)


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
