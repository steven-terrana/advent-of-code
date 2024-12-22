import os


def evolve(secret: int) -> int:
    result = secret * 64
    secret = prune(mix(secret, result))

    result = secret // 32
    secret = prune(mix(secret, result))

    result = secret * 2048
    secret = prune(mix(secret, result))
    return secret


def predict(initial, n):
    secret = initial
    for _ in range(n):
        secret = evolve(secret)
    return secret


def prune(secret):
    return secret % 16777216


def mix(secret, mixin):
    return mixin ^ secret


def main():
    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        secrets = list(map(int, f.read().split("\n")))

    print(sum([predict(secret, 2000) for secret in secrets]))


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
