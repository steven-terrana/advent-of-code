def part1(g1, g2):
    g1 = sorted(g1)
    g2 = sorted(g2)
    sum = 0
    for n in range(len(g1)):
        sum = sum + abs(g1[n] - g2[n])
    return sum

def part2(g1: list[int], g2: list[int]) -> int:
    sum = 0
    for n in set(g1):
        sum = sum + n * g1.count(n) * g2.count(n)
    return sum

def main(input: str):
    (g1, g2) = zip(*[[int(n) for n in line.split()] for line in input.split("\n")])
    print(part1(g1, g2))
    print(part2(g1, g2))