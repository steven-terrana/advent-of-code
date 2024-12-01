input = open("day8/input.txt", "r").readlines()

# returns a dictionary with keys 0 through 9
# with the value of the set of letters for
# a given set of signals
def decode(signals):
  signals = signals.split()

  decoder = {}
  for digit in range(10): decoder[str(digit)] = set()

  for signal in signals:
    if len(signal) == 2: decoder['1'] = set(signal)
    if len(signal) == 3: decoder['7'] = set(signal)
    if len(signal) == 4: decoder['4'] = set(signal)
    if len(signal) == 7: decoder['8'] = set(signal)

  # unique letter between 1 and 7 is a
  a = decoder['1'].symmetric_difference(decoder['7'])

  # if you overlay 4 and 7 you'll have all but the 
  # letter representing g in 9. 
  # so find the signal with 6 elements and only 1 letter difference
  _4P7 = set(decoder["4"].union(decoder["7"]))
  for signal in signals:
    if len(signal) == 6:
      diff = set(signal).symmetric_difference(_4P7)
      if len(diff) == 1:
        g = diff

  # if you overlay 7 and g you'll have all but the 
  # letter representing d in 3. 
  # so find the signal with 5 elements and only 1 letter difference
  _7PG = decoder["7"].union(g)
  for signal in signals:
    if len(signal) == 5:
      diff = set(signal).symmetric_difference(_7PG)
      if len(diff) == 1:
        d = diff

  # 9 = the segments in 4 + a and g
  decoder["9"] = decoder["4"].union(a, g)

  # 3 = the segments in 1 + a + d + g
  decoder["3"] = decoder["1"].union(a, d, g)
 
  # 0 is the 6 letter signal that doesn't have d
  for signal in signals:
    s = set(signal)
    if len(signal) == 6 and len(s.intersection(d)) == 0:
      decoder["0"] = s
  
  # 6 is the only 6 segment signal left
  for signal in filter(lambda s: len(s) == 6, signals):
    s = set(signal)
    found = False
    for digit in decoder: 
      if decoder[digit] == s: 
        found = True
    if not found: 
      decoder["6"] = set(signal)
      break

  # e is 8 - 9
  e = decoder['9'].symmetric_difference(decoder['8'])
  
  # 2 is an unfound 5 segment signal with e
  for signal in filter(lambda s: len(s) == 5, signals):
    s = set(signal)
    if True not in [ set(s) == decoder[d] for d in decoder ]:
      if e.issubset(s): 
        decoder['2'] = s

  # 5 is the last one
  for signal in signals:
    s = set(signal)
    if True not in [ set(s) == decoder[d] for d in decoder ]:
      decoder['5'] = s

  return decoder

# uses the line's decoder to return the 4 digit output
def translate(decoder, output):
  o = ''
  for signal in output.split():
    for digit in decoder:
      if set(signal) == decoder[digit]:
        o += digit

  return int(o)

# actually solve the puzzle
sum = 0
for line in input:
  (signals, output) = line.split("|")
  decoder = decode(signals)
  sum += translate(decoder, output)

print(f'sum = {sum}')