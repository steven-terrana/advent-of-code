def main(input: str):
    monkeys = [int(n) for n in input.splitlines()]

    # will the sum of every monkeys secret number after
    # 2000 new secrets
    part1 = 0

    UNIQUE_SEQUENCES = 19**4  # 130,321 possible 4-delta patterns
    pattern_sums = [0] * UNIQUE_SEQUENCES
    mask = 2**24 - 1

    # Calculate size needed for bitset (rounding up to nearest multiple of 64)
    BITSET_SIZE = (UNIQUE_SEQUENCES + 63) // 64

    for init_secret in monkeys:
        # keep track of if we've seen a given diff sequence before
        # for the current monkey.
        #
        # [ 0000, 0000, 0000, 0000, 0000 ]
        seen_local = [0] * BITSET_SIZE

        s = init_secret
        prev_price = s % 10

        # pack previous 4 deltas into a single integer
        rolling_deltas = 0
        delta_count = 0

        for _ in range(2000):
            s ^= (s << 6) & mask
            s ^= s >> 5
            s ^= (s << 11) & mask
            curr_price = s % 10
            delta = curr_price - prev_price + 9

            if delta_count < 3:
                # Building up initial sequence
                rolling_deltas = (rolling_deltas * 19) + delta
                delta_count += 1
            else:
                # We have a complete sequence
                idx = (rolling_deltas * 19 + delta) % UNIQUE_SEQUENCES
                # Get word and bit position
                word_idx = idx >> 6  # Divide by 64
                bit_pos = idx & 63  # Modulo 64
                mask_bit = 1 << bit_pos
                if not (seen_local[word_idx] & mask_bit):
                    seen_local[word_idx] |= mask_bit  # Set the bit
                    pattern_sums[idx] += curr_price
                # Slide the window by removing oldest delta and adding new one
                rolling_deltas = ((rolling_deltas * 19) + delta) % (19**3)

            prev_price = curr_price

        part1 += s

    print("Part 1:", part1)
    print("Part 2:", max(pattern_sums))


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
