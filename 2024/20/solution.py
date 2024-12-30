class Maze:
    __slots__ = ("start", "end", "grid", "R", "C")  # Optimize memory usage

    # Predefined directions: Right, Left, Down, Up
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]

    def __init__(self, start, end, grid):
        self.start = start
        self.end = end
        self.grid = grid
        self.R = len(grid)
        self.C = len(grid[0])

    @staticmethod
    def parse(input_str: str):
        """
        Parses the input string to identify the start (S) and end (E) positions,
        and constructs the grid.
        """
        grid = [list(line) for line in input_str.splitlines()]
        start = end = None
        for r, row in enumerate(grid):
            if "S" in row:
                c = row.index("S")
                start = (r, c)
                grid[r][c] = "."  # Replace 'S' with '.' for consistency
            if "E" in row:
                c = row.index("E")
                end = (r, c)
                grid[r][c] = "."  # Replace 'E' with '.' for consistency
            if start and end:
                break  # Stop early if both start and end are found
        return Maze(start, end, grid)

    def traverse_path(self):
        """
        Traverses the unique path from start to end step-by-step.
        Returns two separate lists: rows and cols.
        """
        path_rows = []
        path_cols = []
        visited = set()

        pos = self.start
        path_rows.append(pos[0])
        path_cols.append(pos[1])
        visited.add(pos)

        while pos != self.end:
            r, c = pos
            for dr, dc in Maze.directions:
                nr, nc = r + dr, c + dc
                neighbor = (nr, nc)
                if (
                    0 <= nr < self.R
                    and 0 <= nc < self.C
                    and self.grid[nr][nc] != "#"
                    and neighbor not in visited
                ):
                    path_rows.append(nr)
                    path_cols.append(nc)
                    visited.add(neighbor)
                    pos = neighbor
                    break  # Move to the next position
        return path_rows, path_cols

    def solve(self, cheat_duration, min_savings):
        """
        Counts the number of cheats that save at least `min_savings` picoseconds
        by allowing up to `cheat_duration` wall-passing moves.
        """
        # Traverse the unique path
        rows, cols = self.traverse_path()
        path_len = len(rows)
        total = 0
        D = cheat_duration
        S = min_savings
        R = self.R
        C = self.C
        grid = self.grid

        # Precompute all possible (dr, dc, manhattan) within cheat_duration
        possible_offsets = []
        for dr in range(-D, D + 1):
            abs_dr = dr if dr >= 0 else -dr
            remaining = D - abs_dr
            for dc in range(-remaining, remaining + 1):
                if dr == 0 and dc == 0:
                    continue
                manhattan = abs_dr + (dc if dc >= 0 else -dc)
                if manhattan > D:
                    continue
                possible_offsets.append((dr, dc, manhattan))
        # Convert to tuple for faster access
        possible_offsets = tuple(possible_offsets)

        # Precompute position to index mapping using a 1D list
        path_indices = [-1] * (R * C)
        for j in range(path_len):
            r, c = rows[j], cols[j]
            path_indices[r * C + c] = j

        # Iterate through each position as the start of a cheat
        for i in range(path_len):
            r_i = rows[i]
            c_i = cols[i]
            # Iterate through all possible offsets to find potential cheat end positions
            for dr, dc, manhattan in possible_offsets:
                r_j = r_i + dr
                c_j = c_i + dc
                # Boundary check
                if not (0 <= r_j < R and 0 <= c_j < C):
                    continue
                # Wall check: end position must be on track
                if grid[r_j][c_j] == "#":
                    continue
                # Get j index from path_indices
                j = path_indices[r_j * C + c_j]
                if j == -1 or j <= i:
                    continue
                # Time saved = j - i - manhattan
                time_saved = (j - i) - manhattan
                if time_saved >= S:
                    total += 1

        return total


def main(input_str: str):
    m = Maze.parse(input_str)
    part1 = m.solve(cheat_duration=2, min_savings=100)
    print("Part 1:", part1)
    part2 = m.solve(cheat_duration=20, min_savings=100)
    print("Part 2:", part2)


if __name__ == "__main__":
    import cProfile
    import pstats
    import os
    import time
    from colorama import Fore, Style
    import argparse

    # Create the parser
    parser = argparse.ArgumentParser()

    # Add a flag (boolean argument)
    parser.add_argument(
        "--profile",
        action="store_true",  # Makes the flag act as a boolean
        help="Enable cProfile",
    )

    args = parser.parse_args()

    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        input = f.read()

    if args.profile:
        with cProfile.Profile() as pr:
            start_time = time.time()
            main(input)
            end_time = time.time()

            # Save the profile data to a file
            with open(f"{os.path.dirname(__file__)}/solution.prof", "w") as f:
                stats = pstats.Stats(pr, stream=f)
                stats.strip_dirs()
                stats.sort_stats("cumtime")
                stats.dump_stats(f"{os.path.dirname(__file__)}/solution.prof")
    else:
        start_time = time.time()
        main(input)
        end_time = time.time()

    print(
        Fore.CYAN
        + f"execution time: {end_time - start_time:.5f} seconds"
        + Style.RESET_ALL
    )
