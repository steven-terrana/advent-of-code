def p1_search(grid: list[list[str]], r: int, c: int) -> int:
    """given a location, check for XMAS"""
    # TODO: optimize all of this
    # 1. we could end a search early if a letter doesnt match the expected
    #    instead of waiting to build up the entire word
    # 2. we search the same string forwards and backwards - we could instead
    #    look down, right, down-right and check for XMAS or SAMX
    directions = [
        (0, 1),  # right
        (0, -1),  # left
        (1, 0),  # down
        (-1, 0),  # up
        (1, 1),  # down right
        (1, -1),  # down left
        (-1, -1),  # up left
        (-1, 1),  # up right
    ]

    count = 0
    for d in directions:
        word = []
        for i in range(len("XMAS")):
            R = r + i * d[0]
            C = c + i * d[1]
            if 0 <= R < len(grid) and 0 <= C < len(grid[0]):
                word.append(grid[R][C])
        if word == ["X", "M", "A", "S"]:
            count += 1
    return count


def p2_search(grid: list[list[str]], r: int, c: int) -> bool:
    return all(
        [
            r - 1 < 0,
            c - 1 < 0,
            r + 1 > len(grid) - 1,
            c + 1 > len(grid[0]) - 1,
        ]
    ) and any(
        [
            # M S
            #  A
            # M S
            all(
                [
                    grid[r - 1][c - 1] == "M",
                    grid[r - 1][c + 1] == "S",
                    grid[r + 1][c - 1] == "M",
                    grid[r + 1][c + 1] == "S",
                ]
            ),
            # M M
            #  A
            # S S
            all(
                [
                    grid[r - 1][c - 1] == "M",
                    grid[r - 1][c + 1] == "M",
                    grid[r + 1][c - 1] == "S",
                    grid[r + 1][c + 1] == "S",
                ]
            ),
            # S M
            #  A
            # S M
            all(
                [
                    grid[r - 1][c - 1] == "S",
                    grid[r - 1][c + 1] == "M",
                    grid[r + 1][c - 1] == "S",
                    grid[r + 1][c + 1] == "M",
                ]
            ),
            # S S
            #  A
            # M M
            all(
                [
                    grid[r - 1][c - 1] == "S",
                    grid[r - 1][c + 1] == "S",
                    grid[r + 1][c - 1] == "M",
                    grid[r + 1][c + 1] == "M",
                ]
            ),
        ]
    )


def main(input: str):
    grid: list[list[str]] = [list(line) for line in input]

    part1 = 0
    part2 = 0

    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == "X":
                part1 += p1_search(grid, r, c)
            if grid[r][c] == "A":
                if p2_search(grid, r, c):
                    part2 += 1

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
