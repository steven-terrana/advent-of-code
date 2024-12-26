import networkx as nx
from colorama import Fore


def parse(input: str):
    inputs, gates = input.split("\n\n")

    circuit = nx.DiGraph()

    for input in inputs.split("\n"):
        name, value = [v for v in input.split(": ")]
        circuit.add_node(name, value=int(value), type="input", label=name)

    for a, gate_type, b, _, output in [line.split() for line in gates.split("\n")]:
        circuit.add_node(output, type="gate", gate_type=gate_type)
        circuit.add_edge(a, output)
        circuit.add_edge(b, output)

    return circuit


def evaluate_gate(gate_type, inputs):
    if gate_type == "AND":
        return inputs[0] and inputs[1]
    elif gate_type == "OR":
        return inputs[0] or inputs[1]
    elif gate_type == "XOR":
        return inputs[0] ^ inputs[1]
    else:
        raise ValueError(f"Unknown gate type: {gate_type}")


def evaluate_circuit(circuit):
    if not nx.is_directed_acyclic_graph(circuit):
        return None

    for node in nx.topological_sort(circuit):
        if circuit.nodes[node]["type"] == "gate":
            gate_type = circuit.nodes[node]["gate_type"]
            inputs = [circuit.nodes[inp]["value"] for inp in circuit.predecessors(node)]
            circuit.nodes[node]["value"] = evaluate_gate(gate_type, inputs)

    outputs = [node for node in circuit.nodes if node[0] == "z"]
    binary = ""
    for output in sorted(outputs, reverse=True):
        binary += str(circuit.nodes[output]["value"])

    return int(binary, 2)


def main(input: str):
    circuit = parse(input)
    print("Part 1:", evaluate_circuit(circuit))

    ## part 2 was solved by hand


if __name__ == "__main__":
    import cProfile
    import pstats
    import os
    import time
    from colorama import Fore

    with open(f"{os.path.dirname(__file__)}/input.txt", "r") as f:
        input = f.read()

    with cProfile.Profile() as pr:
        start_time = time.time()
        main(input)
        end_time = time.time()
        print(Fore.CYAN + f"execution time: {end_time - start_time:.3f} seconds")

        # Save the profile data to a file
        with open(f"{os.path.dirname(__file__)}/solution.prof", "w") as f:
            stats = pstats.Stats(pr, stream=f)
            stats.strip_dirs()
            stats.sort_stats("cumtime")
            stats.dump_stats(f"{os.path.dirname(__file__)}/solution.prof")
