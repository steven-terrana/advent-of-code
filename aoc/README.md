# aoc

[![PyPI](https://img.shields.io/pypi/v/aoc.svg)](https://pypi.org/project/aoc/)
[![Changelog](https://img.shields.io/github/v/release/steven-terrana/aoc?include_prereleases&label=changelog)](https://github.com/steven-terrana/aoc/releases)
[![Tests](https://github.com/steven-terrana/aoc/actions/workflows/test.yml/badge.svg)](https://github.com/steven-terrana/aoc/actions/workflows/test.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://github.com/steven-terrana/aoc/blob/master/LICENSE)

Advent of Code CLI

## Installation

Install this tool using `pip`:
```bash
pip install aoc
```
## Usage

For help, run:
```bash
aoc --help
```
You can also use:
```bash
python -m aoc --help
```
## Development

To contribute to this tool, first checkout the code. Then create a new virtual environment:
```bash
cd aoc
python -m venv venv
source venv/bin/activate
```
Now install the dependencies and test dependencies:
```bash
pip install -e '.[test]'
```
To run the tests:
```bash
python -m pytest
```
