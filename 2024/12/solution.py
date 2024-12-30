from collections import defaultdict


def parse(input: str):
    garden = [list(line) for line in input.split("\n")]

    neighbors = defaultdict(list)

    # create a graph and connect nodes to
    # their neighbors if they're the same plot type
    R = len(garden)
    C = len(garden[0])
    for r, row in enumerate(garden):
        for c, plot in enumerate(row):
            for nr, nc in [(r, c + 1), (r + 1, c)]:
                if 0 <= nr < R and 0 <= nc < C:
                    if garden[nr][nc] == plot:
                        neighbors[(r, c)].append((nr, nc))
                        neighbors[(nr, nc)].append((r, c))
    return R, C, neighbors


def find_regions(R, C, neighbors):
    regions = []
    seen = [False] * (R * C)
    for r in range(R):
        for c in range(C):
            if seen[r * C + c]:
                continue
            region = []
            queue = []
            queue.append(((r, c)))
            while queue:
                qr, qc = queue.pop()
                # if we've seen this, move on
                if seen[qr * C + qc]:
                    continue
                n = (qr, qc)
                region.append(n)
                # we've seen it now
                seen[qr * C + qc] = True
                for nr, nc in neighbors[n]:
                    if not seen[nr * C + nc]:
                        queue.append((nr, nc))
            regions.append(region)
    return regions


def sides(region):
    region_set = set(region)
    perimeter_graph = defaultdict(list)
    for r, c in region:
        up_left = (r, c)
        up_right = (r, c + 1)
        down_left = (r + 1, c)
        down_right = (r + 1, c + 1)
        # top is exposed
        if (r - 1, c) not in region_set:
            perimeter_graph[up_left].append(up_right)
            perimeter_graph[up_right].append(up_left)
        # bottom is exposed
        if (r + 1, c) not in region_set:
            perimeter_graph[down_left].append(down_right)
            perimeter_graph[down_right].append(down_left)
        # left is exposed
        if (r, c - 1) not in region_set:
            perimeter_graph[up_left].append(down_left)
            perimeter_graph[down_left].append(up_left)
        # right is exposed
        if (r, c + 1) not in region_set:
            perimeter_graph[up_right].append(down_right)
            perimeter_graph[down_right].append(up_right)

    sides = 0
    for node in perimeter_graph.keys():
        if len(perimeter_graph[node]) == 4:
            sides += 2
        else:
            (a, b) = list(perimeter_graph[node])
            ar, ac = a
            br, bc = b
            if ar != br and ac != bc:
                sides += 1

    return sides


def main(input: str):
    R, C, neighbors = parse(input)
    regions = find_regions(R, C, neighbors)

    part1 = 0
    part2 = 0
    for region in regions:
        a = len(region)
        p = sum(4 - len(neighbors[n]) for n in region)
        part1 += a * p
        part2 += a * sides(region)

    print("Part 1:", part1)
    assert part1 == 1473276
    print("Part 2:", part2)
    assert part2 == 901100


if __name__ == "__main__":
    import cProfile
    import pstats
    import os
    import time
    from colorama import Fore, Style
    import argparse

    # Create the parser
    parser = argparse.ArgumentParser()

    # Add a flag (boolean argument)
    parser.add_argument(
        "--profile",
        action="store_true",  # Makes the flag act as a boolean
        help="Enable cProfile",
    )

    args = parser.parse_args()

    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        input = f.read()

    if args.profile:
        with cProfile.Profile() as pr:
            start_time = time.time()
            main(input)
            end_time = time.time()

            # Save the profile data to a file
            with open(f"{os.path.dirname(__file__)}/solution.prof", "w") as f:
                stats = pstats.Stats(pr, stream=f)
                stats.strip_dirs()
                stats.sort_stats("cumtime")
                stats.dump_stats(f"{os.path.dirname(__file__)}/solution.prof")
    else:
        start_time = time.time()
        main(input)
        end_time = time.time()

    print(
        Fore.CYAN
        + f"execution time: {end_time - start_time:.5f} seconds"
        + Style.RESET_ALL
    )
