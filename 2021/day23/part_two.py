import re
import copy
from termcolor import colored
import math
import sys

# woof. 
sys.setrecursionlimit(2000)

class Amphipod:
  '''
  Represents an Amphipod where
  type: the letter of the Amphipod
  position: a list where the first element
            is either 'room' or 'hallway' and the second
            element is the index indicating which room
            or which hallway position. if 'room', there's
            a 3rd element which is the room slot
  '''
  # energy per step based on amphipod type
  energy = {
    "A": 1,
    "B": 10,
    "C": 100,
    "D": 1000
  }
  # the hallway space you land on going left or right
  # based on which room you're leaving
  room_to_hallway = [
    { "left": 1, "right": 2 },
    { "left": 2, "right": 3 },
    { "left": 3, "right": 4 },
    { "left": 4, "right": 5 }
  ]

  # destination room
  # found using destination.index(self.type)
  destination = [ 'A', 'B', 'C', 'D' ]

  def __init__(self, type, position):
    self.type = type 
    self.position = position
  
  def __eq__(self, other):
    if not isinstance(other, Amphipod):
      return False
    
    return all([
      self.type == other.type,
      self.position == other.position
    ])
  
  def __hash__(self):
    return hash(tuple([self.type, tuple(self.position)]))
  
  def get_energy(self):
    return self.energy[self.type]

  def get_possible_moves(self, board):
    '''
    returns all possible positions this Amphipod can move to
    '''
    moves = []
    location = self.position[0]
    dest_room = self.destination.index(self.type)

    ## First - determine if it's NOT possible to move
    ## based on the rules of the game.

    # if we're in a room, it either means that we haven't
    # moved yet or we're done moving.
    if location == "rooms":
      (room_number, room_slot) = self.position[1:3]

      # in destination room and on top of amphipods
      # of the same type
      if room_number == dest_room:
        idxs = [ idx for idx in [1,2,3] if idx > self.position[2] ]
        if [ board.rooms[room_number][i].type for i in idxs ] == [ self.type ] * len(idxs):
          return []

      # room's not finished but in room slot 2 
      # and blocked by an amphipod in room slot 1
      blocked_exit = False
      pos = self.position[2] - 1
      while pos >= 0:
        if board.rooms[room_number][pos]:
          blocked_exit = True
        pos -= 1
      if blocked_exit: return []

    if location == "hallway":
      hallway_slot = self.position[1]
      left = self.room_to_hallway[dest_room]["left"]
      right = self.room_to_hallway[dest_room]["right"]
      
      # destination room isnt free
      # first room slot is taken.. can't enter
      if board.rooms[dest_room][0]:
        return []
      
      # destination room has an amphipod of the wrong type
      r = [ a.type for a in board.rooms[dest_room] if a ]
      if not r.count(self.type) == len(r):
          return []

      # coming from the left of the room and blocked
      slot = hallway_slot
      while slot < left:
        slot += 1
        if board.hallway[slot]: return []

      # coming from the right of the room and blocked
      while slot > right:
        slot -= 1
        if board.hallway[slot]: return []

    # at this point, we could theoretically move.
    # we're either:
    #   1. in the hallway and can reach the destination room
    #   2. in a room
    
    # if we're in the hallway, move to the lowest spot available
    if location == "hallway":
      idx = None
      for i, slot_taken in enumerate(board.rooms[dest_room]):
        if slot_taken: break
        idx = i
      if idx is not None:
        moves.append(["rooms", dest_room, idx])
    
    if location == "rooms":
      # move into target room if hallway is clear
      # in fact, if this is possible, don't consider
      # other moves. always move to the destination room.

      # check if hallway is clear
      hallway_clear = True
      current_room = self.position[1]
      if current_room < dest_room:
        start = self.room_to_hallway[current_room]["right"]
        end = self.room_to_hallway[dest_room]["left"]
      else:
        start = self.room_to_hallway[dest_room]["right"]
        end = self.room_to_hallway[current_room]["left"]
      
      for i in range(start, end+1):
        if board.hallway[i]:
          hallway_clear = False
          break

      if hallway_clear:
        # make sure all amphipods in dest room
        # are of the right type
        r = [ a.type for a in board.rooms[dest_room] if a ]
        if r.count(self.type) == len(r):
          # move to the lowest room available
          idx = None
          for i, slot_taken in enumerate(board.rooms[dest_room]):
            if slot_taken: break
            idx = i
          if idx is not None:
            moves.append(["rooms", dest_room, idx])
            return moves

      # move left
      left = self.room_to_hallway[self.position[1]]["left"]
      pos = left
      while board.hallway[pos] == None:
        moves.append(['hallway', pos])
        pos -= 1
        if pos < 0: break

      # move right
      right = self.room_to_hallway[self.position[1]]["right"]
      pos = right
      while board.hallway[pos] == None:
        moves.append(['hallway', pos])
        pos += 1
        if pos > len(board.hallway) - 1: break
    
    return [ list(m) for m in set([ tuple(m) for m in moves ]) ]
          
