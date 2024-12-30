import click
import time
import importlib.util
from pathlib import Path
from typing import Iterator
import sys
from contextlib import contextmanager
from io import StringIO
from rich.console import Console
import statistics
from rich.console import Console
from rich.table import Table
from rich.progress import (
    Progress,
    BarColumn,
    TimeElapsedColumn,
    TimeRemainingColumn,
    TextColumn,
)


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
        with suppress_stdout():
            start_time = time.perf_counter()
            solution.main(input_content)
            end_time = time.perf_counter()
            return end_time - start_time

    except Exception as e:
        click.echo(f"✗ {solution_path.parent.name}: {str(e)}")
        return 0


@click.command()
@click.argument(
    "directory", type=click.Path(exists=True, file_okay=False, dir_okay=True)
)
@click.option("--show-output", is_flag=True, help="Show output from solutions")
@click.option(
    "-n",
    type=int,
    default=10,
    show_default=True,
    help="Number of runs per solution file.",
)
def run(directory, show_output, n):
    """Run all Advent of Code solutions found in the directory and its subdirectories."""
    directory_path = Path(directory)
    solution_files = list(find_solution_files(directory_path))

    if not solution_files:
        raise click.ClickException(f"No solution.py files found in {directory}")

    total_mean_time = 0
    total_min_time = 0
    total_max_time = 0
    total_runs = len(solution_files) * n
    console = Console()
    table = Table(title=f"Advent of Code - {directory} (n={n})")
    for c in ["Day", "Mean Time", "Min Time", "Max Time", "Std Dev"]:
        table.add_column(c, justify="center")

    progress = Progress(
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        "[progress.percentage]{task.percentage:>3.0f}%",
        "•",
        TimeElapsedColumn(),
        "•",
        TimeRemainingColumn(),
        transient=True,
    )

    with progress:
        task = progress.add_task("Processing solutions...", total=total_runs)
        for solution_file in sorted(solution_files):
            progress.update(
                task,
                description=f"Processing {solution_file.parent.name}...",
                refresh=True,
            )

            results = []
            for _ in range(n):  # Run the solution 'n' times
                run_time = run_solution(solution_file)
                results.append(run_time)
                progress.advance(task, advance=1)

            mean_time = statistics.mean(results)
            min_time = min(results)
            max_time = max(results)
            stdev_time = statistics.stdev(results) if len(results) > 1 else 0.0

            total_mean_time += mean_time
            total_min_time += min_time
            total_max_time += max_time
            color = "green" if mean_time < (1 / 25) else "red"
            symbol = ":heavy_check_mark:" if mean_time < (1 / 25) else "x"
            table.add_row(
                f"[bold white]{solution_file.parent.name}[/bold white]",
                f"[{color}]{symbol} {mean_time:.5f}s[/{color}]",
                f"{min_time:.5f}",
                f"{max_time:.5f}",
                f"{stdev_time:.5f}",
            )
            progress.update(task, advance=1, refresh=True)

    console.print(table)
    summary = Table(title="Summary Data")
    summary.add_column("Total Min Times")
    summary.add_column("Total Mean Times")
    summary.add_column("Total Max Times")
    summary.add_row(
        f"{total_min_time:.5f}",
        f"{total_mean_time:.5f}",
        f"{total_max_time:.5f}",
    )
    console.print(summary)


if __name__ == "__main__":
    run()
