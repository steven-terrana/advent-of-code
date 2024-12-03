import re

with open("input.txt", "r") as file:
    input = file.read()

instructions = re.findall(r"mul\((\d{1,3}),(\d{1,3})\)", input)

sum = 0
for i in instructions:
    sum += int(i[0]) * int(i[1])


print(sum)
