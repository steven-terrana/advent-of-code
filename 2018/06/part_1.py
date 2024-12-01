import math

def get_coordinates():
    """parse the grid to return the coordinates of the letters"""
    coordinates = []
    lines = [ list(line.strip()) for line in open('input.txt', 'r').read().split('\n') ]
    for r, line in enumerate(lines):
        for c, letter in enumerate(line):
            if letter.isalpha(): coordinates.append((c,r))
    return coordinates

def polar_angle(p0, p1):
    """Calculate the polar angle (in radians) between point p0 and p1."""
    y_span = p1[1] - p0[1]
    x_span = p1[0] - p0[0]
    return math.atan2(y_span, x_span)

def distance(p0, p1):
    """Calculate the Euclidean distance between point p0 and p1."""
    return (p1[0] - p0[0]) ** 2 + (p1[1] - p0[1]) ** 2

def cross_product_orientation(p0, p1, p2):
    """Return the cross product of vector p0p1 and vector p0p2 to check orientation."""
    return (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0])

def convex_hull(coords):
    """Return the vertices of the convex hull for a set of 2D points."""
    # Step 1: Find the point with the lowest y-coordinate (and the leftmost if tied)
    start = min(coords, key=lambda p: (p[1], p[0]))
    
    # Step 2: Sort the points by polar angle with respect to the start point
    sorted_points = sorted(coords, key=lambda p: (polar_angle(start, p), -distance(start, p)))
    
    # Step 3: Initialize the convex hull stack
    hull = [start]
    
    for point in sorted_points[1:]:
        # Ensure we always make a "left turn" or a "straight line" (counterclockwise)
        while len(hull) > 1 and cross_product_orientation(hull[-2], hull[-1], point) <= 0:
            hull.pop()  # Remove the last point if we make a right turn
        hull.append(point)
    
    return hull


cache = {}

def calculate_area(coord, coords):
    area = 1
    print(cache)

    while True:
        break
    return area
    

coords = get_coordinates()
vertices = convex_hull(coords)

calculate_area(coords[0], coords)