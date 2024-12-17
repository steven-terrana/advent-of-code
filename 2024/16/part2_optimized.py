from heapq import heappush, heappop
import math
from colorama import Fore, Style


class Node:
    def __init__(self, path, pos, dir, score=0, heuristic=0):
        # parent
        self.path = path
        # current position
        self.pos = pos
        self.dir = dir
        # accrued score thus far
        self.score = score

    def __eq__(self, other):
        return self.pos == other.pos and self.dir == other.dir


class Maze:
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    TURN_COST = 1000

    def __init__(self, start, end, walls):
        self.start = start
        self.end = end
        self.walls = walls
        self.direction = (0, 1)

    def print_seats(self, seats):
        R = max([w[0] for w in self.walls])
        C = max([w[1] for w in self.walls])
        for r in range(R + 1):
            row = []
            for c in range(C + 1):
                if (r, c) in self.walls:
                    row.append(Fore.BLUE + "#" + Style.RESET_ALL)
                elif (r, c) in seats:
                    row.append(Fore.RED + "O" + Style.RESET_ALL)
                else:
                    row.append(Fore.LIGHTBLACK_EX + "." + Style.RESET_ALL)
            print("".join(row))

    def solve(self):
        start_node = Node([], self.start, self.direction, 0)
        queue = [start_node]

        current_best = math.inf
        best = []
        while queue:
            # take a step
            n = queue.pop()
            if n.score > current_best:
                continue
            # check if goal is reached
            if n.pos == self.end:
                if n.score < current_best:
                    current_best = n.score
                    best = [n]
                elif n.score == current_best:
                    best.append(n)
            # if goal not reached, find valid neighbors
            r, c = n.pos
            for neighbor in [(r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)]:
                # for each valid neighbor, add them to the queue if the
                if neighbor in self.walls or neighbor in n.path:
                    continue

                new_dir = (neighbor[0] - n.pos[0], neighbor[1] - n.pos[1])
                score = n.score + 1
                if new_dir != n.dir:
                    score += Maze.TURN_COST
                neighbor_node = Node(n.path + [n.pos], neighbor, new_dir, score)
                # if node hasn't been visited before and if there isn't already
                # a node in the queue with a lower score, add it to the queue
                if neighbor_node.score <= current_best:
                    queue.append(neighbor_node)
        return best

    @staticmethod
    def parse():
        import os

        with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
            input = [list(line) for line in file.read().split("\n")]

        walls = []
        for r, row in enumerate(input):
            for c, char in enumerate(row):
                if char == "S":
                    start = (r, c)
                if char == "E":
                    end = (r, c)
                if char == "#":
                    walls.append((r, c))
        return Maze(start, end, walls)


m = Maze.parse()
best = m.solve()

seats = set()
paths = [n.path for n in best]
for path in paths:
    for node in path:
        seats.add(node)

m.print_seats(seats)

print(len(seats) + 1)
