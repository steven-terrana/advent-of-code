import os


def count_matches(cache, towels, p):
    if p in cache:
        return cache[p]
    if p == "":
        return 1
    matches = 0
    for t in towels:
        if p.startswith(t):
            substring = p[len(t) :]
            matches += count_matches(cache, towels, substring)
    cache[p] = matches
    return matches


def main():
    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        input = f.read()

    (towels, patterns) = input.split("\n\n")

    towels = [t.strip() for t in towels.split(",")]
    patterns = patterns.split("\n")

    towels.sort(key=len, reverse=True)

    matches = 0
    for p in patterns:
        cache = {}
        matches += count_matches(cache, towels, p)

    print(matches)


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
