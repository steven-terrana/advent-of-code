from dataclasses import dataclass

with open("input.txt", "r") as file:
    input = file.read().split("\n")

win = {"rock": "paper", "paper": "scissors", "scissors": "rock"}
lose = {"rock": "scissors", "paper": "rock", "scissors": "paper"}
values = {"rock": 1, "paper": 2, "scissors": 3}
decrypt = {"A": "rock", "B": "paper", "C": "scissors"}

score = 0
for round in input:
    (opponent, outcome) = round.split()
    if outcome == "X":  # lose
        score += values[lose[decrypt[opponent]]]
    if outcome == "Y":  # draw
        score += 3 + values[decrypt[opponent]]
    if outcome == "Z":  # win
        score += 6 + values[win[decrypt[opponent]]]

print(score)
