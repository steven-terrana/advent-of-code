"""
input is a list of hands of rock paper scissors

A and X = Rock
B and Y = Paper
C and Z = Scissors
"""

from dataclasses import dataclass

with open("input.txt", "r") as file:
    input = file.read().split("\n")

(opponent, me) = zip(*[line.split() for line in input])

decrypt = {
    "A": "rock",
    "X": "rock",
    "B": "paper",
    "Y": "paper",
    "C": "scissors",
    "Z": "scissors",
}

value = {"rock": 1, "paper": 2, "scissors": 3}


@dataclass
class Hand:
    hand: str

    def value(self):
        return value[decrypt[self.hand]]

    def __eq__(self, other):
        return decrypt[self.hand] == decrypt[other.hand]

    def __lt__(self, other):
        return any(
            [
                decrypt[self.hand] == "rock" and decrypt[other.hand] == "paper",
                decrypt[self.hand] == "paper" and decrypt[other.hand] == "scissors",
                decrypt[self.hand] == "scissors" and decrypt[other.hand] == "rock",
            ]
        )

    def __gt__(self, other):
        return any(
            [
                decrypt[self.hand] == "rock" and decrypt[other.hand] == "scissors",
                decrypt[self.hand] == "paper" and decrypt[other.hand] == "rock",
                decrypt[self.hand] == "scissors" and decrypt[other.hand] == "paper",
            ]
        )


score = 0
for round in range(len(input)):
    m = Hand(me[round])
    o = Hand(opponent[round])
    if m == o:
        score += m.value() + 3
    if m > o:
        score += m.value() + 6
    if m < o:
        score += m.value()

print(score)
