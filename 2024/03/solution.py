import re


def main(input: str):
    instructions: tuple[str] = re.findall(
        r"(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don\'t\(\))", input
    )

    part1 = 0
    part2 = 0
    enabled = True
    for i in instructions:
        if i[0] == "do()":
            enabled = True
        elif i[0] == "don't()":
            enabled = False
        else:
            part1 += int(i[1]) * int(i[2])
            if enabled:
                part2 += int(i[1]) * int(i[2])

    print(part1)
    print(part2)
