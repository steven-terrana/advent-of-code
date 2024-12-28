def evolve(secret):
    result = secret * 64
    secret = prune(mix(secret, result))

    result = secret // 32
    secret = prune(mix(secret, result))

    result = secret * 2048
    secret = prune(mix(secret, result))
    return secret


def predict(totals, initial, n):
    prices = []
    diffs = []
    secret = initial
    price = secret % 10
    sequences = set()
    for i in range(n):
        secret = evolve(secret)
        new_price = secret % 10
        prices.append(new_price)
        diffs.append(new_price - price)
        if new_price > 0 and i >= 3:
            seq = tuple(diffs[i - 3 : i + 1])
            if seq not in sequences:
                sequences.add(seq)
                if seq not in totals:
                    totals[seq] = 0
                totals[seq] += new_price
        price = new_price

    return secret


def prune(secret):
    return secret % 16777216


def mix(secret, mixin):
    return mixin ^ secret


def main(input: str):
    secrets = [int(n) for n in input.splitlines()]

    totals = {}
    part1 = 0
    for secret in secrets:
        part1 += predict(totals, secret, 2000)

    part2 = max(totals.values())

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
