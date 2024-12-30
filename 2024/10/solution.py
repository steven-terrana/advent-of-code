# steps in the trail can be up/down/left/right
neighbors = [(0, 1), (0, -1), (1, 0), (-1, 0)]
trail_length = 9


def parse(input: str):
    # parse the map, support '.' for testing the examples
    trail_map = []
    for line in input.split("\n"):
        row = []
        for c in list(line):
            if c == ".":
                row.append(c)
            else:
                row.append(int(c))
        trail_map.append(row)
    return trail_map


def count_trails(trail_map, r, c):
    """
    Breadth First Search at a given coordinate to the summit
    assumes map[r][c] == 0
    """
    # avoid recalculating trail size
    R = len(trail_map)
    C = len(trail_map[0])
    # maintain a queue of potential trail paths to explore
    trails = [[(r, c)]]
    # maintain the discovered trails
    found = []
    # while there are still unexplored trails..
    while trails:
        # explore the trail
        t = trails.pop()
        # check each neighbor to see if its the next summit height
        for n in neighbors:
            tr = t[-1][0] + n[0]
            tc = t[-1][1] + n[1]
            # stay inside the map
            if 0 <= tr < R and 0 <= tc < C:
                # permissible steps are up 1 in elevation
                # which conveniently must be the length of the trail
                if trail_map[tr][tc] == len(t):
                    # step exists, so duplicate the trail
                    new_trail = t.copy()
                    new_trail.append((tr, tc))
                    if trail_map[tr][tc] == trail_length:
                        # if we're at the summit, record the path
                        found.append(new_trail)
                    else:
                        # if we're not at the summit, add this to the queue
                        trails.append(new_trail)
    return found


def main(input: str):
    trail_map = parse(input)
    part1 = 0
    part2 = 0
    for r in range(len(trail_map)):
        for c in range(len(trail_map[0])):
            if trail_map[r][c] == 0:
                found = count_trails(trail_map, r, c)
                part1 += len(set([p[-1] for p in found]))
                part2 += len(found)

    print("Part 1:", part1)
    print("Part 2:", part2)


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
        + f"execution time: {end_time - start_time:.3f} seconds"
        + Style.RESET_ALL
    )
