import networkx as nx
import numpy as np
import itertools
import copy
import math

def parse_input():
  '''return an array of scanners where each item is an array of beacon locations'''
  input = [ line.strip() for line in open("2021/day19/test.txt","r").readlines() ]
  scanners = []
  beacons  = set()
  for line in input:
    if line.startswith("---"):
      if len(beacons) > 0:
        scanners.append(Scanner(len(scanners), beacons))
      beacons = set()
    elif line:
      beacons.add(tuple([ int(x) for x in line.split(",") ]))
  if len(beacons) > 0:
        scanners.append(Scanner(len(scanners), beacons))
  return scanners

class Scanner:
  '''represents a scanner, identified by an ID, storing its view of beacons'''
  def __init__(self, id, beacons):
    self.id = id
    self.beacons = beacons

class Transform:
  '''Represents an affine transformation'''
  def __init__(self, scanner, rotation, translation):
    self.fixed_frame = scanner
    self.rotation = rotation
    self.translation = translation
  
  def perform(self, beacons):
    '''
    given a set of beacons, returns the beacons position in the
    coordinate system from the fixed_frame scanner's perspective.
    '''
    transformed = Transform.rotate(self.rotation, beacons)
    transformed = Transform.translate(self.translation, transformed)
    return transformed

  @staticmethod
  def get_rotations(moving):
    '''
    given a set of beacons, determines the dimensionality
    and returns the possible orientations of a scanner.

    rotations are identified by their column (1-indexed) and
    their direction.
    
    for example, a rotation tuple of (-2, 1) would mean:
      swap the first and second columns and multiple every 
      value in the original second column by -1
    '''
    beacons = list(moving.beacons)
    if len(beacons) == 0: return None
    dimensions = len(beacons[0])
    axis = []
    for i in range(1, dimensions+1):
      axis.append(i)
      axis.append(int(-1*i))
    permutations = itertools.permutations(axis, 3)
    f = lambda p: len(set(p)) == len(set([ abs(x) for x in p ])) 
    orientations = list(filter(f, permutations))
    return orientations

  @staticmethod
  def find(fixed, moving):
    '''
    determines if an affine transformation exists that yields
    12 or more common beacons between two scanners

    returns a Transform if a transformation exists, None otherwise

    this is could probably be optimized.. current algorithm:
    * fix the first scanner's coordinate system as the frame of reference
    * for each of the orientations of the scanner, rotate the "moving" scanner's
      beacon coordinates.
    ---> * for each point in the rotated scanner's view, line it up with
           a point from the fixed frame of reference
         * if 12 or more coordinates are in common between the rotated/translated 
           view of the moving beacon and the fixed frame of refernece, then you've
           found a pair with sufficient overlap
    '''
    for rotation in Transform.get_rotations(moving):
      transformed = copy.deepcopy(moving.beacons)
      transformed = Transform.rotate(rotation, transformed)
      for p1 in transformed:
        for p2 in fixed.beacons:
          translation = tuple(np.subtract(p2, p1))
          transform = Transform.translate(translation, transformed)
          intersect = transform.intersection(fixed.beacons)
          if len(intersect) >= 12:
            t = Transform(fixed, rotation, translation)
            return t
    return None
  
  @staticmethod
  def translate(translation, beacons):
    '''
    performs a translation of all beacon coordinates
    according to a provided translation tuple.

    i.e. a coordinate of [1, 4] with a translation tuple of (3, -2)
    would become [4,2]
    '''
    return set([ tuple([sum(x) for x in zip(b, translation)]) for b in beacons ])

  @staticmethod
  def rotate(rotation, beacons):
    '''
    rotates a set of beacon coordinates according to 
    the provided rotation tuple
    '''
    # numpy is gonna make our life a lot easier for this
    rotated = np.array([ list(b) for b in beacons])
    # apply inversions
    for axis in [ r for r in rotation if r < 0 ]:
      column = abs(axis) - 1
      rotated[:, column] *= -1
    # rearrange columns
    permutation = [ abs(r) - 1 for r in rotation ]
    idx = np.empty_like(permutation)
    idx[permutation] = np.arange(len(permutation))
    rotated[:] = rotated[:, idx]
    # return as a set of tuples
    return set([ tuple(beacon) for beacon in rotated ])


