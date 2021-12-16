import numpy as np


class Packet:
  def __init__(self, version, id):
    self.version = version
    self.id = id
    self.sub_packets = []
  
  def add_sub_packet(self, p):
    self.sub_packets.append(p)

  def get_sub_packets(self):
    return self.sub_packets

def hex_to_binary(hex):
  return list(bin(int(hex, 16))[2:].zfill(4*len(hex)))

# transform the bit array into a decimal number. 
# - reads the bits in chunks of 5. 
# - first bit in the chunk determines if it's the last bit. 
# - remaining 4 bits are appended to a bit array
# - when done, bit array converted to decimal
def calculate_literal(bits):
  number = []
  while True:
    bit = bits[0:5]
    del bits[0:5]
    number.extend(bit[1:])
    if int(bit[0]) == 0: break
  n = int(''.join(number),2)
  return (bits, n)

def parse_packet_header(binary):
  version = int(''.join(binary[0:3]), 2)
  id = int(''.join(binary[3:6]), 2)
  del binary[0:6]
  return (binary, version, id)

def parse_packet(binary, versions=None, p_idx=None):
  if versions is None: versions = []
  if p_idx is None: p_idx = 0

  p_idx += 1
  print(f'parsing packet #{p_idx}')

  (binary, version, id) = parse_packet_header(binary)
  versions.append(version)
  if id == 4: # calculate literal value
    (binary, n) = calculate_literal(binary)
  else: 
    length_type_id = int(binary[0])
    del binary[0]
    if length_type_id == 0:
      total_length_in_bits = int(''.join(binary[0:15]), 2)
      del binary[0:15]
      length_0 = len(binary)
      while length_0 - len(binary) < total_length_in_bits:
        (binary, versions) = parse_packet(binary, versions, p_idx)
    elif length_type_id == 1:
      n_sub_packets = int(''.join(binary[0:11]),2)
      del binary[0:11]
      for p in range(n_sub_packets): 
        (binary, versions) = parse_packet(binary, versions, p_idx)

  return (binary, versions)

hex = open("2021/day16/input.txt","r").read().strip()
binary = hex_to_binary(hex)
(binary, versions) = parse_packet(binary)
print(versions)
print(sum(versions))