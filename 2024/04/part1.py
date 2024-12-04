with open("input.txt", "r") as file:
    input = file.read().split("\n")

grid = [list(line) for line in input]


def search(grid, r, c):
    """given a location, check for XMAS"""

    directions = [
        (0, 1),  # right
        (0, -1),  # left
        (1, 0),  # down
        (-1, 0),  # up
        (1, 1),  # down right
        (1, -1),  # down left
        (-1, -1),  # up left
        (-1, 1),  # up right
    ]

    count = 0
    for d in directions:
        try:
            word = []
            for i in range(len("XMAS")):
                R = r + i * d[0]
                C = c + i * d[1]
                if R < 0:
                    break
                if R > len(grid) - 1:
                    break
                if C < 0:
                    break
                if C > len(grid[0]) - 1:
                    break
                word.append(grid[r + i * d[0]][c + i * d[1]])
            if word == ["X", "M", "A", "S"]:
                count += 1
        except Exception:
            pass
    return count


count = 0
for r in range(len(grid)):
    for c in range(len(grid[0])):
        if grid[r][c] != "X":
            continue
        count += search(grid, r, c)

print(count)
