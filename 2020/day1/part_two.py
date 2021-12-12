import itertools
input = [ int(x) for x in open("2020/day1/input.txt", "r").readlines() ]

for x in list(itertools.combinations(input, 3)):
  if sum(x) == 2020:
    print(x[0] * x[1] * x[2])
    break
