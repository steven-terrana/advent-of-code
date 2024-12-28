import click
import os
import time
import importlib.util
from pathlib import Path
from typing import Iterator
import sys
from contextlib import redirect_stdout, contextmanager
from io import StringIO
from colorama import Fore, Style
from rich.console import Console
from rich.panel import Panel
from rich.columns import Columns


@contextmanager
def suppress_stdout():
    """Context manager to suppress stdout temporarily."""
    original_stdout = sys.stdout
    sys.stdout = StringIO()  # Redirect to a dummy buffer
    try:
        yield
    finally:
        sys.stdout = original_stdout


def find_solution_files(directory: Path) -> Iterator[Path]:
    """Recursively find all solution.py files in the given directory."""
    for path in directory.rglob("solution.py"):
        yield path


def load_module_from_file(file_path):
    """Load a Python module from a file path."""
    spec = importlib.util.spec_from_file_location("solution", file_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def get_input_content(solution_path):
    """Get the contents of input.txt in the same directory as the solution file."""
    input_path = Path(solution_path).parent / "input.txt"
    if not input_path.exists():
        raise click.ClickException(f"No input.txt found at {input_path}")

    return input_path.read_text().strip()


def run_solution(solution_path: Path) -> float:
    """Run a single solution and return its execution time."""
    try:
        # Load the solution module
        solution = load_module_from_file(solution_path)

        # Check if main function exists
        if not hasattr(solution, "main"):
            click.echo(f"Skipping {solution_path}: no main function found")
            return 0

        # Get input content
        input_content = get_input_content(solution_path)

        # Time the solution while capturing stdout
        start_time = time.perf_counter()
        with suppress_stdout():
            solution.main(input_content)
        end_time = time.perf_counter()

        execution_time = end_time - start_time
        return execution_time

    except Exception as e:
        click.echo(f"✗ {solution_path.parent.name}: {str(e)}")
        return 0


@click.command()
@click.argument(
    "directory", type=click.Path(exists=True, file_okay=False, dir_okay=True)
)
@click.option("--show-output", is_flag=True, help="Show output from solutions")
def run(directory, show_output):
    """Run all Advent of Code solutions found in the directory and its subdirectories."""
    directory_path = Path(directory)
    solution_files = list(find_solution_files(directory_path))

    if not solution_files:
        raise click.ClickException(f"No solution.py files found in {directory}")

    total_time = 0
    console = Console()

    console.print(Columns(["Day", "Execution Time"]))

    for solution_file in sorted(solution_files):
        execution_time = run_solution(solution_file)
        total_time += execution_time
        color = "green" if execution_time < (1 / 25) else "red"
        symbol = ":heavy_check_mark:" if execution_time < (1 / 25) else "x"
        c = Columns(
            [
                f"[bold white]{solution_file.parent.name}[/bold white]",
                f"[{color}] {symbol} {execution_time:.5f}s[/{color}]",
            ]
        )
        # console.print(f"[bold]{solution_file.parent.name}", f"{execution_time:.5f}s")
        console.print(c)

    console.print(Panel(f"Total execution time: {total_time:.4f}s"))


if __name__ == "__main__":
    run()
