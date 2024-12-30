directions = {"^": (-1, 0), ">": (0, 1), "<": (0, -1), "v": (1, 0)}


def move(warehouse, r, c, direction):
    # calculate the number of boxes adjacent
    # to our position in the specified direction
    dr, dc = directions[direction]
    n = 1
    while warehouse[r + n * dr][c + n * dc] == "O":
        n += 1

    # if the next spot is a wall, leave
    if warehouse[r + n * dr][c + n * dc] != ".":
        return r, c

    n -= 1

    # move the boxes
    if direction == "<":
        warehouse[r][c] = "."
        warehouse[r][c - 1] = "@"
        for i in range(c - n - 1, c - 1):
            warehouse[r][i] = "O"
        return r, c - 1

    elif direction == ">":
        warehouse[r][c] = "."
        warehouse[r][c + 1] = "@"
        for i in range(c + 2, c + 2 + n):
            warehouse[r][i] = "O"
        return r, c + 1

    elif direction == "^":
        warehouse[r][c] = "."
        warehouse[r - 1][c] = "@"
        for i in range(r - n - 1, r - 1):
            warehouse[i][c] = "O"
        return r - 1, c

    elif direction == "v":
        warehouse[r][c] = "."
        warehouse[r + 1][c] = "@"
        for i in range(r + 2, r + 2 + n):
            warehouse[i][c] = "O"
        return r + 1, c


def can_move_left(warehouse, r, c):
    # if adjacent spot is empty, return true
    if warehouse[r][c - 1] == ".":
        return True
    # if adjacent space is wall, return false
    if warehouse[r][c - 1] == "#":
        return False

    # boxes to our left, keep checking until hit empty space or wall
    bc = c - 1
    while warehouse[r][bc] not in [".", "#"]:
        bc -= 1

    return warehouse[r][bc] == "."


def move_left(warehouse, r, c):
    nr, nc = r, c - 1
    warehouse[r][c] = "."
    c -= 1
    if warehouse[r][c] == ".":
        warehouse[r][c] = "@"
        return nr, nc

    previous = "@"
    break_next = False
    while True:
        tmp = warehouse[r][c]
        warehouse[r][c] = previous
        previous = tmp
        if break_next:
            break
        if warehouse[r][c - 1] == ".":
            break_next = True
        c -= 1
    return nr, nc


def can_move_right(warehouse, r, c):
    # if adjacent spot is empty, return true
    if warehouse[r][c + 1] == ".":
        return True
    # if adjacent space is wall, return false
    if warehouse[r][c + 1] == "#":
        return False

    # boxes to our left, keep checking until hit empty space or wall
    bc = c + 1
    while warehouse[r][bc] not in [".", "#"]:
        bc += 1

    return warehouse[r][bc] == "."


def move_right(warehouse, r, c):
    nr, nc = r, c + 1
    warehouse[r][c] = "."
    c += 1
    if warehouse[r][c] == ".":
        warehouse[r][c] = "@"
        return r, c

    previous = "@"
    break_next = False
    while True:
        tmp = warehouse[r][c]
        warehouse[r][c] = previous
        previous = tmp
        if break_next:
            break
        if warehouse[r][c + 1] == ".":
            break_next = True
        c += 1
    return nr, nc


def can_move_up(warehouse, r, c):
    # empty space above player
    if warehouse[r - 1][c] == ".":
        return True

    # wall above player
    if warehouse[r - 1][c] == "#":
        return False

    # boxes above player
    boxes = [(r, c)]

    while boxes:
        br, bc = boxes.pop()
        if warehouse[br - 1][bc] == "[":
            boxes.extend([(br - 1, bc), (br - 1, bc + 1)])

        if warehouse[br - 1][bc] == "]":
            boxes.extend([(br - 1, bc), (br - 1, bc - 1)])

        if warehouse[br - 1][bc] == "#":
            return False

    return True


