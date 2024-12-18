import os
from heapq import heappop, heappush


class MemorySpace:
    def __init__(self, rows, cols, falling_bits):
        self.rows = rows
        self.cols = cols
        self.falling_bits = falling_bits

    def manhattan(self, pos):
        return abs(pos[0] - self.rows) + abs(pos[1] - self.cols)

    def can_escape(self, nanosecond):
        corrupted = self.falling_bits[:nanosecond]
        # state is number of steps, guess at total steps required, and position tuple
        queue = []
        heappush(queue, (0, None, (0, 0)))
        visited = []
        while queue:
            steps, _, pos = heappop(queue)
            visited.append(pos)
            if pos == (self.rows, self.cols):
                return True
            for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nr = pos[0] + dr
                nc = pos[1] + dc
                if any(
                    [
                        nr < 0,
                        nr > self.rows,
                        nc < 0,
                        nc > self.cols,
                        (nr, nc) in visited,
                        (nr, nc) in corrupted,
                    ]
                ):
                    continue

                neighbor = (steps + 1, steps + 1 + self.manhattan((nr, nc)), (nr, nc))
                if not any(q[2] == neighbor[2] and q[1] <= neighbor[1] for q in queue):
                    heappush(queue, neighbor)
        return False


with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
    falling_bits = [tuple(map(int, line.split(","))) for line in f.read().split("\n")]

m = MemorySpace(70, 70, falling_bits)

# binary search to find first index where can_escape
# flips from true to false

low = 1024  # known from part 1 to have an escape route
high = len(falling_bits) - 1
result = None

while low <= high:
    mid = (low + high) // 2
    if m.can_escape(mid):
        # continue searching in the higher range
        low = mid + 1
    else:
        result = mid
        high = mid - 1

if result is not None:
    print(",".join(map(str, falling_bits[result - 1])))
else:
    print("can always escape")
