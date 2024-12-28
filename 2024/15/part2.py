import os

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


if __name__ == "__main__":
    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
        warehouse_input, instructions = file.read().split("\n\n")

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

    for idx, d in enumerate(instructions):
        pos = get_position(warehouse)
        if d == "<" and can_move_left(warehouse, pos):
            move_left(warehouse, pos)
        if d == ">" and can_move_right(warehouse, pos):
            move_right(warehouse, pos)
        if d == "^" and can_move_up(warehouse, pos):
            move_up(warehouse, pos)
        if d == "v" and can_move_down(warehouse, pos):
            move_down(warehouse, pos)

    score = 0
    for r, row in enumerate(warehouse):
        for c, char in enumerate(row):
            if char == "[":
                score += 100 * r + c

    print(score)
