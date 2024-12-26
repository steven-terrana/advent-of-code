import re


def main(input: str):
    instructions: tuple[str] = re.findall(
        r"(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don\'t\(\))", input
    )

    part1 = 0
    part2 = 0
    enabled = True
    for i in instructions:
        if i[0] == "do()":
            enabled = True
        elif i[0] == "don't()":
            enabled = False
        else:
            part1 += int(i[1]) * int(i[2])
            if enabled:
                part2 += int(i[1]) * int(i[2])

    print("Part 1:", part1)
    print("Part 2:", part2)


if __name__ == "__main__":
    import cProfile
    import pstats
    import os
    import time
    from colorama import Fore, Style

    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        input = f.read()

    with cProfile.Profile() as pr:
        start_time = time.time()
        main(input)
        end_time = time.time()
        print(
            Fore.CYAN
            + f"execution time: {end_time - start_time:.3f} seconds"
            + Style.RESET_ALL
        )

        # Save the profile data to a file
        with open(f"{os.path.dirname(__file__)}/solution.prof", "w") as f:
            stats = pstats.Stats(pr, stream=f)
            stats.strip_dirs()
            stats.sort_stats("cumtime")
            stats.dump_stats(f"{os.path.dirname(__file__)}/solution.prof")
