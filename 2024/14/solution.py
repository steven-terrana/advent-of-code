def main(input: str):
    pass


if __name__ == "__main__":
    import cProfile
    import pstats
    import os
    import time
    from colorama import Fore, Style

    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        input = f.read()

    with cProfile.Profile() as pr:
        start_time = time.time()
        main(input)
        end_time = time.time()
        print(
            Fore.CYAN
            + f"execution time: {end_time - start_time:.3f} seconds"
            + Style.RESET_ALL
        )

        # Save the profile data to a file
        with open(f"{os.path.dirname(__file__)}/solution.prof", "w") as f:
            stats = pstats.Stats(pr, stream=f)
            stats.strip_dirs()
            stats.sort_stats("cumtime")
            stats.dump_stats(f"{os.path.dirname(__file__)}/solution.prof")
