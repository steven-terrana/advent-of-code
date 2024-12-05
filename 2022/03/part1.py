with open("input.txt", "r") as file:
    rucksacks = [list(r) for r in file.read().split("\n")]


letters = [chr(i) for i in range(97, 123)] + [chr(i) for i in range(65, 91)]

sum = 0
for r in rucksacks:
    mid = len(r) // 2
    intersection = set(r[:mid]) & set(r[mid:])
    common = intersection.pop()
    sum += letters.index(common) + 1

print(sum)
