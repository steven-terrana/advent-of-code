from pydantic import BaseModel, PositiveInt
from typing import List
from datetime import datetime, timedelta
import re

input = open('test.txt', 'r').read().split('\n')

class Shift(BaseModel):
    guard: PositiveInt
    timestamps: List[datetime]

    def calculateTimeAsleep(self):
        awake = False
        previousTime = self.timestamps[0]
        timeAsleep = timedelta()
        for time in self.timestamps[1:]:
            if awake:
                timeAsleep += time - previousTime
            previousTime = time
            awake = not awake
        return timeAsleep

# pattern to parse info from input
pattern = r"\[(\d+)-(\d+)-(\d+) (\d+):(\d+)\](?: Guard #(\d+))?"

# build an array of shifts
shifts = []
for line in input:
    matches = re.findall(pattern, line)[0]
    year = int(matches[0])
    month = int(matches[1])
    day = int(matches[2])
    hour = int(matches[3])
    minute = int(matches[4])
    try:
        guard = int(matches[5])
    except:
        guard = None
    d = datetime(year, month, day, hour, minute)

    if "Guard" in line:
        shifts.append(Shift(guard = guard, timestamps=[d]))
    else:
        shifts[-1].timestamps.append(d)

# create a dictionary<guard id, total time asleep>
guards = {}
for shift in shifts:
    if shift.guard not in guards:
        guards[shift.guard] = timedelta()
    guards[shift.guard] += shift.calculateTimeAsleep()

print(guards)

# determine the guard who slept the longest
max_asleep_time = max(guards.values())
guard_id = [id for id, asleep in guards.items() if asleep == max_asleep_time][0]
print(guard_id)

# find the earliest start time and the latest end time
sleepy_guard_shifts = [ s for s in shifts if s.guard == guard_id ]

sleep_minute_count = [0] * 60
for s in sleepy_guard_shifts:
    t_idx = 0
    awake = False
    for minute in range(60):
        if t_idx < len(s.timestamps):
            if minute == s.timestamps[t_idx].minute:
                awake = not awake
                t_idx += 1
        if not awake:
            sleep_minute_count[minute] = sleep_minute_count[minute] + 1

print(sleep_minute_count.index(max(sleep_minute_count)))