// Define the grammar rules
type Rule = { lhs: string, rhs: string[] };
const grammar: Rule[] = [
    { lhs: 'e', rhs: ['H'] },
    { lhs: 'e', rhs: ['O'] },
    { lhs: 'H', rhs: ['HO'] },
    { lhs: 'H', rhs: ['OH'] },
    { lhs: 'O', rhs: ['HH'] }
];

// Define a state in the Earley parser
class State {
    public rule: Rule;
    public dot: number; // position of the dot in the rule
    public origin: number; // the origin position in the input string

    constructor(rule: Rule, dot: number, origin: number) {
        this.rule = rule;
        this.dot = dot;
        this.origin = origin;
    }

    // Checks if this state is a complete state
    isComplete(): boolean {
        return this.dot >= this.rule.rhs.length;
    }

    // Gets the next symbol after the dot
    nextSymbol(): string | null {
        return this.dot < this.rule.rhs.length ? this.rule.rhs[this.dot] : null;
    }
}

// The Earley parser
class EarleyParser {
    private chart: State[][];

    constructor() {
        this.chart = [];
    }

    parse(input: string): boolean {
        this.chart = Array(input.length + 1).fill(0).map(() => []);

        // Seed with the initial states derived from the start symbol 'e'
        this.addToChart(new State({ lhs: 'e', rhs: ['H'] }, 0, 0), 0);
        this.addToChart(new State({ lhs: 'e', rhs: ['O'] }, 0, 0), 0);

        for (let i = 0; i <= input.length; i++) {
            let states = this.chart[i];
            for (let j = 0; j < states.length; j++) {
                let state = states[j];
                if (!state.isComplete()) {
                    if (grammar.some(r => r.lhs === state.nextSymbol())) {
                        this.predict(state.nextSymbol()!, i);
                    } else if (i < input.length) {
                        this.scan(state, i, input[i]);
                    }
                } else {
                    this.complete(state, i);
                }
            }
        }

        // Check if the input can be derived from the start symbol
        return this.chart[input.length].some(state =>
            state.rule.lhs === 'e' && state.isComplete() && state.origin === 0
        );
    }

    private addToChart(state: State, index: number) {
        if (!this.chart[index].some(s =>
            s.rule.lhs === state.rule.lhs &&
            s.rule.rhs.join('') === state.rule.rhs.join('') &&
            s.dot === state.dot &&
            s.origin === state.origin
        )) {
            this.chart[index].push(state);
        }
    }

    private predict(symbol: string, index: number) {
        grammar.filter(rule => rule.lhs === symbol).forEach(rule => {
            this.addToChart(new State(rule, 0, index), index);
        });
    }

    private scan(state: State, index: number, symbol: string) {
        if (symbol === state.nextSymbol()) {
            this.addToChart(new State(state.rule, state.dot + 1, state.origin), index + 1);
        }
    }

    private complete(completedState: State, index: number) {
        this.chart[completedState.origin].forEach(state => {
            if (state.nextSymbol() === completedState.rule.lhs) {
                this.addToChart(new State(state.rule, state.dot + 1, state.origin), index);
            }
        });
    }
}

// Example usage
const parser = new EarleyParser();
const input = "HOH"; // example input
console.log(parser.parse(input)); // outputs true if the input is a valid sentence, false otherwise
