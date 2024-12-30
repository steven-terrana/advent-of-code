import matplotlib.pyplot as plt


class Vector:
    def __init__(self, pr, pc, vc, vr):
        self.pc = pc
        self.pr = pr
        self.vr = vr
        self.vc = vc

    def pos_at(self, t):
        return (self.pc + self.vr * t, self.pr + self.vc * t)

    @staticmethod
    def parse(line):
        import re

        n = map(int, re.findall(r"-?\d+", line))
        return Vector(*n)


class Grid:
    def __init__(self, width, length):
        self.w = width
        self.l = length

    def score(self, vectors, t):
        g = [[0 for _ in range(self.w)] for _ in range(self.l)]

        for r, c in iter(v.pos_at(t) for v in vectors):
            g[r % self.l][c % self.w] += 1

        top = g[: self.l // 2]
        bottom = g[self.l // 2 + 1 :]
        q1 = [row[: self.w // 2] for row in top]
        q2 = [row[self.w // 2 + 1 :] for row in top]
        q3 = [row[: self.w // 2] for row in bottom]
        q4 = [row[self.w // 2 + 1 :] for row in bottom]

        score = 1
        for q in [q1, q2, q3, q4]:
            score = score * sum([sum(row) for row in q])
        return score

    def display(self, vectors, t):
        pos = [v.pos_at(t) for v in vectors]
        g = [[0 for _ in range(self.w)] for _ in range(self.l)]

        for r, c in pos:
            g[r % self.l][c % self.w] += 1

        return g


def spatial_autocorrelation(grid):
    """quantifies how similar pixels are to each other"""
    rows, cols = len(grid), len(grid[0])
    matches = 0
    total_neighbors = 0
    for i in range(rows):
        for j in range(cols):
            if i > 0:  # Compare with top neighbor
                matches += grid[i][j] == grid[i - 1][j]
                total_neighbors += 1
            if j > 0:  # Compare with left neighbor
                matches += grid[i][j] == grid[i][j - 1]
                total_neighbors += 1
    return matches / total_neighbors if total_neighbors > 0 else 0


def main(input: str):
    vectors = [Vector.parse(line) for line in input.splitlines()]
    g = Grid(101, 103)
    print("Part 1:", g.score(vectors, 100))

    # we solved part 2 first through visual inspection...
    # there were odd amounts of organization to the pixels at
    # t = 57 160 263.  so inspecting img(t) = 57 + 103 * t
    # resulted in the answer pretty quickly.
    #
    # for an automated solution, we can assume that an organized
    # picture will have a higher degree of spatial autocorrelation
    # than the static noise in most frames. so to automate finding
    # the right time, calculate the correlation over the first 10K
    # seconds and print the index of the most correlated picture
    t = 0
    part2 = None
    max_correlation = 0
    # chose 6000 to 7000 after the fact.
    # running this from 0 to 100000 works too if you wanted
    # to assume nothing, just takes longer (around 2 seconds)
    for t in range(6750, 6760):
        img = g.display(vectors, t)
        correlation = spatial_autocorrelation(img)
        if correlation > max_correlation:
            part2 = t
            max_correlation = correlation

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
