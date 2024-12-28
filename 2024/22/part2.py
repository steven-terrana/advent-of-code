import os


def evolve(secret: int) -> int:
    result = secret * 64
    secret = prune(mix(secret, result))

    result = secret // 32
    secret = prune(mix(secret, result))

    result = secret * 2048
    secret = prune(mix(secret, result))
    return secret


# keep a global totals index
totals = {}


def predict(initial: int, n: int) -> list[list[int]]:
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


def main():
    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        secrets = list(map(int, f.read().split("\n")))

    for secret in secrets:
        predict(secret, 2000)

    print(max(totals.values()))


if __name__ == "__main__":
    import cProfile
    import pstats

    with cProfile.Profile() as pr:
        main()

        # Save the profile data to a file
        with open("output.prof", "w") as f:
            stats = pstats.Stats(pr, stream=f)
            stats.strip_dirs()
            stats.sort_stats("cumtime")
            stats.dump_stats("output.prof")
