import re

with open("input.txt", "r") as file:
    input = file.read().split("\n")

total = 0
for pair in input:
    rooms = [int(n) for n in re.findall(r"\d+", pair)]
    a = rooms[0:2]
    b = rooms[2:]

    # a inside b
    # b-------b
    #    a--a
    if b[0] <= a[0] and b[1] >= a[1]:
        total += 1
        continue

    # b inside a
    #  a--------a
    #    b--b
    if a[0] <= b[0] and a[1] >= b[1]:
        total += 1

print(total)
