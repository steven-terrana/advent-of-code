import copy

class Program:
  def __init__(self, instructions):
    self.instructions = instructions
    self.memo = {}
  
  def execute(self, alu, input):
    key = tuple([ value for _,value in alu.variables.items() ] + [input])
    if key in self.memo: return copy.deepcopy(self.memo[key])
    # provide input
    input_command = self.instructions[0].split()
    assert input_command[0] == "inp"
    var = input_command[1]
    alu.variables[var] = input
    # run the instructions
    for command in self.instructions[1:]:
      tokens = command.split()
      operation = tokens[0]
      args = [ tokens[1] ]
      param = tokens[2]
      try: param = int(param)
      except ValueError: pass
      args.append(param)
      getattr(alu, operation)(*args)
    # cache the result
    self.memo[key] = copy.deepcopy(alu) # avoid modification of the cache
    return self.memo[key]

class MONAD:
  def __init__(self):
    self.programs = []
  
  def add_program(self, program):
    self.programs.append(program)

  def check(self):
    input = 99999999999999 + 1
    while input > 11111111111110:
      input -= 1
      alu = ALU()
      input_stack = [ int(i) for i in list(str(input)) ]
      input_stack.reverse()
      if 0 in input_stack: 
        continue
      for program in self.programs:
        alu = program.execute(alu, input_stack.pop())
      print(f'{input} | {alu.variables}')
      if alu.variables["z"] == 0:
        print(f'  valid! {input}')
        break

  @staticmethod
  def from_input(path):
    lines = [ line.strip() for line in open(f"2021/day24/{path}", "r").readlines() ]
    instructions = None
    monad = MONAD()
    for line in lines:
      if line.startswith("inp"):
        if instructions: 
          program = Program(instructions)
          monad.add_program(program)
        instructions = []
      instructions.append(line)
    return monad

class ALU:
  def __init__(self):
    self.variables = { 'w': 0, 'x': 0, 'y': 0, 'z': 0 }
  
  def inp(self, var, value):
    self.variables[var] = value
  
  def add(self, a, b):
    if isinstance(b, str): b = self.variables[b]
    self.variables[a] += b
  
  def mul(self, a, b):
    if isinstance(b, str): b = self.variables[b]
    self.variables[a] *= b
  
  def div(self, a, b): 
    if isinstance(b, str): b = self.variables[b]
    if b == 0: 
      print("no dividing by zero. boom.")
      raise ZeroDivisionError
    self.variables[a] = self.variables[a] // b
  
  def mod(self, a, b): 
    if isinstance(b, str): b = self.variables[b]
    if self.variables[a] < 0 or b <= 0:
      print("mod exception. boom.")
      raise ZeroDivisionError
    self.variables[a] %= b
  
  def eql(self, a, b): 
    if isinstance(b, str): b = self.variables[b]
    self.variables[a] = int(self.variables[a] == b)

monad = MONAD.from_input("input.txt")
monad.check()