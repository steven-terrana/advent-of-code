from collections import deque


def parse(input):
    equations = []
    for line in input.split("\n"):
        result_str, nums_str = line.split(": ")
        result = int(result_str)
        nums = tuple(map(int, nums_str.split()))
        equations.append((result, nums))
    return equations


def solve(result, numbers, allow_concat):
    queue = deque()
    queue.append((numbers[0], 1))
    N = len(numbers)
    while queue:
        value, idx = queue.pop()

        if value == result and idx == N:
            return True

        if value > result or idx >= N:
            continue

        a = value + numbers[idx]
        queue.append((a, idx + 1))

        m = value * numbers[idx]
        queue.append((m, idx + 1))

        if allow_concat:
            m = 10 ** len(str(numbers[idx]))
            v = value * m + numbers[idx]
            queue.append((v, idx + 1))

    return False


def main(input):
    equations = parse(input)
    part1 = 0
    part2 = 0
    for result, numbers in equations:
        if solve(result, numbers, False):
            part1 += result
        elif solve(result, numbers, True):
            part2 += result

    print("Part 1:", part1)
    print("Part 2:", part1 + part2)


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
