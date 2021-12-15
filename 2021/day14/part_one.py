import collections
input = [ x.strip() for x in open("2021/day14/input.txt").readlines() ]

def parse_input(input):
  polymer = input[0]

  lookup = {}
  for rule in input[2:]:
    (pair, insertion) = [ x.strip() for x in rule.split("->") ]
    lookup[pair] = insertion

  return (polymer, lookup)

def step(polymer, lookup):
  stack = []
  for idx in range(len(polymer)-1):
    pair = polymer[idx:idx+2]
    stack.append(lookup[pair])

  stack.reverse()
  new_polymer = []
  for letter in polymer: 
    new_polymer.append(letter)
    if len(stack) > 0: new_polymer.append(stack.pop())
  return ''.join(new_polymer)

def print_stats(polymer):
  occurences = collections.Counter(polymer)
  s = occurences.most_common()
  print(s[0][1] - s[-1][1])

(polymer, lookup) = parse_input(input)
for idx in range(10):
  polymer = step(polymer, lookup)
  print_stats(polymer)