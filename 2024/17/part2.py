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
        self.i = 0
        self.out = []

    def copy(self):
        return Computer(self.a, self.b, self.c, self.program)

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
    return octal_digits[::-1]


def eight_to_ten(octal_digits):
    # Reverse the array to handle powers of 8 easily
    decimal_value = 0
    for index, digit in enumerate(reversed(octal_digits)):
        decimal_value += digit * (8**index)
    return decimal_value


original = Computer.parse()

# i solved this with manual intervention after reverse engineering
#  the problem by hand.... you could do it with a DFS of the this bits array
#
# 1. convert base 10 A register value to base 8
# 2. beginning elements of bit array impact last elements of output array
# 3. the process was to start at 8**16 which corresponds to 1000000000000000
#    and increment values while we matched the expected output


bits = [4, 5, 2, 6, 4, 4, 4, 1, 3, 3, 2, 6, 7, 2, 7, 5]
a = eight_to_ten(bits)
original.a = a
original.execute()

print(bits)
print(list(reversed(original.program)))
print(list(reversed(original.out)))

print(a)
