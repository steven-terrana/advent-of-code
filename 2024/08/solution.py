from itertools import combinations


def parse(input: str):
    map = [list(line) for line in input.split("\n")]
    # create a dictionary of frequencies and their corresponding antenna locations
    antenna_locations = {}
    for r, row in enumerate(map):
        for c, char in enumerate(row):
            if char != ".":
                if char not in antenna_locations:
                    antenna_locations[char] = []
                antenna_locations[char].append((r, c))
    return antenna_locations, len(map), len(map[0])


def main(input: str):
    antenna_locations, R, C = parse(input)

    # antinodes can be found by:
    # 1. find every unique pair of antenna of the same frequency
    # 2. for each pair, calculate the slope of the line intersecting the two
    # 3. extrapolate the points on the line before and after the antenna
    antinodes = set()
    part1 = set()
    for frequency, locations in antenna_locations.items():
        for pair in combinations(locations, 2):
            # slope is delta row over delta column
            (a, b) = pair
            dr = b[0] - a[0]
            dc = b[1] - a[1]
            # antinode 1 is point a - slope until outside map
            i = 1
            while True:
                r = a[0] - i * dr
                c = a[1] - i * dc
                if not (0 <= r < R and 0 <= c < C):
                    break
                antinodes.add((r, c))
                if i == 1:
                    part1.add((r, c))
                i += 1
            # antinode 2 is point b + slope until outside map
            i = 1
            while True:
                r = b[0] + i * dr
                c = b[1] + i * dc
                if not (0 <= r < R and 0 <= c < C):
                    break
                antinodes.add((r, c))
                if i == 1:
                    part1.add((r, c))
                i += 1
    # if a given frequency has more than 1 antenna,
    # add all the antenna locations as antinodes
    for freq, loc in antenna_locations.items():
        if len(loc) > 1:
            antinodes.update(loc)

    print("Part 1:", len(part1))
    print("Part 2:", len(antinodes))


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
