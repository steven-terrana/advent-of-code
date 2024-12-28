def parse(input: str):
    """
    builds a filesystem as a list of tuples where
    the first element is the ID and second element
    is the size. Empty ranges have an ID of None.
    """
    filesystem = []
    for id, i in enumerate(range(0, len(input), 2)):
        c = input[i : i + 2]
        size = int(c[0])
        filesystem.append((id, size))
        if len(c) > 1:
            filesystem.append((None, int(c[1])))
    return filesystem


def break_into_blocks(filesystem):
    blocks = []
    for f in filesystem:
        for _ in range(f[1]):
            blocks.append((f[0], 1))
    return blocks


def print_filesystem(filesystem):
    f = ""
    for id, size in filesystem:
        for _ in range(size):
            f += str(id) if id is not None else "."
    print(f)


def get_last_file_idx(filesystem):
    for idx, file in enumerate(reversed(filesystem)):
        if f[0] is not None:
            yield len(filesystem) - 1 - idx


def defrag(filesystem):
    cleaned = filesystem.copy()
    # walk through the filesystem backwards
    # if there is an empty space prior to the
    # current index, then swap.
    i = len(cleaned) - 1
    while i >= 0:
        file = cleaned[i]
        # skip empty file blocks
        is_empty = file[0] is None
        if is_empty:
            i -= 1
            continue
        for j in range(i):
            space = cleaned[j]
            # if space is empty and size is sufficient
            is_empty = space[0] is None
            is_big_enough = space[1] >= file[1]
            if is_empty and is_big_enough:
                # if space is bigger than file, we need
                # to split space into two
                if space[1] > file[1]:
                    replace = [file, (None, space[1] - file[1])]
                    cleaned[j : j + 1] = replace
                    i += 1
                    cleaned[i] = (None, file[1])
                else:
                    cleaned[j] = file
                    cleaned[i] = space
                break
        i -= 1
    return cleaned


def checksum(filesystem):
    c = 0
    for idx, file in enumerate(break_into_blocks(filesystem)):
        if file[0] is not None:
            c += idx * file[0]
    return c


def main(input: str):
    filesystem = parse(input)

    part1 = defrag(break_into_blocks(filesystem))
    print("Part 1:", checksum(part1))

    part2 = defrag(filesystem)
    print("Part 2:", checksum(part2))


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
