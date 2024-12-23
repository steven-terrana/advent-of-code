def is_safe(report: list[int]) -> bool:
    is_ascending = True
    is_descending = True
    for i in range(len(report) - 1):
        # ensure report is either entirely ascending or
        # entirely descending
        if report[i] >= report[i + 1]:
            is_ascending = False
        if report[i] <= report[i + 1]:
            is_descending = False
        if not is_ascending and not is_descending:
            return False
        # ensure the gap between items is small enough
        if not -3 <= (report[i] - report[i + 1]) <= 3:
            return False
    return True


def part1(reports: list[list[int]]) -> int:
    return len([r for r in reports if is_safe(r)])


def part2(reports: list[list[int]]) -> int:
    safe = 0
    for report in reports:
        for idx in range(len(report)):
            newReport = report.copy()
            del newReport[idx]
            if is_safe(newReport):
                safe += 1
                break
    return safe


def main(input: str):
    reports: list[list[int]] = [
        [int(level) for level in report.split()] for report in input.split("\n")
    ]
    print(part1(reports))
    print(part2(reports))
