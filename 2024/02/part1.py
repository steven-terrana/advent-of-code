with open("input.txt", "r") as file:
    input = file.read()

reports = [[int(level) for level in report.split()] for report in input.split("\n")]


def is_directional(report):
    """Check if the report is strictly ascending or descending."""
    is_ascending = all([report[i] < report[i + 1] for i in range(len(report) - 1)])
    is_descending = all([report[i] > report[i + 1] for i in range(len(report) - 1)])
    return is_ascending or is_descending


def is_proximal(report):
    """Check if the absolute differences between consecutive elements are within [1, 3]."""
    proximities = [abs(report[i] - report[i + 1]) for i in range(len(report) - 1)]
    return all([1 <= p <= 3 for p in proximities])


safe = 0
for report in reports:
    if is_directional(report) and is_proximal(report):
        safe += 1

print(safe)
