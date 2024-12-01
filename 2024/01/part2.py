# read input
with open('input.txt', 'r') as file:
    numbers = file.read().strip().split('\n')

# parse input
group1 = []
group2 = []

for line in numbers:
    n = line.split()
    group1.append(int(n[0]))
    group2.append(int(n[1]))

# calculate sum
sum = 0
for n in range(len(group1)):
    sum = sum + group1[n] * group2.count(group1[n])

print(sum)
