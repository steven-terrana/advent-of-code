def parse(input: str):
    (rules, updates) = input.split("\n\n")

    rules = rules.split("\n")
    rules = [[int(n) for n in r.split("|")] for r in rules]
    updates = updates.split("\n")
    updates = [[int(n) for n in u.split(",")] for u in updates]

    return rules, updates


def evaluate(rules, update):
    for rule in rules:
        if rule[0] in update and rule[1] in update:
            if update.index(rule[1]) < update.index(rule[0]):
                return False
    return True


def resolve(rules, update):
    """
    if the update violates a rule, swap the positions of the offending pages and reevaluate.
    do this until no swaps are made, meaning the ordering is compliant now.
    """
    idx = 0
    changed = True
    while changed:
        idx += 1
        changed = False
        for rule in rules:
            if rule[0] in update and rule[1] in update:
                a = update.index(rule[1])
                b = update.index(rule[0])
                if a < b:
                    changed = True
                    tmp = update[a]
                    update[a] = update[b]
                    update[b] = tmp
    return idx > 1


def part1(rules, updates) -> int:
    total = 0
    for update in updates:
        if evaluate(rules, update):
            total += update[len(update) // 2]
    return total


def part2(rules, updates) -> int:
    total = 0
    for update in updates:
        if resolve(rules, update):
            total += update[len(update) // 2]
    return total


def main(input: str):
    rules, updates = parse(input)
    print("Part 1:", part1(rules, updates))
    print("Part 2:", part2(rules, updates))
    pass


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
