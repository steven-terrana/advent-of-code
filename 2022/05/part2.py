import re

with open("input.txt", "r") as file:
    input = file.read().splitlines()

# figure out the number of stacks
num_stacks = (len(input[0]) + 1) // 4

# populate the stacks
stacks = [[] for i in range(num_stacks)]

row = input[0]
while "[" in row:
    crates = [row[1 + i * 4] for i in range(num_stacks)]
    for idx, crate in enumerate(crates):
        if crate != " ":
            stacks[idx].append(crate)
    del input[0]
    row = input[0]

[s.reverse() for s in stacks]

# parse the moves
del input[0]
del input[0]
moves = [[int(n) for n in re.findall(r"\d+", row)] for row in input]


# execute the moves
def rearrange(stacks, move):
    (n, source, target) = move
    substack = []
    for _ in range(n):
        substack.append(stacks[source - 1].pop())
    substack.reverse()
    stacks[target - 1] += substack


for move in moves:
    rearrange(stacks, move)

# get letters on top
print("".join([s.pop() for s in stacks]))
