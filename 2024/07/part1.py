import os
import itertools

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    equations = file.read().split("\n")

operations = [lambda x, y: x + y, lambda x, y: x * y]


def operate(numbers, ops):
    """
    take a list of numbers and a list of operation indices and
    apply the operations to the numbers left to right.
    """
    n = numbers.copy()
    n.reverse()
    r = n.pop()
    ops.reverse()
    while len(n):
        o = ops.pop()
        r = operations[o](r, n.pop())
    return r


total = 0
for e in equations:
    (result, numbers) = e.split(":")
    result = int(result)
    numbers = [int(n) for n in numbers.split()]
    # get the list of all possible operation combinations
    ops = list(itertools.product(range(len(operations)), repeat=len(numbers) - 1))
    for o in ops:
        if operate(numbers, list(o)) == result:
            total += result
            break


print(total)
