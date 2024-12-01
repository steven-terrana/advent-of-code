input = [line.strip() for line in open("day10/input.txt", "r").readlines()]

chunks = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">"
}

def calculate_score(completion):
  score = 0
  for c in list(completion):
    score *= 5
    if c == ')': score += 1
    if c == ']': score += 2
    if c == '}': score += 3
    if c == '>': score += 4
  return score

def line_is_valid(stack, line):
  valid = True
  for c in list(line):
    if c in chunks: stack.append(c)
    else:
      left = stack.pop()
      # invalid line
      if c != chunks[left]: 
        valid = False
        break
  return valid

completions = []
for line in input:
  stack = []
  if line_is_valid(stack, line):
    stack.reverse()
    complete = ''.join([chunks[c] for c in stack])
    completions.append({
      'line': line,
      'ending': complete,
      'score': calculate_score(complete)
    })

completions = sorted(completions, key = lambda c: c["score"])
idx = int( (len(completions) - 1) / 2)
print(completions[idx]["score"])