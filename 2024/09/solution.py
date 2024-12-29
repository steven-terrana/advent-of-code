from sortedcontainers import SortedDict, SortedList


class Interval:
    def __init__(self, start, end):
        if start >= end:
            raise ValueError("interval start Must be less than interval end")
        self.start = start
        self.end = end

    def __eq__(self, other):
        return self.start == other.start and self.end == other.end

    def __lt__(self, other):
        starts_sooner = self.start < other.start
        is_shorter = self.start == other.start and self.end < other.end
        return starts_sooner or is_shorter


class Empty(Interval):
    pass


class File(Interval):
    def __init__(self, start, end, id):
        super().__init__(start, end)
        self.id = id


class FileSystem:
    def __init__(self):
        self.empty_intervals = SortedDict()
        self.file_intervals = SortedDict()

    def remove_interval(self, i):
        if isinstance(i, File):
            del self.file_intervals[i.start]
        else:
            del self.empty_intervals[i.start]

    def add_interval(self, i: Interval):
        if isinstance(i, File):
            self.file_intervals[i.start] = i
        else:
            self.empty_intervals[i.start] = i

    def print(self):
        fs = ""
        intervals = SortedList()
        intervals.update(self.empty_intervals.values())
        intervals.update(self.file_intervals.values())
        for i in intervals:
            symbol = str(i.id) if hasattr(i, "id") else "."
            fs += symbol * (i.end - i.start)
        print(fs)

    def get_first_empty(self):
        first_key = self.empty_intervals.peekitem(0)[0]
        return self.empty_intervals[first_key]

    def get_last_file(self):
        last_key = self.file_intervals.peekitem(-1)[0]
        return self.file_intervals[last_key]

    def defrag_bitwise(self):
        while True:
            # find first empty interval
            e = self.get_first_empty()
            e_size = e.end - e.start

            # get file at end of the filesystem
            f = self.get_last_file()
            f_size = f.end - f.start

            # if first empty is beyond last file, we're done
            if f.end <= e.start:
                return

            # if empty space remaining match file size then swap
            if e_size == f.end - f.start:
                # remove empty space
                self.remove_interval(e)
                # remove file
                self.remove_interval(f)
                # move file to empty space
                self.add_interval(File(e.start, e.end, f.id))
                # add empty space where the file was
                self.add_interval(Empty(f.start, f.end))

            # if empty space remaining is bigger than file then
            # split the empty space and move the file
            elif e_size > f.end - f.start:
                # remove the empty space
                self.remove_interval(e)
                # remove the file
                self.remove_interval(f)
                # insert the entire file into the beginning of the empty space
                self.add_interval(File(e.start, e.start + f_size, f.id))
                # add back the remaining empty space
                self.add_interval(Empty(e.start + f.end - f.start, e.end))
                # insert empty space where the file used to be
                self.add_interval(Empty(f.start, f.end))

            # if empty space remaining is smaller than the file
            # then fill up the empty space and split the file
            elif e_size < f.end - f.start:
                # remove the empty space
                self.remove_interval(e)
                # remove the file
                self.remove_interval(f)
                # fill up the empty space
                self.add_interval(File(e.start, e.end, f.id))
                # reinsert the remaining file
                self.add_interval(File(f.start, f.end - e_size, f.id))
                # replace the file that moved with empty space
                self.add_interval(Empty(f.end - e_size, f.end))

    def defrag_filewise(self):
        files = list(reversed(self.file_intervals.values()))
        for f in files:
            f_size = f.end - f.start
            for e in self.empty_intervals.values():
                # make sure empty slot is left of file
                if f.start < e.start:
                    break

                e_size = e.end - e.start
                # equal sizes
                if f_size == e_size:
                    # remove empty slot
                    self.remove_interval(e)
                    # remove file
                    self.remove_interval(f)
                    # put file where empty was
                    self.add_interval(File(e.start, e.end, f.id))
                    # put empty where file was
                    self.add_interval(Empty(f.start, f.end))
                    break

                # empty slot is bigger
                elif f_size < e_size:
                    # remove empty slot
                    self.remove_interval(e)
                    # remove file
                    self.remove_interval(f)
                    # put file into empty slot
                    self.add_interval(File(e.start, e.start + f_size, f.id))
                    # add remaining empty slot
                    self.add_interval(Empty(e.start + f_size, e.end))
                    # add empty where file was
                    self.add_interval(Empty(f.start, f.end))
                    break

    def checksum(self):
        return sum(
            [
                int(f.id * ((f.end - f.start) / 2 * (f.start + f.end - 1)))
                for f in self.file_intervals.values()
            ]
        )

    @staticmethod
    def parse(input_text: str):
        fs = FileSystem()
        id = 0
        pos = 0
        for i in range(0, len(input_text), 2):
            size = int(input_text[i])
            fs.add_interval(File(pos, pos + size, id))
            pos += size
            if i + 1 < len(input_text):
                size = int(input_text[i + 1])
                if size > 0:
                    fs.add_interval(Empty(pos, pos + size))
                    pos += size
            id += 1
        return fs


def main(input_text: str):
    # fs_a = FileSystem.parse(input_text)
    # fs = FileSystem.parse("2333133121414131402")
    fs = FileSystem.parse(input_text)
    fs.defrag_bitwise()
    print("Part 1:", fs.checksum())

    # fs = FileSystem.parse("2333133121414131402")
    fs = FileSystem.parse(input_text)
    fs.defrag_filewise()
    print("Part 2:", fs.checksum())


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
        + f"execution time: {end_time - start_time:.3f} seconds"
        + Style.RESET_ALL
    )