class Board:
  '''the game board'''
  def __init__(self, rooms, hallway):
    self.hallway = hallway
    self.rooms = rooms
  
  def __eq__(self, other):
    if not isinstance(other, Board):
      return False
    
    # intentionally dont include self.amphipods
    # so that memoization works right.
    return all([
      self.hallway == other.hallway,
      self.rooms == other.rooms
    ])
  
  def __hash__(self):
    rooms = tuple([tuple(r) for r in self.rooms])
    return hash((tuple(self.hallway), rooms))
    
  def is_over(self):
    '''over when all Amphipods are in the right room'''
    if True in [ None in room for room in self.rooms ]: return False
    return all([
      [ a.type for a in self.rooms[0] ] == ['A', 'A', 'A', 'A'],
      [ a.type for a in self.rooms[1] ] == ['B', 'B', 'B', 'B'],
      [ a.type for a in self.rooms[2] ] == ['C', 'C', 'C', 'C'],
      [ a.type for a in self.rooms[3] ] == ['D', 'D', 'D', 'D'],
    ])

  def get_possible_moves(self):
    '''returns a list of 2-element arrays
    first element is Amphipod to move
    second element is new position for the Amphipod
    '''
    amphipods = []
    # collect hallway amphipods
    [ amphipods.append(a) for a in self.hallway if a ]
    # collect room amphipods
    [ amphipods.append(s) for r in self.rooms for s in r if s ]
    all_moves = []
    for a in amphipods: 
      moves = a.get_possible_moves(self)
      for m in moves:
        all_moves.append([a, m])
    return all_moves

  def move(self, amphipod, position):
    '''
    returns a new board after moving the provided amphipod to the provided position
    '''
    # create deep copies of the board and amphipod
    # so we dont mess with other threads
    _board = copy.deepcopy(self)
    _amphipod = copy.deepcopy(amphipod)

    # update the amphipod's position
    _amphipod.position = position

    # remove the amphipod from its current position
    location = amphipod.position[0]
    if location == "hallway":
      _board.hallway[amphipod.position[1]] = None
    if location == "rooms":
      room = amphipod.position[1]
      slot = amphipod.position[2]
      _board.rooms[room][slot] = None
  
    # put the amphipod in its new position
    location = position[0]
    if location == "hallway":
      _board.hallway[position[1]] = _amphipod
    if location == "rooms":
      room = position[1]
      slot = position[2]
      _board.rooms[room][slot] = _amphipod
    
    return _board

  def print(self):
    h =  [ colored(a.type, 'red')    if a else '.' for a in self.hallway ]
    r0 = [ colored(r[0].type, 'red') if r[0] else '.' for r in self.rooms ]
    r1 = [ colored(r[1].type, 'red') if r[1] else '.' for r in self.rooms ]
    r2 = [ colored(r[2].type, 'red') if r[2] else '.' for r in self.rooms ]
    r3 = [ colored(r[3].type, 'red') if r[3] else '.' for r in self.rooms ]
    print("#############")
    print(f'#{h[0]}{h[1]}.{h[2]}.{h[3]}.{h[4]}.{h[5]}{h[6]}#')
    print(f'###{r0[0]}#{r0[1]}#{r0[2]}#{r0[3]}###')
    print(f'  #{r1[0]}#{r1[1]}#{r1[2]}#{r1[3]}#  ')
    print(f'  #{r2[0]}#{r2[1]}#{r2[2]}#{r2[3]}#  ')
    print(f'  #{r3[0]}#{r3[1]}#{r3[2]}#{r3[3]}#  ')
    print( '  #########')

  @staticmethod
  def calculate_distance(p1, p2):
    '''calculate the number of steps required to move from p1 to p2'''
    # distance leaving origin room (a) 
    # and entering destination room (b)
    leaving, entering = 0, 0
    if p1[0] == "rooms":
      leaving = p1[2] + 1
    if p2[0] == "rooms":
      entering = p2[2] + 1

    # hallway distance
    hallway_converter = [ 0, 1, 3, 5, 7, 9, 10 ]
    room_converter = [ 2, 4, 6, 8 ]
    p1_pos = hallway_converter[p1[1]] if p1[0] == "hallway" else room_converter[p1[1]]
    p2_pos = hallway_converter[p2[1]] if p2[0] == "hallway" else room_converter[p2[1]]
    
    distance = leaving + abs(p2_pos - p1_pos) + entering
    return distance

  @staticmethod
  def from_input(path):
    '''create a board from the input'''
    lines = [ line.strip() for line in open(f"2021/day23/{path}", "r").readlines() ]
    rooms = [ [], [], [], [] ]
    hallway = []
    for idx, c in enumerate(list(lines[1])):
      if c == "#": continue
      if lines[2][idx] != "#": continue
      if c == ".": hallway.append(None)
      else: 
        a = Amphipod(c, ["hallway", len(hallway)])
        hallway.append(a)
    for line in lines[2:6]:
      letters = re.findall(r'[A-D\.]', line)
      for r, l in enumerate(letters):
        if l != ".":
          a = Amphipod(l, ['rooms', r, len(rooms[r])])
          rooms[r].append(a)
        else:
          rooms[r].append(None)
    return Board(rooms, hallway)

