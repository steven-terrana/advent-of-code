from dataclasses import dataclass
import matplotlib.pyplot as plt
import time


@dataclass
class Computer:
    def __init__(self, a, b, c, program):
        self.a = a
        self.b = b
        self.c = c
        self.program = program
        self.reversed_program = list(reversed(program))
        self.i = 0
        self.out = []

    def reset(self, a):
        self.a = a
        self.b = 0
        self.c = 0
        self.out = []

    def combo(self, operand):
        if 0 <= operand <= 3:
            return operand
        elif operand == 4:
            return self.a
        elif operand == 5:
            return self.b
        elif operand == 6:
            return self.c
        elif operand == 7:
            raise Exception("unexpected operand 7 provided")

    def execute(self):
        while self.i + 1 < len(self.program):
            opcode, operand = self.program[self.i : self.i + 2]
            if opcode == 0:
                self.a = int(self.a / 2 ** self.combo(operand))
            elif opcode == 1:
                self.b = self.b ^ operand
            elif opcode == 2:
                self.b = self.combo(operand) % 8
            elif opcode == 3:
                if self.a == 0:
                    break
                self.i = operand
                continue
            elif opcode == 4:
                self.b = self.b ^ self.c
            elif opcode == 5:
                self.out.append(self.combo(operand) % 8)
                # since we never remove from out, if we have
                # deviated from the program then we can quit early
                # if self.out != self.program[: len(self.out)]:
                #     break
            elif opcode == 6:
                self.b = int(self.a / 2 ** self.combo(operand))
            elif opcode == 7:
                self.c = int(self.a / 2 ** self.combo(operand))

            self.i += 2

    @staticmethod
    def parse():
        import os
        import re

        with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
            input = file.read()

        digits = list(map(int, re.findall(r"\d+", input)))
        return Computer(*digits[:3], digits[3:])


def ten_to_eight(decimal_number):
    if decimal_number == 0:
        return [0]  # Special case for 0

    octal_digits = []
    while decimal_number > 0:
        remainder = decimal_number % 8
        octal_digits.append(remainder)
        decimal_number //= 8

    # The digits are collected in reverse order, so reverse them
    return list(reversed(octal_digits))


def eight_to_ten(octal_digits):
    # Reverse the array to handle powers of 8 easily
    decimal_value = 0
    for index, digit in enumerate(reversed(octal_digits)):
        decimal_value += digit * (8**index)
    return decimal_value


c = Computer.parse()

# Step 1: reverse engineer the program manually:
#
# 2,4 -> b = a % 8
# 1,1 -> b = b ^ 1
# 7,5 -> c = a / 2^b
# 1,5 -> b = b ^ 5
# 4,1 -> b = b ^ c
# 5,5 -> output b % 8
# 0,3 -> a = a // 8
# 3,0 -> iterate again if a is not 0
#
# the program runs operations and outputs 1 value every
# iteration until a // 8 is 0, so that means the seed
# value must be at least 8 to the power of len(program)
# to be big enough to generate enough outputs

min_a = 8 ** (len(c.program) - 1)

# given the emphasis on 8 bits in the program instructions
# and outputs, i tried looking at patterns when converting
# the a register to 8 bits

bits = ten_to_eight(min_a)

# perhaps unsurprisingly, the number of input bits matched the
# number of output bits, so i started manually testing bit
# values and saw that early index input bit changes changed
# late index output bits
#
# so lets try a depth first search manipulating input bits
# until they patch required output bits

idx = 0
while idx < len(c.program):
    # try setting the input bit at index idx
    # until we find a match - if we do, then
    # move on to the next input bit. if we
    # dont, then backtrack
    bits[idx] += 1
    if bits[idx] > 7:
        bits[idx] = 0
        idx -= 1
        continue
    a = eight_to_ten(bits)
    c.reset(a)
    c.execute()
    output = list(reversed(c.out))
    # uncomment to visualize whats happening
    # print("-" * 32)
    # print("  input:", bits)
    # print(" output:", output)
    # print("program:", c.reversed_program)
    # print("-" * 32)

    if output[idx] == c.reversed_program[idx]:
        idx += 1
    if c.out == c.program:
        print(a)
        break
    if idx == -1:
        print("no solution")
