
input = open("2020/day2/input.txt", "r").readlines()

valid = 0
for line in input:
  (policy, password) = line.split(":")
  (frequency, letter) = policy.split()
  (min, max) = [ int(x) - 1 for x in frequency.split("-") ]
  if [ password[min] , password[max] ].count(letter) == 1:
    valid += 1

print(valid)