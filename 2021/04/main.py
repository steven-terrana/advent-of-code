import sys
import copy

class BingoBoard:
  """represents a single bingo board"""

  def __init__(self, id):
      self.board  = [] # 2D array for the board
      self.marked = [] # 2D array for the marks
      self.last_guess = None
      self.won = False

  def add_row(self, row):
    self.board.append(row)
    self.marked.append([0 for col in range(len(row))])

  def mark(self, n):
    self.last_guess = int(n)
    for i, row in enumerate(self.board): 
      for j, value in enumerate(row):
        if value == n:
          self.marked[i][j] = "x"

  def is_winner(self):
    # skip it if we already know this is a winner
    if self.won: return True
    # calculate row
    for i, row in enumerate(self.marked):
      if all(n == "x" for n in row):
        self.won = True
    # calculate column
    for idx in range(len(self.board[0])):
      col = [ x[idx] for x in self.marked]
      if all(n == "x" for n in col):
        self.won = True
    return self.won

  def get_score(self): 
    sum = 0
    for i, row in enumerate(self.board):
      for j, value in enumerate(row):
        if self.marked[i][j] == 0:
          sum += int(value)
    return sum * self.last_guess

## setup the game
input = open("day4/input.txt", "r").read().splitlines()
boards = []
numbers = []
current_board = None
id = 1
for idx, line in enumerate(input):
  if idx == 0: numbers = line.split(",")
  elif line == "": 
    if current_board is not None:
      boards.append(current_board)
    current_board = None
  else: 
    if current_board is None:
      current_board = BingoBoard(id)
      id += 1
    current_board.add_row(line.split())

if current_board is not None: 
  boards.append(current_board)

# play the game
winners = []
active = copy.deepcopy(boards)
for i, guess in enumerate(numbers):
  active = list(filter(lambda b: not b.is_winner(), active))
  for j, board in enumerate(active):
    board.mark(guess)
    if board.is_winner():
      winners.append(board)

print(f'last winner has score: {winners[-1].get_score()}')