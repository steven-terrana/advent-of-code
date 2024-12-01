import collections
import copy
import math

input = [ x.strip() for x in open("2021/day14/input.txt").readlines() ]

def parse_input(input):
  polymer = {}
  for rule in input[2:]:
    (pair, insertion) = [ x.strip() for x in rule.split("->") ]
    polymer[pair] = {
      'insertion': insertion,
      'count': 0
    }
  for idx in range(len(input[0])-1):
    pair = input[0][idx:idx+2]
    polymer[pair]['count'] += 1

  return polymer

def step(polymer):
  # biggest take away is that we don't actually
  # need to know the sequence of the letters in
  # the polymer chain. All that matters is the 
  # number of occurences of each letter.
  # we can do that by tracking the number of occurences
  # of each discrete pair. 

  # create the next polymer iteration
  # and reset the counters
  p = copy.deepcopy(polymer)
  for pair in p: p[pair]["count"] = 0

  # each pair splits into a defined 
  # set of two new pairs. 
  for pair in polymer:
    n = polymer[pair]["count"]
    left = f'{pair[0]}{polymer[pair]["insertion"]}'
    right = f'{polymer[pair]["insertion"]}{pair[1]}'
    p[left]["count"] += n
    p[right]["count"] += n
  return p 

def print_stats(polymer, og):
  # create a letters dict where 
  # each letter is the key and the 
  # value is the number of occurences

  ## break up pairs into individual letters
  letters = {}
  for pair in polymer:
    n = polymer[pair]["count"]

    left = pair[0]
    if left not in letters: letters[left] = 0
    letters[left] += n

    right = pair[1]
    if right not in letters: letters[right] = 0
    letters[right] += n

  ## pairs mean letters double counted so.. divide by 2
  for l in letters: 
    letters[l] = int(letters[l] / 2)

  ## .. except for the start and end of the chain
  letters[og[0]] += 1
  letters[og[-1]] += 1

  ## calculate most common - least common
  c = collections.Counter(letters)
  s = c.most_common()
  print(s)
  print(s[0][1] - s[-1][1])


polymer = parse_input(input)
for idx in range(40):  polymer = step(polymer) 
print_stats(polymer, input[0])