import os

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = file.read()

stones = [int(n) for n in input.split()]


def blink(stones):
    updated = []
    for s in stones:
        if s == 0:
            updated.append(1)
        elif len(str(s)) % 2 == 0:
            n = len(str(s)) // 2
            a = int("".join(list(str(s))[:n]))
            b = int("".join(list(str(s))[n:]))
            updated.append(a)
            updated.append(b)
        else:
            updated.append(s * 2024)
    return updated


for b in range(25):
    stones = blink(stones)

print(len(stones))