def move_up(warehouse, r, c):
    nr, nc = r - 1, c
    if warehouse[r - 1][c] == ".":
        warehouse[r - 1][c] = "@"
        warehouse[r][c] = "."
        return nr, nc

    queue = [(r, c)]
    to_be_moved = set()
    while queue:
        br, bc = queue.pop()
        if warehouse[br][bc] in ["@", "[", "]"]:
            to_be_moved.add((br, bc))
        if warehouse[br - 1][bc] == "[":
            queue.extend([(br - 1, bc), (br - 1, bc + 1)])

        if warehouse[br - 1][bc] == "]":
            queue.extend([(br - 1, bc), (br - 1, bc - 1)])

    to_be_moved = list(to_be_moved)
    to_be_moved.sort(reverse=True)
    while to_be_moved:
        (br, bc) = to_be_moved.pop()
        warehouse[br - 1][bc] = warehouse[br][bc]
        warehouse[br][bc] = "."
    return nr, nc


def can_move_down(warehouse, r, c):
    # empty space above player
    if warehouse[r + 1][c] == ".":
        return True

    # wall above player
    if warehouse[r + 1][c] == "#":
        return False

    # boxes above player
    boxes = [(r, c)]

    while boxes:
        br, bc = boxes.pop()
        if warehouse[br + 1][bc] == "[":
            boxes.extend([(br + 1, bc), (br + 1, bc + 1)])

        if warehouse[br + 1][bc] == "]":
            boxes.extend([(br + 1, bc), (br + 1, bc - 1)])

        if warehouse[br + 1][bc] == "#":
            return False

    return True


def move_down(warehouse, r, c):
    nr, nc = r + 1, c
    if warehouse[r + 1][c] == ".":
        warehouse[r + 1][c] = "@"
        warehouse[r][c] = "."
        return nr, nc

    queue = [(r, c)]
    to_be_moved = set()
    while queue:
        br, bc = queue.pop()
        if warehouse[br][bc] in ["@", "[", "]"]:
            to_be_moved.add((br, bc))
        if warehouse[br + 1][bc] == "[":
            queue.extend([(br + 1, bc), (br + 1, bc + 1)])

        if warehouse[br + 1][bc] == "]":
            queue.extend([(br + 1, bc), (br + 1, bc - 1)])

    to_be_moved = list(to_be_moved)
    to_be_moved.sort()
    while to_be_moved:
        (br, bc) = to_be_moved.pop()
        warehouse[br + 1][bc] = warehouse[br][bc]
        warehouse[br][bc] = "."
    return nr, nc


def part1(input: str):
    warehouse, instructions = input.split("\n\n")
    warehouse = [list(line) for line in warehouse.split("\n")]
    instructions = list(instructions.replace("\n", ""))

    # find current position
    r = c = None
    for i in range(len(warehouse)):
        if "@" in warehouse[i]:
            r, c = i, warehouse[i].index("@")
            break

    for d in instructions:
        r, c = move(warehouse, r, c, d)

    score = 0
    for r, row in enumerate(warehouse):
        for c, char in enumerate(row):
            if char == "O":
                score += 100 * r + c

    print("Part 1:", score)


def part2(input: str):
    warehouse_input, instructions = input.split("\n\n")

    warehouse = []
    r = c = None
    for i, line in enumerate(warehouse_input.split("\n")):
        row = []
        for j, char in enumerate(line):
            if char == "#":
                row.extend("##")
            if char == "O":
                row.extend("[]")
            if char == "@":
                r = i
                c = 2 * j + 1
                row.extend("@.")
            if char == ".":
                row.extend("..")
        warehouse.append(row)

    instructions = list(instructions.replace("\n", ""))

    for d in instructions:
        if d == "<" and can_move_left(warehouse, r, c):
            r, c = move_left(warehouse, r, c)
        if d == ">" and can_move_right(warehouse, r, c):
            r, c = move_right(warehouse, r, c)
        if d == "^" and can_move_up(warehouse, r, c):
            r, c = move_up(warehouse, r, c)
        if d == "v" and can_move_down(warehouse, r, c):
            r, c = move_down(warehouse, r, c)

    score = 0
    for r, row in enumerate(warehouse):
        for c, char in enumerate(row):
            if char == "[":
                score += 100 * r + c

    print("Part 2:", score)


def main(input: str):
    part1(input)
    part2(input)


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
