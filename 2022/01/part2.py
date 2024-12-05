with open("input.txt", "r") as file:
    input = file.read().split("\n")

elves = [[]]
for line in input:
    if line == "":
        elves.append([])
    else:
        elves[-1].append(int(line))

totals = [sum(elf) for elf in elves]
totals.sort()

print(sum(totals[-3:]))
