import re

def fully_react_polymer(polymer: str) -> int:
    stack = []
    for unit in polymer:
        if stack and stack[-1] != unit and stack[-1].lower() == unit.lower():
            stack.pop()  # They react, so remove the previous unit
        else:
            stack.append(unit)  # No reaction, so add the unit to the stack
    
    return len(stack)

og_polymer = open('input.txt','r').read()

min = float('inf')

for letter in {c.lower() for c in og_polymer}:
    polymer = og_polymer
    polymer = polymer.replace(f'{letter}', '')
    polymer = polymer.replace(f'{str.swapcase(letter)}', '')
    new_polymer = fully_react_polymer(polymer)
    if new_polymer < min: min = new_polymer
    print(f'{letter}: {new_polymer}')

print(min)