def part_one(scanners, mesh):
  '''
  now that we've populated the graph and can map all coordinate systems
  to that of scanner 0's frame of reference, we can use the shortest
  path from a given scanner to scanner 0 in the graph to determine the
  transformations that need to occur. For each scanner then, perform
  the required series of transformations to map the coordinates of the
  beacons to scanner 0's coordinate system and add these beacons to a
  global view of all the beacons.
  '''
  frame_of_reference = scanners[0]
  global_coordinates = frame_of_reference.beacons
  for scanner in scanners[1:]:
    if nx.has_path(mesh, scanner, frame_of_reference):
      path = nx.shortest_path(mesh, scanner, frame_of_reference)
      print(f'path from {frame_of_reference.id} to {scanner.id}: {[ scanner.id for scanner in path ]}')
      beacons = copy.deepcopy(scanner.beacons)
      transformations = []
      for idx in range(len(path[:-1])):
        edge = mesh.get_edge_data(path[idx], path[idx+1])
        t = edge["transform"]
        beacons = t.perform(beacons)
      global_coordinates = global_coordinates.union(beacons)
    else:
      print(f'no path from {root.id} to {scanner.id}')
  print(f'number of beacons: {len(global_coordinates)}')

def part_two(scanners, mesh):
  '''
  for each possible pair of scanners, translate both scanners to
  the scanner 0 frame of reference and compute their manhattan distance
  keeping track of the largest distance found.
  '''
  frame_of_reference = scanners[0]
  greatest_distance = -math.inf
  origin = set([(0,0,0)])
  for pair in itertools.combinations(scanners, 2):
    points = []
    for scanner in pair:
      if nx.has_path(mesh, scanner, frame_of_reference):
        path = nx.shortest_path(mesh, scanner, frame_of_reference)
        print(f'path from {frame_of_reference.id} to {scanner.id}: {[ scanner.id for scanner in path ]}')
        beacons = origin
        for idx in range(len(path[:-1])):
          edge = mesh.get_edge_data(path[idx], path[idx+1])
          t = edge["transform"]
          beacons = t.perform(beacons)
        points.append(list(beacons)[0])
      else:
        print(f'no path from {root.id} to {scanner.id}')
    distance = sum([ abs(points[0][idx] - points[1][idx]) for idx in range(len(points[0]))])
    if distance > greatest_distance:
      greatest_distance = distance
  print(f'greatest distance: {greatest_distance}')

def create_transformation_graph(scanners):
  '''
  create a directed graph where the nodes are the 
  scanners and the edges represent pairs with sufficient
  overlap in beacons. The edge direction follows the direction
  of the transformation. So translating coordinates from scanner 1
  to scanner 0 would mean an edge from scanner 1 to scanner 0 with an 
  edge attribute of "transform"
  '''
  mesh = nx.DiGraph()
  mesh.add_nodes_from(scanners)

  # populate the edges by finding the least number of pairs needed
  # to translate to scanner 0's frame of reference.
  frame_of_reference = scanners[0]
  linked_last_round = set([frame_of_reference]) 
  unlinked_scanners = set(scanners[1:])
  while unlinked_scanners:
    print(f'trying to find links for: {[s.id for s in unlinked_scanners]}')
    if not linked_last_round: break
    linked_this_round = set()
    for root in linked_last_round:
      for scanner in unlinked_scanners:
        print(f'checking for link from {root.id} to {scanner.id}')
        t = Transform.find(root, scanner)
        if t:
          print(f'---> found a link!')
          mesh.add_edge(scanner, root, transform=t)
          linked_this_round.add(scanner)
    unlinked_scanners -= linked_this_round
    linked_last_round = linked_this_round
  
scanners = parse_input()
mesh = create_transformation_graph(scanners)
part_one(scanners, mesh)
part_two(scanners, mesh)
