with open("input.txt", "r") as file:
    input = file.read().split("\n")

elves = [[]]
for line in input:
    if line == "":
        elves.append([])
    else:
        elves[-1].append(int(line))

max = 0
for elf in elves:
    e = sum(elf)
    if e > max:
        max = e

print(max)
