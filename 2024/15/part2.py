import os

directions = {"^": (-1, 0), ">": (0, 1), "<": (0, -1), "v": (1, 0)}


def can_move_left(map, position):
    (r, c) = position
    # if adjacent spot is empty, return true
    if map[r][c - 1] == ".":
        return True
    # if adjacent space is wall, return false
    if map[r][c - 1] == "#":
        return False

    # boxes to our left, keep checking until hit empty space or wall
    bc = c - 1
    while map[r][bc] not in [".", "#"]:
        bc -= 1

    return map[r][bc] == "."


def move_left(map, position):
    r, c = position
    map[r][c] = "."
    c -= 1
    if map[r][c] == ".":
        map[r][c] = "@"
        return

    previous = "@"
    break_next = False
    while True:
        tmp = map[r][c]
        map[r][c] = previous
        previous = tmp
        if break_next:
            break
        if map[r][c - 1] == ".":
            break_next = True
        c -= 1


def can_move_right(map, position):
    (r, c) = position
    # if adjacent spot is empty, return true
    if map[r][c + 1] == ".":
        return True
    # if adjacent space is wall, return false
    if map[r][c + 1] == "#":
        return False

    # boxes to our left, keep checking until hit empty space or wall
    bc = c + 1
    while map[r][bc] not in [".", "#"]:
        bc += 1

    return map[r][bc] == "."


def move_right(map, position):
    r, c = position
    map[r][c] = "."
    c += 1
    if map[r][c] == ".":
        map[r][c] = "@"
        return

    previous = "@"
    break_next = False
    while True:
        tmp = map[r][c]
        map[r][c] = previous
        previous = tmp
        if break_next:
            break
        if map[r][c + 1] == ".":
            break_next = True
        c += 1


def can_move_up(map, position):
    # empty space above player
    r, c = position
    if map[r - 1][c] == ".":
        return True

    # wall above player
    if map[r - 1][c] == "#":
        return False

    # boxes above player
    boxes = [(r, c)]

    while boxes:
        br, bc = boxes.pop()
        if map[br - 1][bc] == "[":
            boxes.extend([(br - 1, bc), (br - 1, bc + 1)])

        if map[br - 1][bc] == "]":
            boxes.extend([(br - 1, bc), (br - 1, bc - 1)])

        if map[br - 1][bc] == "#":
            return False

    return True


def move_up(map, position):
    r, c = position
    if map[r - 1][c] == ".":
        map[r - 1][c] = "@"
        map[r][c] = "."
        return

    queue = [(r, c)]
    to_be_moved = set()
    while queue:
        br, bc = queue.pop()
        if map[br][bc] in ["@", "[", "]"]:
            to_be_moved.add((br, bc))
        if map[br - 1][bc] == "[":
            queue.extend([(br - 1, bc), (br - 1, bc + 1)])

        if map[br - 1][bc] == "]":
            queue.extend([(br - 1, bc), (br - 1, bc - 1)])

    to_be_moved = list(to_be_moved)
    to_be_moved.sort(reverse=True)
    while to_be_moved:
        (br, bc) = to_be_moved.pop()
        map[br - 1][bc] = map[br][bc]
        map[br][bc] = "."


def can_move_down(map, position):
    # empty space above player
    r, c = position
    if map[r + 1][c] == ".":
        return True

    # wall above player
    if map[r + 1][c] == "#":
        return False

    # boxes above player
    boxes = [(r, c)]

    while boxes:
        br, bc = boxes.pop()
        if map[br + 1][bc] == "[":
            boxes.extend([(br + 1, bc), (br + 1, bc + 1)])

        if map[br + 1][bc] == "]":
            boxes.extend([(br + 1, bc), (br + 1, bc - 1)])

        if map[br + 1][bc] == "#":
            return False

    return True


def move_down(map, position):
    r, c = position
    if map[r + 1][c] == ".":
        map[r + 1][c] = "@"
        map[r][c] = "."
        return

    queue = [(r, c)]
    to_be_moved = set()
    while queue:
        br, bc = queue.pop()
        if map[br][bc] in ["@", "[", "]"]:
            to_be_moved.add((br, bc))
        if map[br + 1][bc] == "[":
            queue.extend([(br + 1, bc), (br + 1, bc + 1)])

        if map[br + 1][bc] == "]":
            queue.extend([(br + 1, bc), (br + 1, bc - 1)])

    to_be_moved = list(to_be_moved)
    to_be_moved.sort()
    while to_be_moved:
        (br, bc) = to_be_moved.pop()
        map[br + 1][bc] = map[br][bc]
        map[br][bc] = "."


def get_position(map):
    # find current position
    for r in range(len(map)):
        if "@" in map[r]:
            return (r, map[r].index("@"))


def move(map, direction):
    # calculate the number of boxes adjacent
    # to our position in the specified direction
    dr, dc = directions[direction]
    r, c = get_position(map)
    n = 1
    while map[r + n * dr][c + n * dc] == "O":
        n += 1

    # if the next spot is a wall, leave
    if map[r + n * dr][c + n * dc] != ".":
        return

    n -= 1

    # move the boxes
    if direction == "<":
        map[r][c] = "."
        map[r][c - 1] = "@"
        for i in range(c - n - 1, c - 1):
            map[r][i] = "O"

    elif direction == ">":
        map[r][c] = "."
        map[r][c + 1] = "@"
        for i in range(c + 2, c + 2 + n):
            map[r][i] = "O"

    elif direction == "^":
        map[r][c] = "."
        map[r - 1][c] = "@"
        for i in range(r - n - 1, r - 1):
            map[i][c] = "O"

    elif direction == "v":
        map[r][c] = "."
        map[r + 1][c] = "@"
        for i in range(r + 2, r + 2 + n):
            map[i][c] = "O"


def as_img(map):
    data = []
    lookup = {".": 0, "#": 1, "O": 2, "@": 3}
    for r, row in enumerate(map):
        pixels = []
        for c, char in enumerate(row):
            pixels.append(lookup[char])
        data.append(pixels)
    return data


def print_map(map):
    [print("".join(line)) for line in map]


if __name__ == "__main__":
    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
        map_input, instructions = file.read().split("\n\n")

    map = []
    for line in map_input.split("\n"):
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
        map.append(row)

    instructions = list(instructions.replace("\n", ""))

    for idx, d in enumerate(instructions):
        pos = get_position(map)
        if d == "<" and can_move_left(map, pos):
            move_left(map, pos)
        if d == ">" and can_move_right(map, pos):
            move_right(map, pos)
        if d == "^" and can_move_up(map, pos):
            move_up(map, pos)
        if d == "v" and can_move_down(map, pos):
            move_down(map, pos)

    score = 0
    for r, row in enumerate(map):
        for c, char in enumerate(row):
            if char == "[":
                score += 100 * r + c

    print(score)
