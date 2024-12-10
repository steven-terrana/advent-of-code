import os

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = file.read()

chunks = [[int(n) for n in list(input[i : i + 2])] for i in range(0, len(input), 2)]

filesystem = []
for id, c in enumerate(chunks):
    for _ in range(c[0]):
        filesystem.append(id)
    if len(c) > 1:
        for _ in range(c[1]):
            filesystem.append(None)

while None in filesystem:
    idx = filesystem.index(None)
    id = filesystem.pop()
    filesystem[idx] = id


checksum = 0
for block, id in enumerate(filesystem):
    if id == None:
        break
    checksum += block * id

print(checksum)
