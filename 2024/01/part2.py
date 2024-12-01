# read input
input = open('input.txt', 'r').read().split('\n')

# parse input
(group1, group2) = zip(*[ [int(n) for n in line.split()] for line in input])

# calculate sum
sum = 0
for n in set(group1):
    sum = sum + n * group1.count(n) * group2.count(n)

print(sum)
