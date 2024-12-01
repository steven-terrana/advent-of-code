import math
input = [ int(x) for x in open("day7/input.txt", "r").read().split(",") ]

d = {}
min = math.inf
for x in range(max(input) + 1):
  d[str(x)] = 0
  for i in input:
    # sum from 0 to n = n * (n + 1) / 2
    n = abs(x - i)
    d[str(x)] += n * (n + 1) / 2
  if d[str(x)] < min: min = d[str(x)]

print(min)

