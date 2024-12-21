from heapq import heappush, heappop
from colorama import Fore, Style


class Maze:
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    def __init__(self, start, end, grid):
        self.start = start
        self.end = end
        self.grid = grid
        self.R = len(grid)
        self.C = len(grid[0])

    def neighbors(self, pos, manhattan):
        """returns a set of neighboring points within a given manhattan distance away"""
        neighbors = []
        for dr in range(-manhattan, manhattan + 1):
            remaining = manhattan - abs(dr)
            for dc in range(-remaining, remaining + 1):
                if dr == 0 and dc == 0:
                    continue
                r, c = pos[0] + dr, pos[1] + dc
                if 0 <= r < self.R and 0 <= c < self.C:
                    if self.grid[r][c] == "#":
                        continue
                    neighbors.append((pos[0] + dr, pos[1] + dc))
        return neighbors

    def solve(self, cheat_duration, min_savings):
        """
        without cheating the maze has a single solution that uses every point
        in the grid. Let's represent that path as a list.

        then, we can walk along the path and check for grid positions 2 away
        that are also on the path.

        Given the solution without cheating is a list, a positions
        index in the list is also how long it takes to get there.

        Since there is only one solution, we're looking for all instances
        where two nodes indices are more than 100 spots apart
        """
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        path = {}
        time = 0
        path[self.start] = time
        pos = self.start
        while pos != self.end:
            for dr, dc in directions:
                r, c = (pos[0] + dr, pos[1] + dc)
                if (r, c) not in path and self.grid[r][c] != "#":
                    pos = (r, c)
                    time += 1
                    path[pos] = time
                    break

        total = 0
        for i, a in enumerate(path):
            for b in self.neighbors(a, cheat_duration):
                manhattan = abs(a[0] - b[0]) + abs(a[1] - b[1])
                time_saved = path[b] - i - manhattan
                if time_saved >= min_savings:
                    total += 1

        return total

    @staticmethod
    def parse():
        import os

        with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
            grid = [list(line) for line in file.read().split("\n")]

        start, end = None, None
        for r, row in enumerate(grid):
            if "S" in row:
                c = row.index("S")
                start = (r, c)
                grid[r][c] = "."
            if "E" in row:
                c = row.index("E")
                end = (r, c)
                grid[r][c] = "."

            if None not in [start, end]:
                break

        return Maze(start, end, grid)


if __name__ == "__main__":
    import cProfile
    import pstats

    m = Maze.parse()
    with cProfile.Profile() as pr:
        print(m.solve(cheat_duration=20, min_savings=100))

    # Save the profile data to a file
    with open("output.prof", "w") as f:
        stats = pstats.Stats(pr, stream=f)
        stats.strip_dirs()
        stats.sort_stats("cumtime")
        stats.dump_stats("output.prof")
