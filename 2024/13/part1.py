import os
import re
import math
from dataclasses import dataclass
import numpy as np


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
        # Define the matrix A and vector P
        A = np.array(
            [[self.a[0], self.b[0]], [self.a[1], self.b[1]]]
        )  # Coefficient matrix
        P = np.array([self.prize[0], self.prize[1]])  # Right-hand side vector

        # Check if the determinant of A is non-zero (i.e., the system is solvable)
        if np.linalg.det(A) != 0:
            # Solve the system of equations
            solution = np.linalg.solve(A, P)
            n_a, n_b = solution
            if is_integer(n_a) and is_integer(n_b):
                return round(n_a) * Arcade.A_COST + round(n_b) * Arcade.B_COST
            else:
                return None
        else:
            print("no solution")
            return None

    @staticmethod
    def parse(input):
        ax, bx = map(int, re.findall(r"X\+(\d+)", input))
        ay, by = map(int, re.findall(r"Y\+(\d+)", input))
        px, py = map(int, re.findall(r"=(\d+)", input))
        return ClawMachine(a=(ax, ay), b=(bx, by), prize=(px, py))


a = Arcade.parse()

total = 0
for i, c in enumerate(a.claw_machines):
    cost = c.solve()
    if cost:
        total += cost
print(total)
