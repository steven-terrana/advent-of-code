import numpy as np

class Packet:
  def __init__(self, version, id):
    self.version = version
    self.id = id
    self.sub_packets = []
    self.value = None
  
  def add_sub_packet(self, p):
    self.sub_packets.append(p)

  def get_sub_packets(self):
    return self.sub_packets

  def set_value(self, v):
    self.value = v

  def get_value(self):
    sub_packet_values = [ packet.get_value() for packet in self.get_sub_packets() ]
    if self.id == 0: # sum packets
      return sum(sub_packet_values)
    if self.id == 1: # product packets
      return np.product(sub_packet_values)
    if self.id == 2: # minimum packets
      return min(sub_packet_values)
    if self.id == 3: # maximum packets
      return max(sub_packet_values)
    if self.id == 4: # literal packets
      # value set during parsing
      return self.value
    if self.id == 5: # greater than packets
      return 1 if sub_packet_values[0] > sub_packet_values[1] else 0
    if self.id == 6: # less than packets
      return 1 if sub_packet_values[0] < sub_packet_values[1] else 0
    if self.id == 7: # equal to packets
      return 1 if sub_packet_values[0] == sub_packet_values[1] else 0

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

def parse_packet(binary):
  (binary, version, id) = parse_packet_header(binary)

  current_packet = Packet(version, id)

  if id == 4: # calculate literal value
    (binary, n) = calculate_literal(binary)
    current_packet.set_value(n)
    return (binary, current_packet)
  else: 
    length_type_id = int(binary[0])
    del binary[0]
    if length_type_id == 0:
      total_length_in_bits = int(''.join(binary[0:15]), 2)
      del binary[0:15]
      length_0 = len(binary)
      while length_0 - len(binary) < total_length_in_bits:
        (binary, packet) = parse_packet(binary)
        current_packet.add_sub_packet(packet)
    elif length_type_id == 1:
      n_sub_packets = int(''.join(binary[0:11]),2)
      del binary[0:11]
      for p in range(n_sub_packets): 
        (binary, packet) = parse_packet(binary)
        current_packet.add_sub_packet(packet)

  return (binary, current_packet)

hex = open("2021/day16/input.txt","r").read().strip()
binary = hex_to_binary(hex)
(binary, packet) = parse_packet(binary)
print(packet.get_value())
