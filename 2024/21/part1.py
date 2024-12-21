import os
import re
import networkx as nx
import itertools


def graph_from_grid(grid):
    directions = {"^": (-1, 0), "v": (1, 0), "<": (0, -1), ">": (0, 1)}
    g = nx.MultiDiGraph()
    for r, row in enumerate(grid):
        for c, button in enumerate(row):
            if button is None:
                continue
            for sym, dir in directions.items():
                dr, dc = dir
                nr, nc = r + dr, c + dc
                if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
                    if grid[nr][nc] is not None:
                        g.add_edge(button, grid[nr][nc], key=0, value=sym)
    return g


class Keypad:
    def __init__(self, grid):
        self.graph = graph_from_grid(grid)
        self.pos = "A"

    def press(self, code):
        sequences = []
        buttons = [self.pos] + list(code)
        for i in range(len(buttons) - 1):
            paths = list(nx.all_shortest_paths(self.graph, buttons[i], buttons[i + 1]))
            next_set = []
            for path in paths:
                next_set.append(
                    (
                        "".join(
                            [
                                self.graph[a][b][0]["value"]
                                for a, b in [
                                    (path[i], path[i + 1]) for i in range(len(path) - 1)
                                ]
                            ]
                        )
                        + "A"
                    )
                )
            sequences.append(next_set)
        self.pos = buttons[-1]
        return ["".join(c) for c in itertools.product(*sequences)]

    @staticmethod
    def numeric():
        return Keypad(
            [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"], [None, "0", "A"]]
        )

    @staticmethod
    def directional():
        return Keypad([[None, "^", "A"], ["<", "v", ">"]])


def code_to_value(code: str):
    return int(re.findall(r"\d+", code)[0])


def main():
    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        codes = f.read().split("\n")

    total = 0
    for code in codes:
        shortest = float("inf")
        n1 = Keypad.numeric()
        for i in n1.press(code):
            d1 = Keypad.directional()
            for j in d1.press(i):
                d2 = Keypad.directional()
                shortest = min(shortest, *list(map(len, d2.press(j))))
        total += shortest * code_to_value(code)
    print(total)


if __name__ == "__main__":
    import cProfile
    import pstats

    with cProfile.Profile() as pr:
        main()

        # Save the profile data to a file
        with open("output.prof", "w") as f:
            stats = pstats.Stats(pr, stream=f)
            stats.strip_dirs()
            stats.sort_stats("cumtime")
            stats.dump_stats("output.prof")
