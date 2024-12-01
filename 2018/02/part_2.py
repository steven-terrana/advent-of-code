def levenshtein(a, b):
    distance = 0
    for idx, _ in enumerate(a):
        if a[idx] is not b[idx]: 
            distance += 1
    distance += abs(len(a) - len(b))
    return distance

def printCommonLetters(a, b):
    same = ''
    for idx, _ in enumerate(a):
        if a[idx] == b[idx]:
            same += a[idx]
    print(same)

def main():
    with open('input.txt', 'r') as file:
        ids = file.read().strip().split('\n')
    
    for idx, id in enumerate(ids):
        for compare in ids[idx+1:]:
            if levenshtein(id, compare) == 1:
                printCommonLetters(id, compare)
                return

if __name__ == "__main__": 
    main()