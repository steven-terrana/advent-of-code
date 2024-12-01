import pandas as pd

input = open("day6/test.txt", "r").read().split(",")

school = pd.DataFrame()
school["fish"] = [ int(fish) for fish in input ]

days = 256
for day in range(days):
  # decrement
  school = school.subtract(1)
  # append new
  n = school[school["fish"] == -1]
  for fish in range(len(n)): school = school.append( { "fish": 8 }, ignore_index=True)
  # reset counter
  school[school["fish"] == -1] = 6
  print(f'after {day} days: {len(school.index)}')