# on top of memoization to speed things up.. 
# we know that if the total energy for a game
# exceeds the minimal energy recorded to win so
# far, then we can just stop trying for that game.
globals()["minimal_total_energy"] = math.inf

def play_game(total_energy, board, game_moves=[], memo={}):
  key = (total_energy, board)
  if key in memo: return memo[key]
  if total_energy > globals()["minimal_total_energy"]: return None
  if board.is_over():
    if total_energy < globals()["minimal_total_energy"]:
      globals()["minimal_total_energy"] = total_energy
      print("--------------")
      print(f'total energy: {colored(total_energy, "red")}')
      for m in game_moves:
        (a,p) = m
        print(f'  moving {a.type} at {a.position} to {p}')
    return total_energy

  moves = board.get_possible_moves()
  if not moves: return None

  energies = []
  for move in moves:
    (amphipod, position) = move
    next_game_moves = copy.deepcopy(game_moves)
    next_game_moves.append(move)
    new_board = board.move(amphipod, position)
    distance = Board.calculate_distance(amphipod.position, position)
    new_total_energy = total_energy + distance * amphipod.get_energy()
    move_energy = play_game(new_total_energy, new_board, next_game_moves, memo)
    if move_energy: energies.append(move_energy)

  memo[key] = min(energies) if energies else None 
  return memo[key]

board = Board.from_input("input2.txt")
board.print()
minimum_energy = play_game(0, board)
print(minimum_energy)