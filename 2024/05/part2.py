with open("input.txt", "r") as file:
    input = file.read()


(rules, updates) = input.split("\n\n")

rules = rules.split("\n")
rules = [[int(n) for n in r.split("|")] for r in rules]
updates = updates.split("\n")
updates = [[int(n) for n in u.split(",")] for u in updates]


def resolve(rules, update):
    """
    if the update violates a rule, swap the positions of the offending pages and reevaluate.
    do this until no swaps are made, meaning the ordering is compliant now.
    """
    idx = 0
    changed = True
    while changed:
        idx += 1
        changed = False
        for rule in rules:
            if rule[0] in update and rule[1] in update:
                a = update.index(rule[1])
                b = update.index(rule[0])
                if a < b:
                    changed = True
                    tmp = update[a]
                    update[a] = update[b]
                    update[b] = tmp
    return idx > 1


total = 0
for update in updates:
    if resolve(rules, update):
        total += update[len(update) // 2]

print(total)
