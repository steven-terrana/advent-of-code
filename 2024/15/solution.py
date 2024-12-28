directions = {"^": (-1, 0), ">": (0, 1), "<": (0, -1), "v": (1, 0)}


def can_move_left(warehouse, position):
    (r, c) = position
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


def move_left(warehouse, position):
    r, c = position
    warehouse[r][c] = "."
    c -= 1
    if warehouse[r][c] == ".":
        warehouse[r][c] = "@"
        return

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


def can_move_right(warehouse, position):
    (r, c) = position
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


def move_right(warehouse, position):
    r, c = position
    warehouse[r][c] = "."
    c += 1
    if warehouse[r][c] == ".":
        warehouse[r][c] = "@"
        return

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


def can_move_up(warehouse, position):
    # empty space above player
    r, c = position
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


def move_up(warehouse, position):
    r, c = position
    if warehouse[r - 1][c] == ".":
        warehouse[r - 1][c] = "@"
        warehouse[r][c] = "."
        return

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


def can_move_down(warehouse, position):
    # empty space above player
    r, c = position
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


def move_down(warehouse, position):
    r, c = position
    if warehouse[r + 1][c] == ".":
        warehouse[r + 1][c] = "@"
        warehouse[r][c] = "."
        return

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


def get_position(warehouse):
    # find current position
    for r in range(len(warehouse)):
        if "@" in warehouse[r]:
            return (r, warehouse[r].index("@"))


def move(warehouse, direction):
    # calculate the number of boxes adjacent
    # to our position in the specified direction
    dr, dc = directions[direction]
    r, c = get_position(warehouse)
    n = 1
    while warehouse[r + n * dr][c + n * dc] == "O":
        n += 1

    # if the next spot is a wall, leave
    if warehouse[r + n * dr][c + n * dc] != ".":
        return

    n -= 1

    # move the boxes
    if direction == "<":
        warehouse[r][c] = "."
        warehouse[r][c - 1] = "@"
        for i in range(c - n - 1, c - 1):
            warehouse[r][i] = "O"

    elif direction == ">":
        warehouse[r][c] = "."
        warehouse[r][c + 1] = "@"
        for i in range(c + 2, c + 2 + n):
            warehouse[r][i] = "O"

    elif direction == "^":
        warehouse[r][c] = "."
        warehouse[r - 1][c] = "@"
        for i in range(r - n - 1, r - 1):
            warehouse[i][c] = "O"

    elif direction == "v":
        warehouse[r][c] = "."
        warehouse[r + 1][c] = "@"
        for i in range(r + 2, r + 2 + n):
            warehouse[i][c] = "O"


def as_img(warehouse):
    data = []
    lookup = {".": 0, "#": 1, "O": 2, "@": 3}
    for r, row in enumerate(warehouse):
        pixels = []
        for c, char in enumerate(row):
            pixels.append(lookup[char])
        data.append(pixels)
    return data


def parse(input: str):
    warehouse_input, instructions = input.split("\n\n")

    warehouse = []
    for line in warehouse_input.split("\n"):
        row = []
        for char in list(line):
            if char == "#":
                row.extend("##")
            if char == "O":
                row.extend("[]")
            if char == "@":
                row.extend("@.")
            if char == ".":
                row.extend("..")
        warehouse.append(row)

    instructions = list(instructions.replace("\n", ""))


def main(input: str):
    pass


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
