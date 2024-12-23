import os
import click
from dotenv import load_dotenv
import requests
import importlib.util
import cProfile
import pstats

# Load environment variables from .env file if it exists
load_dotenv()


def get_auth_token():
    return os.getenv("AOC_SESSION_TOKEN")


@click.group(invoke_without_command=True)
@click.pass_context
def cli(ctx):
    """Advent of Code CLI"""
    if ctx.invoked_subcommand is None:
        # Default behavior when no command is provided
        execute_solution("current", "input.txt", "solution.prof")


@cli.command(name="create")
@click.argument("day")
def create_new_day(day):
    """Create a new day folder"""
    day_dir = os.path.join(os.getcwd(), day)
    os.makedirs(day_dir, exist_ok=True)

    solution_path = os.path.join(day_dir, "solution.py")
    with open(solution_path, "w") as f:
        f.write("""def main(input: str):\n    pass\n""")

    input_path = os.path.join(day_dir, "input.txt")
    session_token = get_auth_token()
    if session_token:
        headers = {"Cookie": f"session={session_token}"}
        response = requests.get(
            f"https://adventofcode.com/2023/day/{int(day)}/input", headers=headers
        )
        if response.status_code == 200:
            with open(input_path, "w") as f:
                f.write(response.text)
        else:
            print(
                f"Failed to download input for day {day}. Status code: {response.status_code}"
            )
    else:
        print("AOC_SESSION_TOKEN is not set. Cannot download input.")


@cli.command(name="execute")
@click.argument("day")
@click.option("-i", "--input", default="input.txt", help="Input file to use")
@click.option("-p", "--profile", default="solution.prof", help="Profile output file")
@click.option("-d", "--debug", is_flag=True, help="Enable debugging with breakpoints")
def execute_solution(day, input, profile, debug):
    """Execute the solution for a day"""
    if day == "current":
        day_dir = os.getcwd()
    else:
        day_dir = os.path.join(os.getcwd(), day)

    solution_path = os.path.join(day_dir, "solution.py")

    if not os.path.exists(solution_path):
        print(f"Solution file for day {day} does not exist.")
        return

    input_path = os.path.join(day_dir, input)
    if not os.path.exists(input_path):
        print(f"Input file {input} does not exist in day {day} directory.")
        return

    with open(input_path, "r") as f:
        input_data = f.read()

    spec = importlib.util.spec_from_file_location("solution", solution_path)
    solution_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(solution_module)

    if not hasattr(solution_module, "main"):
        print(f"The solution file for day {day} does not have a 'main' function.")
        return

    if debug:
        import pdb

        pdb.set_trace()

    profiler = cProfile.Profile()
    profiler.enable()
    solution_module.main(input_data)
    profiler.disable()

    profile_output_path = os.path.join(day_dir, profile)
    with open(profile_output_path, "w") as f:
        stats = pstats.Stats(profiler, stream=f)
        stats.strip_dirs()
        stats.sort_stats("cumtime")
        stats.dump_stats(profile_output_path)

    print(
        f"Execution and profiling for day {day} completed. Profile saved to {profile}."
    )


if __name__ == "__main__":
    cli()
