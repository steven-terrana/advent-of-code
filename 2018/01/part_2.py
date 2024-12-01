with open('input.txt', 'r') as file:
    frequency_changes = file.read().strip().split('\n')

frequency = 0
frequencies = set([frequency])
while True:
    for change in frequency_changes:
        frequency += int(change)
        if frequency in frequencies:
            print(frequency)
            exit(0)
        frequencies.add(frequency)