import os
from functools import cache


@cache
def blink(stone, remaining):
    if remaining == 0:
        return 1
    if stone == 0:
        return blink(1, remaining - 1)
    elif len(str(stone)) % 2 == 0:
        n = len(str(stone)) // 2
        a = int("".join(list(str(stone))[:n]))
        b = int("".join(list(str(stone))[n:]))
        return blink(a, remaining - 1) + blink(b, remaining - 1)
    else:
        return blink(stone * 2024, remaining - 1)


with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    stones = [int(n) for n in file.read().split()]

print(sum([blink(stone, 75) for stone in stones]))
