class Player:
  def __init__(self, id, position):
    self.id = id
    self.position = position
    self.score = 0
  
  def move(self, board, rolls):
    self.position = board.move(self, sum(rolls))
    self.score += self.position
    print(f'Player {self.id} rolls {"+".join([ str(r) for r in rolls])} and moves to space {self.position} for a total score of {self.score}')

class GameBoard:
  def __init__(self, length):
    self.length = length
  
  def move(self, player, spaces):
    position = player.position
    for _ in range(spaces):
      position += 1
      if position > self.length:
        position = 1      
    return position

class DeterministicDice:
  def __init__(self):
    self.times_rolled = 0

  def roll(self):
    self.times_rolled += 1
    return self.times_rolled

def play_game(players, board, dice, winning_score):
  while True:
    for player in players:
      roll_values = [ dice.roll() for _ in range(3) ]
      player.move(board, roll_values)
      if player.score >= winning_score:
        print(f'Player {player.id} wins!')
        return player

def part_one():
  players = [ Player(i+1, p) for i, p in enumerate([4, 2])]
  board = GameBoard(10)
  dice = DeterministicDice()
  winner = play_game(players, board, dice, 1000)
  players.remove(winner)
  loser = players[0]
  print(dice.times_rolled * loser.score)

part_one()