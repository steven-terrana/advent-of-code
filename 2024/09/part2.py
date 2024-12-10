import os
from dataclasses import dataclass


class Filesystem:
    def __init__(self, inodes):
        self.inodes = inodes

    def checksum(self):
        checksum = 0
        idx = 0
        for i in self.inodes:
            for _ in range(i.size):
                if isinstance(i, File):
                    checksum += idx * i.id
                idx += 1
        return checksum

    def defrag(self):
        # work through files in reverse order
        ids = [f.id for f in self.inodes if isinstance(f, File)]
        ids.reverse()
        for id in ids:
            # get file index and file object
            f_idx = None
            file = None
            for idx, f in enumerate(self.inodes):
                if isinstance(f, File):
                    if f.id == id:
                        f_idx = idx
                        file = f
                        break
            # look for an empty space that will fit the given file
            e_idx = None
            space = None
            for idx, e in enumerate(self.inodes):
                # we are shifting left, so empty spaces to the
                # right of the file dont help
                if idx > f_idx:
                    break
                if isinstance(e, EmptySpace) and e.size >= file.size:
                    e_idx = idx
                    space = e
                    break
            # if no empty space will work, move on
            if e_idx is None:
                continue
            # move the file to the new location and create a new
            # empty space if there is room left over
            self.inodes[f_idx] = EmptySpace(size=file.size)
            del self.inodes[e_idx]  # remove the current empty space
            self.inodes.insert(e_idx, file)
            if space.size > file.size:
                self.inodes.insert(e_idx + 1, EmptySpace(size=space.size - file.size))

    def to_string(self):
        msg = []
        for i in self.inodes:
            for _ in range(i.size):
                if isinstance(i, File):
                    msg.append(str(i.id))
                if isinstance(i, EmptySpace):
                    msg.append(".")
        return "".join(msg)

    @staticmethod
    def parse(input):
        chunks = [
            [int(n) for n in list(input[i : i + 2])] for i in range(0, len(input), 2)
        ]
        inodes = []
        for id, c in enumerate(chunks):
            inodes.append(File(id=id, size=c[0]))
            if len(c) > 1:
                inodes.append(EmptySpace(size=c[1]))
        return Filesystem(inodes)


@dataclass
class File:
    """represents a file and its position in the filesystem"""

    id: int
    size: int


@dataclass
class EmptySpace:
    """represents empty space on the filesystem"""

    size: int


with open(f"{os.path.dirname(__file__)}/input.txt", "r") as file:
    input = file.read()

filesystem = Filesystem.parse(input)
filesystem.defrag()
print(filesystem.checksum())
