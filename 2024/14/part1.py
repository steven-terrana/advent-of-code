import os


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
        pos = [v.pos_at(t) for v in vectors]
        g = [[0 for _ in range(self.w)] for _ in range(self.l)]

        for r, c in pos:
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


with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    vectors = [Vector.parse(line) for line in file.read().split("\n")]

g = Grid(101, 103)
print(g.score(vectors, 100))
