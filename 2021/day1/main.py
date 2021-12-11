from numpy import loadtxt
lines = loadtxt("day1/data.txt", comments="#", delimiter="\n", unpack=False)
prev = None
count = 0
i = 0
while i < lines.size-2:
  window = lines[i:i+3]
  s=sum(window)
  if prev is not None: 
    if s > prev:
      count += 1  
  prev = s
  i += 1

print(count)