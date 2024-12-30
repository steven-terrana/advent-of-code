from heapq import heappush, heappop


class Node:
    def __init__(self, r, c, dr, dc, parent=None, score=0, heuristic=0):
        # parent
        self.parents = [parent] if parent is not None else []
        # current position
        self.r = r
        self.c = c
        self.dr = dr
        self.dc = dc
        # accrued score thus far
        self.score = score
        # estimate of total path length
        self.estimate = score + heuristic

    def path(self, all_paths=False):
        path = set([(self.r, self.c)])
        q = [self]
        while q:
            n = q.pop()
            path.add((n.r, n.c))
            if n.parents:
                if all_paths:
                    q.extend(n.parents)
                else:
                    q.append(n.parents[0])

        return path

    def __eq__(self, other):
        return (
            self.r == other.r
            and self.c == other.c
            and self.dr == other.dr
            and self.dc == other.dc
        )

    def __lt__(self, other):
        return self.estimate < other.estimate


class Maze:
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    TURN_COST = 1000

    def __init__(self, start, end, walls, R, C):
        self.start = start
        self.end = end
        self.walls = walls
        self.R = R
        self.C = C
        self.dr = 0
        self.dc = 1

    def heuristic(self, r, c, dr, dc):
        """go from current position to end assuming no walls in between"""
        manhattan = abs(r - self.end[0]) + abs(c - self.end[1])
        return manhattan

    def print(self, node):
        path = node.path()
        for r in range(self.R + 1):
            row = []
            for c in range(self.C + 1):
                if self.walls[r][c]:
                    row.append(Fore.BLUE + "#" + Style.RESET_ALL)
                elif (r, c) in path:
                    row.append(Fore.RED + "*" + Style.RESET_ALL)
                else:
                    row.append(Fore.LIGHTBLACK_EX + "." + Style.RESET_ALL)
            print("".join(row))

    def solve(self):
        queue = []
        start_node = Node(r=self.start[0], c=self.start[1], dr=self.dr, dc=self.dc)
        heappush(queue, start_node)

        # minor optimization: avoid attribute and list lookups
        end_r = self.end[0]
        end_c = self.end[1]
        walls = self.walls
        R = self.R
        C = self.C

        # position and direction matter
        visited = {}
        while queue:
            # take a step
            n = heappop(queue)

            # if we've been here with a better score, move on
            state = (n.r, n.c, n.dr, n.dc)
            if state in visited:
                if visited[state].score < n.score:
                    continue

            visited[state] = n

            # check if goal is reached
            if n.r == end_r and n.c == end_c:
                return n
            # if goal not reached, find valid neighbors
            r, c = n.r, n.c
            for neighbor in [(r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)]:
                nr, nc = neighbor
                if self.walls[nr * C + nc]:
                    continue

                n_dr = nr - n.r
                n_dc = nc - n.c
                score = n.score + 1
                if not (n.dr == n_dr and n.dc == n_dc):
                    score += Maze.TURN_COST

                neighbor_node = Node(
                    parent=n,
                    r=nr,
                    c=nc,
                    dr=n_dr,
                    dc=n_dc,
                    score=score,
                    heuristic=self.heuristic(nr, nc, n_dr, n_dc),
                )

                neighbor_state = (nr, nc, n_dr, n_dc)

                if neighbor_state in visited:
                    v = visited[neighbor_state]
                    if neighbor_node.score == v.score:
                        v.parents.append(n)
                        continue

                heappush(queue, neighbor_node)
        raise Exception("no solution found")

    @staticmethod
    def parse(input: str):
        grid = [list(line) for line in input.split("\n")]

        R = len(grid)
        C = len(grid[0])
        walls = [False for _ in range(R * C)]
        for r, row in enumerate(grid):
            for c, char in enumerate(row):
                if char == "S":
                    start = (r, c)
                if char == "E":
                    end = (r, c)
                if char == "#":
                    walls[r * C + c] = True
        return Maze(start, end, walls, R, C)


def main(input: str):
    m = Maze.parse(input)
    n = m.solve()
    print("Part 1:", len(n.path()))
    print("Part 2:", len(n.path(True)))


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
