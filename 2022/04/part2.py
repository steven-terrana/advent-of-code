import re

with open("input.txt", "r") as file:
    input = file.read().split("\n")

total = 0
for pair in input:
    rooms = [int(n) for n in re.findall(r"\d+", pair)]
    a = rooms[:2]
    b = rooms[2:]

    if any(
        [
            a[0] <= b[1] <= a[1],
            a[0] <= b[0] <= a[1],
            b[0] <= a[0] <= b[1],
            b[0] <= a[1] <= b[1],
        ]
    ):
        total += 1


print(total)
