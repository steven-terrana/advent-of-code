# cardinal directional vectors sequenced clockwise
directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]


class Guard:
    def __init__(self, r, c):
        self.ri = r
        self.r = r
        self.ci = c
        self.c = c
        self.turns = 0

    def reset(self):
        self.r = self.ri
        self.c = self.ci
        self.turns = 0

    def to_state(self):
        return [directions[self.turns % 4], self.r, self.c]

    def stroll(self, lab):
        # state tuple now includes direction in addition to position
        visited = set([(directions[0], self.r, self.c)])
        while True:
            next_r = self.r + directions[self.turns % 4][0]
            next_c = self.c + directions[self.turns % 4][1]
            if not (0 <= next_r < lab.R and 0 <= next_c < lab.C):
                # exited without revisiting a state
                return (False, visited)

            if (next_r, next_c) in lab.obstacles:
                self.turns += 1
            else:
                self.r = next_r
                self.c = next_c

            state = (directions[self.turns % 4], self.r, self.c)
            if state in visited:
                # revisited a state
                return (True, visited)
            else:
                visited.add(state)


class Lab:
    def __init__(self, R, C, obstacles):
        self.R = R
        self.C = C
        self.obstacles = obstacles

    def print(self, path):
        for r in range(self.R):
            row = []
            for c in range(self.C):
                if (r, c) in path:
                    row.append("X")
                elif (r, c) in self.obstacles:
                    row.append("#")
                else:
                    row.append(".")
            print("".join(row))


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
    _, path = guard.stroll(lab)
    guard.reset()
    print("Part 1:", len(path))

    # exclude initial position and disregard direction
    potential = set([(p[1], p[2]) for p in list(path)[1:]])

    count = 0
    for point in potential:
        lab.obstacles.add(point)
        if guard.stroll(lab)[0]:
            count += 1
        lab.obstacles.remove(point)
        guard.reset()

    print("Part 2:", count)


if __name__ == "__main__":
    import cProfile
    import pstats
    import os
    import time
    from colorama import Fore

    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        input = f.read()

    with cProfile.Profile() as pr:
        start_time = time.time()
        main(input)
        end_time = time.time()
        print(Fore.CYAN + f"execution time: {end_time - start_time:.3f} seconds")

        # Save the profile data to a file
        with open(f"{os.path.dirname(__file__)}/solution.prof", "w") as f:
            stats = pstats.Stats(pr, stream=f)
            stats.strip_dirs()
            stats.sort_stats("cumtime")
            stats.dump_stats(f"{os.path.dirname(__file__)}/solution.prof")
