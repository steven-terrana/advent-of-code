lines = open("day2/data.txt", "r").read().splitlines()

x = 0
y = 0
aim = 0

for line in lines:
  direction, distance = line.split(' ')
  distance = int(distance)
  print(f'moving {direction} {distance} units')
  if direction == "up":
    aim -= distance
  if direction == "down": 
    aim += distance
  if direction == "forward": 
    x += distance
    y += aim * distance
  
print( x * y )