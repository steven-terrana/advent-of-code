def fully_react_polymer(polymer: str) -> int:
    stack = []
    for unit in polymer:
        if stack and stack[-1] != unit and stack[-1].lower() == unit.lower():
            stack.pop()  # They react, so remove the previous unit
        else:
            stack.append(unit)  # No reaction, so add the unit to the stack
    
    return len(stack)

polymer = open('input.txt','r').read()
print(fully_react_polymer(polymer))