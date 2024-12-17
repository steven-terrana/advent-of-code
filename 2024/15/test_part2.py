from part2 import (
    get_position,
    can_move_left,
    can_move_right,
    can_move_up,
    can_move_down,
    move_left,
    move_right,
    move_up,
)


class TestCanMoveLeft:
    def test_one_box(self):
        map = [list("..[]@")]
        pos = get_position(map)
        assert can_move_left(map, pos)

    def test_two_boxes(self):
        map = [list("..[][]@")]
        pos = get_position(map)
        assert can_move_left(map, pos)

    def test_two_empty(self):
        map = [list("..@")]
        pos = get_position(map)
        assert can_move_left(map, pos)

    def test_wall_empty(self):
        map = [list("#.@")]
        pos = get_position(map)
        assert can_move_left(map, pos)

    def test_wall(self):
        map = [list("..#@")]
        pos = get_position(map)
        assert not can_move_left(map, pos)

    def test_no_space(self):
        map = [list("#.[]@")]
        pos = get_position(map)
        assert can_move_left(map, pos)

    def test_against_wal(self):
        map = [list("##[]@")]
        pos = get_position(map)
        assert not can_move_left(map, pos)


class TestMoveLeft:
    def test_one_box(self):
        map = [list("..[]@")]
        pos = get_position(map)
        move_left(map, pos)
        assert map == [list(".[]@.")]

    def test_two_boxes(self):
        map = [list("..[][]@")]
        pos = get_position(map)
        move_left(map, pos)
        assert map == [list(".[][]@.")]

    def test_two_empty(self):
        map = [list("..@")]
        pos = get_position(map)
        move_left(map, pos)
        assert map == [list(".@.")]

    def test_wall_empty(self):
        map = [list("#.@")]
        pos = get_position(map)
        move_left(map, pos)
        assert map == [list("#@.")]

    def test_no_space(self):
        map = [list("#.[]@")]
        pos = get_position(map)
        move_left(map, pos)
        assert map == [list("#[]@.")]

    def test_against_wal(self):
        map = [list("##[]@")]
        pos = get_position(map)
        assert not can_move_left(map, pos)


class TestCanMoveRight:
    def test_one_box(self):
        map = [list("@[]..#")]
        pos = get_position(map)
        assert can_move_right(map, pos)

    def test_two_boxes(self):
        map = [list("@[][]..#")]
        pos = get_position(map)
        assert can_move_right(map, pos)

    def test_two_empty(self):
        map = [list("@..#")]
        pos = get_position(map)
        assert can_move_right(map, pos)

    def test_wall_empty(self):
        map = [list("@.#")]
        pos = get_position(map)
        assert can_move_right(map, pos)

    def test_wall(self):
        map = [list("@#..")]
        pos = get_position(map)
        assert not can_move_right(map, pos)

    def test_no_space(self):
        map = [list("@[].#")]
        pos = get_position(map)
        assert can_move_right(map, pos)

    def test_against_wal(self):
        map = [list("@[]##")]
        pos = get_position(map)
        assert not can_move_right(map, pos)


class TestMoveRight:
    def test_one_box(self):
        map = [list("@[]..#")]
        pos = get_position(map)
        move_right(map, pos)
        assert map == [list(".@[].#")]

    def test_two_boxes(self):
        map = [list("@[][]..#")]
        pos = get_position(map)
        move_right(map, pos)
        assert map == [list(".@[][].#")]

    def test_two_empty(self):
        map = [list("@..#")]
        pos = get_position(map)
        move_right(map, pos)
        assert map == [list(".@.#")]

    def test_wall_empty(self):
        map = [list("@.#")]
        pos = get_position(map)
        move_right(map, pos)
        assert map == [list(".@#")]

    def test_no_space(self):
        map = [list("@[].#")]
        pos = get_position(map)
        move_right(map, pos)
        assert map == [list(".@[]#")]


class TestCanMoveUp:
    def test_one(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##......[]..##",
                    "##......@...##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert can_move_up(input, pos)

    def test_two(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert can_move_up(input, pos)

    def test_three(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##.......#..##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert not can_move_up(input, pos)

    def test_four(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##......#...##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert not can_move_up(input, pos)

    def test_five(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##......[]..##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert can_move_up(input, pos)

    def test_six(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##.....[]...##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert can_move_up(input, pos)

    def test_7(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##.......[].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert can_move_up(input, pos)

    def test_8(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert can_move_up(input, pos)

    def test_9(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##..........##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert can_move_up(input, pos)

    def test_9b(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##....#.....##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert not can_move_up(input, pos)

    def test_10(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##..........##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##..........##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert can_move_up(input, pos)

    def test_11(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##..........##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##.......#..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        assert not can_move_up(input, pos)


class TestMoveUp:
    def test_one(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##......[]..##",
                    "##......@...##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        move_up(input, pos)
        assert input == list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##......[]..##",
                    "##......@...##",
                    "##..........##",
                    "##..........##",
                    "##############",
                ],
            )
        )

    def test_two(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        move_up(input, pos)
        assert input == list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##..........##",
                    "##############",
                ],
            )
        )

    def test_five(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##......[]..##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        move_up(input, pos)
        assert input == list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##......[]..##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )

    def test_six(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##.....[]...##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        move_up(input, pos)
        assert input == list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##.....[]...##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )

    def test_7(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##.......[].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        move_up(input, pos)
        assert input == list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##.......[].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )

    def test_8(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        move_up(input, pos)
        assert input == list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )

    def test_9(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##..........##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        move_up(input, pos)
        assert input == list(
            map(
                list,
                [
                    "##############",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )

    def test_10(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##..........##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##..........##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        pos = get_position(input)
        move_up(input, pos)
        assert input == list(
            map(
                list,
                [
                    "##############",
                    "##..........##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )


class TestCanMoveDown:
    def test_one(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##......[]..##",
                    "##......@...##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert can_move_down(input, pos)

    def test_two(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert can_move_down(input, pos)

    def test_three(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##.......#..##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert not can_move_down(input, pos)

    def test_four(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##......#...##",
                    "##......[]..##",
                    "##.......@..##",
                    "##..........##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert not can_move_down(input, pos)

    def test_five(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##......[]..##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert can_move_down(input, pos)

    def test_six(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##.....[]...##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert can_move_down(input, pos)

    def test_7(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##.......[].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert can_move_down(input, pos)

    def test_8(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##......##..##",
                    "##..........##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert can_move_down(input, pos)

    def test_9(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##..........##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert can_move_down(input, pos)

    def test_9b(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##....#.....##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##......[]..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert not can_move_down(input, pos)

    def test_10(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##..........##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##..........##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert can_move_down(input, pos)

    def test_11(self):
        input = list(
            map(
                list,
                [
                    "##############",
                    "##..........##",
                    "##....[][][]##",
                    "##.....[][].##",
                    "##.......#..##",
                    "##.......@..##",
                    "##############",
                ],
            )
        )
        input.reverse()
        pos = get_position(input)
        assert not can_move_down(input, pos)
