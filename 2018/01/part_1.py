with open('input.txt', 'r') as file:
    frequency_changes = file.read().strip().split('\n')

frequency = 0
for change in frequency_changes:
    frequency += int(change)

print(frequency)