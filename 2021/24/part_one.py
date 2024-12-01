import itertools

def calculate_w(z, c):
  w = None
  for _w in range(1, 10):
    if (z % 26 ) - c == _w: 
      w = _w
  return ( z // 26, w )

def print_model_number(w, c):
  print(f'model number: {w[0]}{w[1]}{w[2]}{w[3]}{c[0]}{c[1]}{w[4]}{c[2]}{w[5]}{c[3]}{w[6]}{c[4]}{c[5]}{c[6]}')
    
inputs = list(itertools.product(range(1,10), repeat=7))
for w in inputs:
  print(w)
  calculated = []
  # program 1: z = w + 15
  z = w[0] + 15
  # program 2: z = z * 26 + w + 16
  z = z * 26 + w[1] + 16
  # program 3: z = z * 26 + w + 4
  z = z * 26 + w[2] + 4
  # program 4: z = z * 26 + w + 14
  z = z * 26 + w[3] + 14
  # program 5: z = z // 26 if (z % 26) - 8 == w else z + w + 1 
  (z, _w) = calculate_w(z, 8)
  if _w: calculated.append(_w)
  else: continue
  # program 6: z = z // 26 if (z % 26) - 10 == w else z + w + 5
  (z, _w) = calculate_w(z, 10)
  if _w: calculated.append(_w)
  else: continue
  # program 7: z = z * 26 + w + 1
  z = z * 26 + w[4] + 1
  # program 8: z = z // 26 if (z % 26) - 3 == w else z + w + 3 
  (z, _w) = calculate_w(z, 3)
  if _w: calculated.append(_w)
  else: continue
  # program 9: z = z * 26 + w + 3
  z = z * 26 + w[5] + 3
  # program 10: z = z // 26 if (z % 26) - 4 == w else z + w + 7
  (z, _w) = calculate_w(z, 4)
  if _w: calculated.append(_w)
  else: continue
  # program 11: z = z * 26 + w + 5
  z = z * 26 + w[6] + 5
  # program 12: z = z // 26 if (z % 26) - 5 == w else z + w + 13
  (z, _w) = calculate_w(z, 5)
  if _w: calculated.append(_w)
  else: continue
  # program 13: z = z // 26 if (z % 26) - 8 == w else z + w + 3
  (z, _w) = calculate_w(z, 8)
  if _w: calculated.append(_w)
  else: continue
  # program 14: z = z // 26 if (z % 26) - 11 == w else z + w + 10
  (z, _w) = calculate_w(z, 11)
  if _w: calculated.append(_w)
  else: continue
  # valid?
  if z == 0: 
    print_model_number(w, calculated)
    break