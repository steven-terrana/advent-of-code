def part1(g1, g2):
    g1 = sorted(g1)
    g2 = sorted(g2)
    sum = 0
    for n in range(len(g1)):
        sum = sum + abs(g1[n] - g2[n])
    return sum


def part2(g1: list[int], g2: list[int]) -> int:
    sum = 0
    for n in set(g1):
        sum = sum + n * g1.count(n) * g2.count(n)
    return sum


def main(input: str):
    (g1, g2) = zip(*[[int(n) for n in line.split()] for line in input.split("\n")])
    print("Part 1:", part1(g1, g2))
    print("Part 2:", part2(g1, g2))


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
