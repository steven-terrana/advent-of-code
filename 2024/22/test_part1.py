from part1 import mix, prune, evolve, predict
import pytest


def test_mix_42_15():
    assert mix(42, 15) == 37


def test_prune_100000000():
    assert prune(100000000) == 16113920


def test_123_next_10():
    expected = [
        15887950,
        16495136,
        527345,
        704524,
        1553684,
        12683156,
        11100544,
        12249484,
        7753432,
        5908254,
    ]
    s = 123
    for i in range(10):
        s = evolve(s)
        assert expected[i] == s


@pytest.mark.parametrize(
    "initial,output",
    [
        (1, 8685429),
        (10, 4700978),
        (100, 15273692),
        (2024, 8667524),
    ],
)
def test_predict(initial, output):
    assert predict(initial, 2000) == output
