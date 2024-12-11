import os

with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = file.read()

# parse the map, support '.' for testing the examples
map = []
for line in input.split("\n"):
    row = []
    for c in list(line):
        if c == ".":
            row.append(c)
        else:
            row.append(int(c))
    map.append(row)

# steps in the trail can be up/down/left/right
neighbors = [(0, 1), (0, -1), (1, 0), (-1, 0)]
trail_length = 9


def count_trails(r, c):
    """
    Breadth First Search at a given coordinate to the summit
    assumes map[r][c] == 0
    """
    # maintain a queue of potential trail paths to explore
    trails = [[(r, c)]]
    # maintain the discovered trails
    found = []
    # while there are still unexplored trails..
    while len(trails) > 0:
        # explore the trail
        t = trails.pop()
        # check each neighbor to see if its the next summit height
        for n in neighbors:
            tr = t[-1][0] + n[0]
            tc = t[-1][1] + n[1]
            # stay inside the map
            if 0 <= tr < len(map) and 0 <= tc < len(map[0]):
                # permissible steps are up 1 in elevation
                # which conveniently must be the length of the trail
                if map[tr][tc] == len(t):
                    # step exists, so duplicate the trail
                    new_trail = t.copy()
                    new_trail.append((tr, tc))
                    if map[tr][tc] == trail_length:
                        # if we're at the summit, record the path
                        found.append(new_trail)
                    else:
                        # if we're not at the summit, add this to the queue
                        trails.append(new_trail)
    return len(set([p[-1] for p in found]))


score = 0
for r in range(len(map)):
    for c in range(len(map[0])):
        if map[r][c] == 0:
            score += count_trails(r, c)

print(score)
