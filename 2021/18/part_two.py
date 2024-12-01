import math
import itertools

class SnailFishNumber:
  '''
  A binary tree class for SnailFish Numbers.
  value is None for nodes and an integer value for leaves
  '''
  def __init__(self, value, depth=None, parent=None):
    self.depth = 0 if depth is None else depth
    self.parent = None if parent is None else parent
    if isinstance(value, list):
      self.value = None
      self.left = SnailFishNumber(value[0], self.depth+1, self)
      self.right = SnailFishNumber(value[1], self.depth+1, self)
    else:
      self.value = value
      self.left = None
      self.right = None

  def as_array(self):
    '''
    Flatten the binary tree and represent as an array - the 
    same format as the puzzle input

    returns an array for nodes and an integer for leaves
    '''
    number = []
    if self.value is None:
      number.append(self.left.as_array())
      number.append(self.right.as_array())
      return number
    else: return self.value

  def is_branch(self):
    '''
    a branch is a node whose left and right values are leaves.
    
    i.e.: [3,2] is a branch
          [4,[3,2]] is not

    returns True for branches, otherwise False
    '''
    # if self is a leaf, self is not a branch
    if self.value: return False

    if None in [self.left, self.right]:
      return False

    if None in [self.left.value, self.right.value]:
      return False
    
    return True

    # subtree = SnailFishNumber.preorder_traversal(self)
    # return len(subtree) == 3
  
  def explode(self):
    '''
    explode algorithm:
      1. get all nodes using a preorder traversal
      2. sort the nodes by depth
      3. node to explode is the first node with depth at or above 4
      4. the closest leaves on the left and right are the 
      closet leaf node in the array found via preorder traversal
    
    returns True if an explosion happened, otherwise False
    '''
    # determine if explodable
    numbers = SnailFishNumber.preorder_traversal(self)
    sorted_numbers = sorted(numbers, key=lambda f: f.depth)
    exploding = next(filter(lambda n: n.depth > 3 and n.is_branch(), sorted_numbers), None)
    if exploding is None: return False

    # determine closest numbers to the left and right
    left_neighbor = None
    right_neighbor = None
    found_exploding = False
    ##                   ignore leaves within exploding pair
    for n in [ n for n in numbers if n.parent != exploding ]:
      if n == exploding: 
        found_exploding = True
      if n.value is not None: 
        if found_exploding: 
          right_neighbor = n
          break
        else:
          left_neighbor = n
    
    # update values
    if left_neighbor: left_neighbor.value += exploding.left.value
    if right_neighbor: right_neighbor.value += exploding.right.value
    zero = SnailFishNumber(0, exploding.depth, exploding.parent)
    parent = exploding.parent
    if parent.left  == exploding: parent.left  = zero
    if parent.right == exploding: parent.right = zero
    return True

  def split(self):
    '''
    split if applicable

    returns True if split occured, otherwise False
    '''
    # determine if splittable
    numbers = SnailFishNumber.preorder_traversal(self)
    to_split = next(filter(lambda f: f.value is not None and f.value >= 10, numbers), None)
    if to_split is None: return False

    # split
    parent = to_split.parent
    l_value = int(math.floor(to_split.value/2))
    r_value = int(math.ceil(to_split.value/2))
    new_pair = SnailFishNumber([l_value, r_value], depth=to_split.depth, parent=parent)
    if parent.left  == to_split: parent.left  = new_pair
    if parent.right == to_split: parent.right = new_pair
    
    return True

  def reduce(self):
    '''reduce the number'''
    while True:
      if self.explode(): continue
      if self.split(): continue
      break
  
  def get_magnitude(self):
    '''get the magnitude'''
    if isinstance(self.value, int): 
      return self.value
    else: 
      magnitude = 3 * self.left.get_magnitude() + 2 * self.right.get_magnitude()
      return magnitude

  def __add__(self, o):
    a = self.as_array()
    b = o.as_array()
    sum = SnailFishNumber([a, b])
    sum.reduce()
    return sum


  # returns an array of all the nodes in the binary
  # tree found via preorder traversal
  @staticmethod
  def preorder_traversal(root, nodes = None):
    '''
    return all nodes in the binary tree using a 
    preorder traversal algorithm for ordering

    this ordering was used to simplify the process
    for determining the closest neighbors during
    an explosion
    '''
    nodes = [] if nodes is None else nodes
    if root not in nodes: nodes.append(root)
    if root.left:  SnailFishNumber.preorder_traversal(root.left, nodes)
    if root.right: SnailFishNumber.preorder_traversal(root.right, nodes)    
    return nodes

def parse_input(file):
  '''return a list of SnailFishNumbers from the puzzle input'''
  lines = [ l.strip() for l in open(file, "r").readlines() ]
  numbers = [ SnailFishNumber(eval(l)) for l in lines ]
  return numbers

numbers = parse_input("2021/day18/test.txt")

greatest_magnitude = -math.inf
for p in itertools.permutations(numbers, 2):
  (a, b) = p
  n = a + b
  magnitude = n.get_magnitude()
  if magnitude > greatest_magnitude:
    greatest_magnitude = magnitude

print(greatest_magnitude)  