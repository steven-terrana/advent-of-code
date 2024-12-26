import numpy as np
import itertools


def parse(input: str):
    chunks = input.split("\n\n")
    locks = []
    keys = []
    for chunk in chunks:
        chunk = [list(line) for line in chunk.split("\n")]
        R = len(chunk)
        C = len(chunk[0])
        data = np.zeros((R, C))
        for r, row in enumerate(chunk):
            for c, char in enumerate(row):
                if char == "#":
                    data[r][c] = 1

        is_lock = np.sum(data, axis=1)[0] == C
        if is_lock:
            locks.append(np.sum(data, axis=0) - 1)
        else:
            keys.append(np.sum(data, axis=0) - 1)

    return locks, keys


def main(input: str):
    locks, keys = parse(input)
    combos = 0
    for lock, key in itertools.product(locks, keys):
        if np.all(lock + key <= 5):
            combos += 1
    print("Part 1:", combos)


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
