import os
from collections import defaultdict

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
    input = f.read()

(towels, patterns) = input.split("\n\n")

towels = [t.strip() for t in towels.split(",")]
patterns = patterns.split("\n")

towels.sort(key=len, reverse=True)


def count_matches(p: str):
    if p in cache:
        return cache[p]
    if p == "":
        return 1
    matches = 0
    for t in towels:
        if p.startswith(t):
            substring = p[len(t) :]
            matches += count_matches(substring)
    cache[p] = matches
    return matches


matches = 0
for p in patterns:
    cache = {}
    matches += count_matches(p)

print(matches)
