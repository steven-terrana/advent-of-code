with open("input.txt", "r") as file:
    input = file.read()


(rules, updates) = input.split("\n\n")

rules = rules.split("\n")
rules = [[int(n) for n in r.split("|")] for r in rules]
updates = updates.split("\n")
updates = [[int(n) for n in u.split(",")] for u in updates]


def evaluate(rules, update):
    for rule in rules:
        if rule[0] in update and rule[1] in update:
            if update.index(rule[1]) < update.index(rule[0]):
                return False
    return True


total = 0
for update in updates:
    if evaluate(rules, update):
        total += update[len(update) // 2]

print(total)
