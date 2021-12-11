input = [line.strip() for line in open("day10/input.txt", "r").readlines()]

openings = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">"
}

stack = []
error_score = 0
for line in input:
  for c in list(line):
    if c in openings: stack.append(c)
    else:
      left = stack.pop()
      if c != openings[left]:
        if c == ')': error_score += 3
        if c == ']': error_score += 57
        if c == '}': error_score += 1197
        if c == '>': error_score += 25137

print(error_score)