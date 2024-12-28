from collections import defaultdict
from rich.console import Console
from bisect import bisect_left, bisect_right, insort_left


class Guard:
    def __init__(self, r, c):
        # initial guard row, column
        self.ri = r
        self.ci = c
        self.di = "N"
        # current guard row, column
        self.r = r
        self.c = c
        # number of turns the guard has made
        self.d = "N"

        self.cache = {}

    def reset(self):
        self.r = self.ri
        self.c = self.ci
        self.d = self.di

    def get_next_position(self, lab):
        r, c, d = self.r, self.c, self.d

        if d == "N":
            obstacles = lab.o_by_col[c]
            idx = bisect_left(obstacles, r)
            if idx == 0:
                result = ((0, c, "N"), True)
            else:
                row = obstacles[idx - 1] + 1
                result = ((row, c, "E"), False)
        if d == "E":
            obstacles = lab.o_by_row[r]
            idx = bisect_right(obstacles, c)
            if idx == len(obstacles):
                result = ((r, lab.C - 1, "E"), True)
            else:
                col = obstacles[idx] - 1
                result = ((r, col, "S"), False)
        if d == "S":
            obstacles = lab.o_by_col[c]
            idx = bisect_right(obstacles, r)
            if idx == len(obstacles):
                result = ((lab.R - 1, c, "S"), True)
            else:
                row = obstacles[idx] - 1
                result = ((row, c, "W"), False)
        if d == "W":
            obstacles = lab.o_by_row[r]
            idx = bisect_left(obstacles, c)
            if idx == 0:
                result = ((r, 0, "W"), True)
            else:
                col = obstacles[idx - 1] + 1
                result = ((r, col, "N"), False)

        return result

    def stroll(self, lab):
        """
        guard strolls until exiting the lab or
        realizing we're stuck in a loop. returns
        the path and a boolean (true = exited, false = loop)
        """
        path = [(self.r, self.c, self.d)]
        visited = set()
        while True:
            pos, exited = self.get_next_position(lab)
            # add the new position to the path
            path.append(pos)
            # we're in a loop
            if pos in visited:
                return (path, False)
            # we exited the lab
            if exited:
                return (path, True)
            # update where we've been
            visited.add(pos)
            # update our position
            self.r, self.c, self.d = pos


class Lab:
    def __init__(self, R, C, obstacles):
        self.R = R
        self.C = C
        self.obstacles = obstacles
        self.o_by_row = defaultdict(list)
        self.o_by_col = defaultdict(list)
        for r, c in obstacles:
            self.o_by_row[r].append(c)
            self.o_by_col[c].append(r)
        for row in self.o_by_row:
            self.o_by_row[row].sort()
        for col in self.o_by_col:
            self.o_by_col[col].sort()

    def add_obstacle(self, r, c):
        self.obstacles.add((r, c))
        insort_left(self.o_by_row[r], c)
        insort_left(self.o_by_col[c], r)

    def remove_obstacle(self, r, c):
        self.obstacles.remove((r, c))
        self.o_by_row[r].remove(c)
        self.o_by_col[c].remove(r)

    def print(self, guard, path, highlight=None):
        console = Console()
        for r in range(self.R):
            row = ""
            for c in range(self.C):
                if (r, c) == highlight:
                    row += "[bold magenta]O[/bold magenta]"
                elif (r, c) == (guard.ri, guard.ci):
                    row += "[bold blue]^[/bold blue]"
                elif (r, c) in self.obstacles:
                    row += "[bold red]#[/bold red]"
                elif (r, c) in path:
                    row += "[bold green]*[/bold green]"
                else:
                    row += "[dim].[/dim]"
            console.print(row)


def expand(path):
    r, c, d = path[0]
    steps = [(r, c, d)]
    for p in path[1:]:
        nr, nc, nd = p
        if d == "N":
            steps.extend((i, c, "N") for i in range(r, nr - 1, -1))
        if d == "E":
            steps.extend((r, i, "E") for i in range(c, nc + 1))
        if d == "S":
            steps.extend((i, c, "S") for i in range(r, nr + 1))
        if d == "W":
            steps.extend((r, i, "W") for i in range(c, nc - 1, -1))
        r, c, d = nr, nc, nd
    return steps


def parse(input: str):
    grid = [list(line) for line in input.split("\n")]
    R = len(grid)
    C = len(grid[0])
    obstacles = set()
    guard = None
    for r in range(R):
        for c in range(C):
            if grid[r][c] == "^":
                guard = Guard(r, c)
            if grid[r][c] == "#":
                obstacles.add((r, c))
    return Lab(R, C, obstacles), guard


def main(input: str):
    lab, guard = parse(input)
    # get all the turning points
    path, exited = guard.stroll(lab)
    steps = expand(path)
    print("Part 1:", len(set([(s[0], s[1]) for s in steps])))
    # lab.print(guard, steps)

    part2 = 0
    visited = set()  # avoid testing same spot twice
    for i, step in enumerate(steps[1:]):
        r, c, d = step
        if (r, c) in visited:
            continue
        lab.add_obstacle(r, c)
        guard.r, guard.c, guard.d = steps[i - 1]
        _, exited = guard.stroll(lab)
        if not exited:
            part2 += 1
        lab.remove_obstacle(r, c)
        visited.add((r, c))

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
