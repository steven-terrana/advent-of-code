from heapq import heappop, heappush


class MemorySpace:
    def __init__(self, rows, cols):
        self.rows = rows
        self.cols = cols

    def manhattan(self, pos):
        return abs(pos[0] - self.rows) + abs(pos[1] - self.cols)

    def escape(self, corrupted):
        # state is number of steps, guess at total steps required, and position tuple
        queue = []
        heappush(queue, (0, None, (0, 0)))
        dist = {}
        dist[(0, 0)] = 0
        while queue:
            steps, _, pos = heappop(queue)

            # if this is outdated, skip
            if dist.get(pos, float("inf")) < steps:
                continue

            # if we've reached the goal
            if pos == (self.rows, self.cols):
                return steps

            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nr = pos[0] + dr
                nc = pos[1] + dc
                if any(
                    [
                        nr < 0,
                        nr > self.rows,
                        nc < 0,
                        nc > self.cols,
                        (nr, nc) in corrupted,
                    ]
                ):
                    continue

                new_cost = steps + 1
                if new_cost < dist.get((nr, nc), float("inf")):
                    dist[(nr, nc)] = new_cost
                    estimate = new_cost + self.manhattan((nr, nc))
                    heappush(queue, (new_cost, estimate, (nr, nc)))


def main(input: str):
    falling_bits = [
        tuple(int(n) for n in line.split(",")) for line in input.splitlines()
    ]

    m = MemorySpace(70, 70)
    part1 = m.escape(set(falling_bits[:1024]))
    print("Part 1:", part1)

    # binary search to find first index where can_escape
    # flips from true to false

    low = 1024  # known from part 1 to have an escape route
    high = len(falling_bits) - 1
    result = None

    while low <= high:
        mid = (low + high) // 2
        if m.escape(set(falling_bits[:mid])):
            # continue searching in the higher range
            low = mid + 1
        else:
            result = mid
            high = mid - 1

    if result is not None:
        part2 = ",".join(str(n) for n in falling_bits[result - 1])
        print("Part 2:", part2)
    else:
        print("can always escape")


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
