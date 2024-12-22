import os


def evolve(secret: int) -> int:
    result = secret * 64
    secret = prune(mix(secret, result))

    result = secret // 32
    secret = prune(mix(secret, result))

    result = secret * 2048
    secret = prune(mix(secret, result))
    return secret


def predict(initial: int, n: int) -> list[list[int]]:
    prices = []
    diffs = []
    secret = initial
    price = secret % 10
    sequences = {}
    for i in range(n):
        secret = evolve(secret)
        new_price = secret % 10
        prices.append(new_price)
        diffs.append(new_price - price)
        if i >= 3:
            seq = tuple(diffs[i - 3 : i + 1])
            if seq not in sequences:
                sequences[seq] = new_price
        price = new_price

    return sequences


def prune(secret):
    return secret % 16777216


def mix(secret, mixin):
    return mixin ^ secret


def main():
    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        secrets = list(map(int, f.read().split("\n")))

    sequences = []
    for secret in secrets:
        sequences.append(predict(secret, 2000))

    possible_sequences = set()
    for seq in sequences:
        possible_sequences.update(seq.keys())

    bananas = 0
    for seq in possible_sequences:
        total = 0
        for s in sequences:
            if seq in s:
                total += s[seq]
        if total > bananas:
            bananas = total

    print(bananas)


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
