import os
import re
from dataclasses import dataclass
import sympy


@dataclass
class Arcade:
    A_COST = 3
    B_COST = 1
    claw_machines: list

    @staticmethod
    def parse():
        with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
            input = file.read()

        claw_machines = []
        for c in input.split("\n\n"):
            claw_machines.append(ClawMachine.parse(c))

        return Arcade(claw_machines=claw_machines)


def is_integer(value, tolerance=1e-9):
    return abs(value - round(value)) < tolerance


class ClawMachine:
    def __init__(self, a, b, prize):
        self.a = a
        self.b = b
        self.prize = prize

    def solve(self):
        n_a, n_b = sympy.symbols("n_a n_b", integer=True)
        eq_x = sympy.Eq(n_a * self.a[0] + n_b * self.b[0], self.prize[0])
        eq_y = sympy.Eq(n_a * self.a[1] + n_b * self.b[1], self.prize[1])
        solution = sympy.solve((eq_x, eq_y), (n_a, n_b), domain=sympy.S.Integers)
        if solution:
            return solution[n_a] * Arcade.A_COST + solution[n_b] * Arcade.B_COST
        else:
            return None

    @staticmethod
    def parse(input):
        ax, bx = map(int, re.findall(r"X\+(\d+)", input))
        ay, by = map(int, re.findall(r"Y\+(\d+)", input))
        px, py = map(int, re.findall(r"=(\d+)", input))
        n = 0
        n = 10000000000000
        return ClawMachine(a=(ax, ay), b=(bx, by), prize=(px + n, py + n))


a = Arcade.parse()

total = 0
for i, c in enumerate(a.claw_machines):
    cost = c.solve()
    if cost:
        total += cost
print(total)
