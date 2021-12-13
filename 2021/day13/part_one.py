from termcolor import colored
input = [ x.strip() for x in open("2021/day13/input.txt").readlines() ]

# print paper
def print_paper(paper):
  for row in paper:
    for value in row:
      if value == 1: 
        print(colored('1', 'red', attrs=["bold"]), end=' ')
      else: print('0', end=' ')
    print('')

# parse the input
def parse_input(input):
  dots  = []
  folds = []
  flag = True
  for line in input:
    if line == "":
      flag = False
      continue
    if flag:
      dots.append([int(x) for x in line.split(",")])
    else:
      fold = line.split()[-1].split("=")
      fold[1] = int(fold[1])
      folds.append(fold)
  return (dots, folds)

# initialize the transparent paper
def initialize_paper(dots):
  max_x = max([dot[0] for dot in dots ])
  max_y = max([dot[1] for dot in dots ])
  paper = []
  for y in range(max_y+1):
    paper.append([])
    for x in range(max_x+1):
      paper[-1].append(1 if [x,y] in dots else 0)
  return paper

def fold(_paper, fold):
  if fold[0] == "y":
    # _paper[fold[1]] = [ "-" for x in _paper[fold[1]] ]
    paper = _paper[:fold[1]]
    h2 = _paper[fold[1]+1:]
    for i, row in enumerate(h2):
      for j, value in enumerate(row):
        if value == 1:
          paper[-1 - i][j] = 1
  if fold[0] == "x":
    # for row in _paper: row[fold[1]] = "|"
    paper = [ row[:fold[1] ] for row in _paper ]
    h2 = [ row[fold[1]+1:] for row in _paper ] 
    for i, row in enumerate(h2):
      for j, value in enumerate(row):
        if value == 1:
          paper[i][-1 - j] = 1

  # print('paper: ')
  # print_paper(paper)
  return paper


(dots, folds) = parse_input(input)
paper = initialize_paper(dots)

for f in folds: paper = fold(paper, f)

print_paper(paper)
print(sum([ sum(row) for row in paper ]))