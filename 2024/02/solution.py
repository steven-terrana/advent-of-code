def is_safe(report: list[int]) -> bool:
    is_ascending = True
    is_descending = True
    for i in range(len(report) - 1):
        # ensure report is either entirely ascending or
        # entirely descending
        if report[i] >= report[i + 1]:
            is_ascending = False
        if report[i] <= report[i + 1]:
            is_descending = False
        if not is_ascending and not is_descending:
            return False
        # ensure the gap between items is small enough
        if not -3 <= (report[i] - report[i + 1]) <= 3:
            return False
    return True


def part1(reports: list[list[int]]) -> int:
    return len([r for r in reports if is_safe(r)])


def part2(reports: list[list[int]]) -> int:
    safe = 0
    for report in reports:
        for idx in range(len(report)):
            newReport = report.copy()
            del newReport[idx]
            if is_safe(newReport):
                safe += 1
                break
    return safe


def main(input: str):
    reports: list[list[int]] = [
        [int(level) for level in report.split()] for report in input.split("\n")
    ]
    print("Part 1:", part1(reports))
    print("Part 2:", part2(reports))


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
