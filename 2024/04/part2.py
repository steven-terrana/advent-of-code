with open("input.txt", "r") as file:
    input = file.read().split("\n")

grid = [list(line) for line in input]


def search(grid, r, c):
    try:
        return any(
            [
                # M S
                #  A
                # M S
                all(
                    [
                        grid[r - 1][c - 1] == "M",
                        grid[r - 1][c + 1] == "S",
                        grid[r + 1][c - 1] == "M",
                        grid[r + 1][c + 1] == "S",
                    ]
                ),
                # M M
                #  A
                # S S
                all(
                    [
                        grid[r - 1][c - 1] == "M",
                        grid[r - 1][c + 1] == "M",
                        grid[r + 1][c - 1] == "S",
                        grid[r + 1][c + 1] == "S",
                    ]
                ),
                # S M
                #  A
                # S M
                all(
                    [
                        grid[r - 1][c - 1] == "S",
                        grid[r - 1][c + 1] == "M",
                        grid[r + 1][c - 1] == "S",
                        grid[r + 1][c + 1] == "M",
                    ]
                ),
                # S S
                #  A
                # M M
                all(
                    [
                        grid[r - 1][c - 1] == "S",
                        grid[r - 1][c + 1] == "S",
                        grid[r + 1][c - 1] == "M",
                        grid[r + 1][c + 1] == "M",
                    ]
                ),
            ]
        )
    except Exception:
        return False


count = 0
for r in range(1, len(grid) - 1):
    for c in range(1, len(grid[0]) - 1):
        if grid[r][c] != "A":
            continue
        if search(grid, r, c):
            count += 1

print(count)
