with open("input.txt", "r") as file:
    input = file.read()


def find_marker(input, size):
    buffer = list(input)
    for i in range(len(buffer) - size - 1):
        window = buffer[i : i + size]
        if len(set(window)) == size:
            return i + size


print(find_marker(input, 4))
print(find_marker(input, 14))
