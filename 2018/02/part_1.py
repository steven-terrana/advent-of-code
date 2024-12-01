with open('input.txt', 'r') as file:
    ids = file.read().strip().split('\n')

twos = 0 
threes = 0

for id in ids:
    letters = {}
    for l in id:
        if l in letters:
            letters[l] += 1
        else:
            letters[l] = 1

    if 2 in letters.values():
        twos += 1
    
    if 3 in letters.values():
        threes += 1

print(twos * threes)
    
