with open("input.txt", "r") as file:
    rucksacks = [r for r in file.read().split("\n")]


letters = [chr(i) for i in range(97, 123)] + [chr(i) for i in range(65, 91)]

groups = [rucksacks[i : i + 3] for i in range(0, len(rucksacks), 3)]
sum = 0
for g in groups:
    intersection = set(g[0]) & set(g[1]) & set(g[2])
    common = intersection.pop()
    sum += letters.index(common) + 1

print(sum)
