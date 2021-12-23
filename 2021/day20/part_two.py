import numpy as np
import copy

def parse_input(path):
  input = [ l.strip() for l in open(f"2021/day20/{path}","r").readlines() ]
  algorithm = input[0]
  image = {
    "values": np.array([ list(line) for line in input[2:] ]),
    "infinity": "."
  }
  return (algorithm, image)

def window2binary(window):
  flatten = window.reshape(1,9)[0]
  bin_str = ''.join(flatten).replace('#','1').replace('.','0')
  idx = int(bin_str, 2)
  return idx

def enhance(algorithm, image):
  padded_image = np.pad(image["values"], [3,3], constant_values=image["infinity"])
  next_infinity = algorithm[window2binary(np.full([3,3], image["infinity"]))]
  output = {
    "values": np.full_like(padded_image, next_infinity),
    "infinity": next_infinity
  }
  for row in range(1, len(padded_image) - 2):
    for col in range(1, len(padded_image[0])-2):
      window = padded_image[row-1:row+2,col-1:col+2]
      idx = window2binary(window)
      output["values"][row,col] = algorithm[idx]

  return output

algorithm, image = parse_input("input.txt")
output = image
for i in range(50): 
  output = enhance(algorithm, output)
  print(f'enhanced {i+1} times')
pixels = sum([ list(row).count("#") for row in output["values"] ])
print(f'lit pixels: {pixels}')