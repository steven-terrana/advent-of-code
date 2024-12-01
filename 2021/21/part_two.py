import copy
import itertools

def calculate_new_position(old_position, rolls):
  new_position = (old_position + sum(rolls)) % 10
  if new_position == 0: new_position = 10
  return new_position

# state = [is_p1_score, p1_pos, p1_score, p2_pos, p2_score]
def play_game(state, possible_rolls, memo={}):
  if tuple(state) in memo: return memo[tuple(state)]
  if state[2] >= 21: return [1, 0] # p1 wins
  if state[4] >= 21: return [0, 1] # p2 wins
  total_outcomes = [0,0]
  for roll in possible_rolls:
    next_state = copy.deepcopy(state)
    if state[0]: # player 1's turn 
      next_state[1] = calculate_new_position(state[1], roll)
      next_state[2] += next_state[1]
      next_state[0] = not state[0]
      roll_outcome = play_game(next_state, possible_rolls, memo)
    else: # player 2's turn
      next_state[3] = calculate_new_position(state[3], roll)
      next_state[4] += next_state[3]
      next_state[0] = not state[0]
      roll_outcome = play_game(next_state, possible_rolls, memo)
    total_outcomes = [ sum(x) for x in zip(roll_outcome, total_outcomes) ]
  memo[tuple(state)] = total_outcomes
  return memo[tuple(state)]

possible_rolls = list(itertools.product(range(1, 4), repeat=3))
outcomes = play_game([True, 4, 0, 2, 0], possible_rolls)
print(outcomes)