from heapq import heappush, heappop
from colorama import Fore, Style


class Maze:
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    def __init__(self, start, end, grid):
        self.start = start
        self.end = end
        self.grid = grid

    def print(self, node):
        path = node.path()
        R = max([w[0] for w in self.walls])
        C = max([w[1] for w in self.walls])
        for r in range(R + 1):
            row = []
            for c in range(C + 1):
                if (r, c) == self.start:
                    row.append(Fore.CYAN + "S" + Style.RESET_ALL)
                elif (r, c) == self.end:
                    row.append(Fore.CYAN + "E" + Style.RESET_ALL)
                elif self.grid[r][c] == "#":
                    row.append(Fore.LIGHTBLACK_EX + "#" + Style.RESET_ALL)
                elif (r, c) in path:
                    row.append(Fore.RED + "*" + Style.RESET_ALL)
                else:
                    row.append(Fore.LIGHTBLACK_EX + "." + Style.RESET_ALL)
            print("".join(row))

    def solve(self):
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
        path = [self.start]
        pos = self.start
        while pos != self.end:
            for dr, dc in directions:
                r, c = (pos[0] + dr, pos[1] + dc)
                if (r, c) not in path and self.grid[r][c] != "#":
                    pos = (r, c)
                    path.append(pos)
                    break

        cheats = {}
        for a, pos in enumerate(path):
            r, c = pos
            directions = [
                (r, c + 2),
                (r, c - 2),
                (r + 2, c),
                (r - 2, c),
                (r + 1, c + 1),
                (r - 1, c + 1),
                (r - 1, c - 1),
                (r - 1, c + 1),
            ]
            for d in [d for d in directions if d in path]:
                b = path.index(d)
                time_saved = b - a - 2
                if time_saved <= 0:
                    continue
                if time_saved not in cheats:
                    cheats[time_saved] = 0
                cheats[time_saved] += 1

        return cheats

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


m = Maze.parse()

cheats = m.solve()

times = list(cheats.keys())
times.sort()

how_many = 0
for t in times:
    # print(f"there are {cheats[t]} that save {t} picoseconds")
    if t >= 100:
        how_many += cheats[t]

print(how_many)
