from dataclasses import dataclass


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


original = Computer.parse()

a = 0
while True:
    # print(a)
    comp = original.copy()
    comp.a = a
    comp.execute()
    if comp.out == comp.program:
        print(a)
        break
    a += 1
