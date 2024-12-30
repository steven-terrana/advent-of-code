def parse(input):
    chunks = input.strip().split("\n\n")
    locks = []
    keys = []
    C = len(chunks[0].split("\n"))
    for chunk in chunks:
        lines = chunk.strip().split("\n")

        # Check if the first line is all '#'
        is_lock = all(ch == "#" for ch in lines[0])

        # Build col_sums
        col_sums = [0] * C
        for line in lines:
            for i, ch in enumerate(line):
                if ch == "#":
                    col_sums[i] += 1

        # Subtract 1 from each column sum
        arr = [val - 1 for val in col_sums]

        if is_lock:
            locks.append(arr)
        else:
            keys.append(arr)
    return locks, keys


def valid_combo(lock, key):
    for lval, kval in zip(lock, key):
        if lval + kval > 5:
            return False
    return True


def main(input):
    locks, keys = parse(input)
    combos = 0
    for lock in locks:
        for key in keys:
            if valid_combo(lock, key):
                combos += 1
    print("Part 1:", combos)


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
