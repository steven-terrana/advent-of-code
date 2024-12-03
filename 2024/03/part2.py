import re

with open("input.txt", "r") as file:
    input = file.read()

instructions = re.findall(r"(mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don\'t\(\))", input)

sum = 0
enabled = True
for i in instructions:
    if i[0] == "do()":
        enabled = True
    elif i[0] == "don't()":
        enabled = False
    elif enabled:
        sum += int(i[1]) * int(i[2])


print(sum)
