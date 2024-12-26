from functools import cache


class PrefixTree:
    def __init__(self):
        self.children = {}
        self.is_towel = False

    @cache
    def count_matches(self, pattern: str) -> int:
        if pattern == "":
            return 1

        matches = 0
        node = self
        for i, letter in enumerate(pattern):
            if letter not in node.children:
                break
            node = node.children[letter]
            if node.is_towel:
                matches += self.count_matches(pattern[i + 1 :])

        return matches

    @staticmethod
    def parse(towels: list[str]) -> "PrefixTree":
        root = PrefixTree()
        for towel in towels:
            node = root
            for letter in towel:
                if letter not in node.children:
                    node.children[letter] = PrefixTree()
                node = node.children[letter]
            node.is_towel = True
        return root


def main(input: str):
    (towels, patterns) = input.split("\n\n")

    towels = [t.strip() for t in towels.split(",")]
    patterns = patterns.split("\n")

    prefix_tree = PrefixTree.parse(towels)

    part1 = 0
    part2 = 0
    for pattern in patterns:
        matches = prefix_tree.count_matches(pattern)
        if matches > 0:
            part1 += 1
            part2 += matches

    print("Part 1:", part1)
    print("Part 2:", part2)


if __name__ == "__main__":
    import cProfile
    import pstats
    import os
    import time
    from colorama import Fore

    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        input = f.read()

    with cProfile.Profile() as pr:
        start_time = time.time()
        main(input)
        end_time = time.time()
        print(Fore.CYAN + f"execution time: {end_time - start_time:.3f} seconds")

        # Save the profile data to a file
        with open(f"{os.path.dirname(__file__)}/solution.prof", "w") as f:
            stats = pstats.Stats(pr, stream=f)
            stats.strip_dirs()
            stats.sort_stats("cumtime")
            stats.dump_stats(f"{os.path.dirname(__file__)}/solution.prof")
