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
    queue = deque([(numbers[0], 1)])
    N = len(numbers)
    while queue:
        value, idx = queue.pop()
        if value == result and idx == N:
            return True

        if value > result or idx == N:
            continue

        add_val = value + numbers[idx]
        queue.append((add_val, idx + 1))

        mult_val = value * numbers[idx]
        queue.append((mult_val, idx + 1))

        if allow_concat:
            concat_val = concat_numbers(value, numbers[idx])
            queue.append((concat_val, idx + 1))

    return False


def concat_numbers(a, b):
    # Concatenate two integers by computing the digit length of b
    # e.g., 12 and 345 => 12*1000 + 345 = 12345
    # This avoids costly str->int conversions
    return a * 10 ** len(str(b)) + b


def main(input):
    equations = parse(input)
    remaining = []
    total = 0
    for result, numbers in equations:
        if solve(result, numbers, False):
            total += result
        else:
            remaining.append((result, numbers))
    print("Part 1:", total)

    for result, numbers in remaining:
        if solve(result, numbers, True):
            total += result
    print("Part 2:", total)


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
