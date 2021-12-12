
input = open("2020/day2/input.txt", "r").readlines()

valid = 0
for line in input:
  (policy, password) = line.split(":")
  (frequency, letter) = policy.split()
  (min, max) = frequency.split("-")
  if int(min) <= list(password).count(letter) <= int(max): 
    valid += 1

print(valid)