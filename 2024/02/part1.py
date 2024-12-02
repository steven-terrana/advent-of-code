input = open("input.txt", "r").read()

reports = [[int(n) for n in line.split()] for line in input.split("\n")]


def isDirectional(report):
    is_ascending = all([report[i] < report[i + 1] for i in range(len(report) - 1)])
    is_descending = all([report[i] > report[i + 1] for i in range(len(report) - 1)])
    return is_ascending or is_descending


def isProximal(report):
    proximities = [abs(report[i] - report[i + 1]) for i in range(len(report) - 1)]
    isSafe = all([1 <= p and p <= 3 for p in proximities])
    if isSafe:
        return True


safe = 0
for report in reports:
    directional = isDirectional(report)
    proximal = isProximal(report)
    if directional and proximal:
        safe = safe + 1

print(safe)
