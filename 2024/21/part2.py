import os
import re
import networkx as nx
from functools import cache


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

    def move(self, b):
        paths = list(nx.all_shortest_paths(self.graph, self.pos, b))
        sequences = []
        for p in paths:
            sequence = ""
            prev = p[0]
            for i in range(1, len(p)):
                sequence += self.graph[prev][p[i]][0]["value"]
                prev = p[i]
            sequence += "A"
            sequences.append(sequence)
        self.pos = b
        return sequences

    def press(self, code):
        sequences = []
        for c in list(code):
            sequences.append(self.move(c))
        return sequences

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


directional = Keypad.directional()


@cache
def min_cost(seq, depth):
    if depth == 0:
        return len(seq)

    sequence = directional.press(seq)
    cost = 0
    for part in sequence:
        cost += min([min_cost(option, depth - 1) for option in part])

    return cost


def main():
    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        codes = f.read().split("\n")

    total = 0
    for code in codes:
        keypad = Keypad.numeric()
        sequence = keypad.press(code)

        cost = 0
        for part in sequence:
            cost += min([min_cost(option, 25) for option in part])

        total += cost * code_to_value(code)

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
