input = open("day6/input.txt", "r").read().split(",")

state = {}
for x in range(9): state[str(x)] = 0
for fish in input: state[str(fish)] += 1

days = 256
for day in range(days):
  n = state[str(0)]
  for key in state:
    if int(key) == 8: 
      state[key] = n
    elif int(key) == 6:
      idx = str(int(key) + 1)
      state[key] = state[idx] + n
    else:
      idx = str(int(key) + 1)
      state[key] = state[idx]

print(sum([state[x] for x in state]))