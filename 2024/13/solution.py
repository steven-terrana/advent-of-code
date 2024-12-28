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
    """determines if a given float is.. basically.. an integer"""
    return abs(value - round(value)) < tolerance


class ClawMachine:
    def __init__(self, a, b, prize):
        self.a = a
        self.b = b
        self.prize = prize

    def move_prize(self, n):
        self.prize = (self.prize[0] + n, self.prize[1] + n)

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
        return ClawMachine(a=(ax, ay), b=(bx, by), prize=(px, py))


def main(input: str):
    a = Arcade.parse()

    part1 = 0
    part2 = 0
    for claw_machine in a.claw_machines:
        cost = claw_machine.solve()
        if cost:
            part1 += cost

        claw_machine.move_prize(10000000000000)
        cost = claw_machine.solve()
        if cost:
            part2 += cost

    print("Part 1:", part1)
    print("Part 2:", part2)


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
