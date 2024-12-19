import os
from collections import defaultdict

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
    input = f.read()

(towels, patterns) = input.split("\n\n")

towels = [t.strip() for t in towels.split(",")]
patterns = patterns.split("\n")

towels.sort(key=len, reverse=True)


def is_match(p: str):
    if p in cache:
        return cache[p]
    for t in towels:
        if p.startswith(t):
            substring = p[len(t) :]
            if substring == "":
                cache[p] = True
                return True
            if is_match(substring):
                return True

    cache[p] = False
    return False


matches = 0
for p in patterns:
    cache = {}
    if is_match(p):
        matches += 1

print(matches)
