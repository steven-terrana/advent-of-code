import matplotlib.pyplot as plt
import matplotlib.animation as animation

# List of tuples as (x, y) coordinates
coordinates = [(1, 1), (2, 3), (3, 6), (4, 4), (5, 2), (6, 3), (7, 5), (8, 7)]

# Unpack the coordinates for plotting
x_coords, y_coords = zip(*coordinates)

# Create the figure and axis
fig, ax = plt.subplots()
ax.set_xlim(min(x_coords) - 1, max(x_coords) + 1)
ax.set_ylim(min(y_coords) - 1, max(y_coords) + 1)

# Initialize the point
(point,) = ax.plot([], [], "ro", label="Moving Point")  # 'ro' for red dot
ax.legend()


def update(frame):
    point.set_data([coordinates[frame][0]], [coordinates[frame][1]])
    point.set_label(f"frame {frame}")
    return (point,)


ani = animation.FuncAnimation(
    fig, update, frames=len(coordinates), interval=500, blit=True
)

# Show the animation
plt.show()
