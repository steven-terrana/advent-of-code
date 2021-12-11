import copy
# first things first, we need a 2D array
lines = open("day3/input.txt", "r").read().splitlines()
data = []
for idx, line in enumerate(lines):
  data.append([])
  for bit in line:
    data[idx].append(bit)

# part one
N = len(data[0])
alpha = ""
gamma = ""
for bit in range(N):
  # return bit array from readings
  bit_array = [line[bit] for line in data]
  most_common = max(set(bit_array), key = bit_array.count)
  alpha += most_common
  gamma += str(int(not int(most_common))) 

print(int(alpha, 2) * int(gamma, 2))

# part two
N = len(data[0])

readings = copy.deepcopy(data)
o2 = ''
for bit in range(N):
  bit_array = [line[bit] for line in readings]
  most_common = max(set(bit_array), key = bit_array.count)
  readings = list(filter(lambda x: x[bit] == most_common, readings))
  if len(readings) == 1:
    o2 = o2.join(readings[0])
    break

readings = copy.deepcopy(data)
co2 = ''
for bit in range(N):
  bit_array = [line[bit] for line in readings]
  most_common = max(set(bit_array), key = bit_array.count)
  flipped = str(int(not int(most_common))) 
  readings = list(filter(lambda x: x[bit] == flipped, readings))
  if len(readings) == 1:
    co2 = co2.join(readings[0])
    break

print(f'part two: {int(o2, 2) * int(co2, 2)}')