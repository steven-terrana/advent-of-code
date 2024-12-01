import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import LinearSegmentedColormap

import re

class Claim:
    def __init__(self, id, x, y, h, w):
        self.id = id
        self.x = x
        self.y = y
        self.h = h
        self.w = w

    @staticmethod
    def from_string(text):
        # Regular expression to capture the values from the string
        pattern = r"#(\d+) @ (\d+),(\d+): (\d+)x(\d+)"
        match = re.match(pattern, text)
        
        if match:
            id = int(match.group(1))
            x = int(match.group(2))
            y = int(match.group(3))
            h = int(match.group(4))
            w = int(match.group(5))
            return Claim(id, x, y, h, w)
        else:
            raise ValueError("Invalid input string format")

    def __repr__(self):
        return f"Claim(id={self.id}, x={self.x}, y={self.y}, h={self.h}, w={self.w})"

def plot_heatmap(fabric):
    data = np.array(fabric)

    # Create a custom colormap: white for 0, dark red for higher numbers
    colors = [(1, 1, 1), (0.5, 0, 0)]  # RGB for white and dark red
    cmap = LinearSegmentedColormap.from_list('custom_red', colors, N=256)

    # Create a heatmap using imshow()
    plt.imshow(data, cmap=cmap, interpolation='nearest')

    # Add color bar to represent the color scale
    plt.colorbar()

    # Optionally add labels, titles, etc.
    plt.title("2D Heatmap")
    plt.xlabel("X axis")
    plt.ylabel("Y axis")

    # Show the plot
    plt.show()

def main():
    claims = []
    with open('input.txt', 'r') as file:
        for c in file.read().split('\n'):
            claims.append(Claim.from_string(c))

    fabric = np.zeros((1001,1001), dtype=int)

    for claim in claims:
        for y in range(claim.y, claim.y + claim.w):
            for x in range(claim.x, claim.x + claim.h):
                try:
                    fabric[x][y] += 1
                except:
                    print(claim, x, y)
    count = 0
    for row in fabric:
        for cell in row: 
            if cell > 1:
                count += 1
    
    print(count)
    
    plot_heatmap(fabric)

    
    
if __name__ == "__main__": 
    main()