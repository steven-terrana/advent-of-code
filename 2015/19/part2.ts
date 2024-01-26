import input from './input.txt' 

interface ProductionRule {
    left: string
    right: string[]
}

class CFG {
    nonTerminals: Set<string>
    terminals: Set<string>
    productionRules: ProductionRule[];
    
    constructor(nonTerminals: Set<string>, terminals: Set<string>, productionRules: ProductionRule[]) {
        this.nonTerminals = nonTerminals;
        this.terminals = terminals;
        this.productionRules = productionRules;
    }
    
    private removeNullProductions() { /* ... */ }
    private eliminateUnitProductions() { /* ... */ }
    
    private handleMixedProductions() {
        let newRules: ProductionRule[] = []
        const newNonTerminalsMap: Record<string, string> = {}
        
        this.productionRules.forEach(rule => {
            const mixedRule = rule.right.some(symbol => this.terminals.has(symbol) && rule.right.length > 1)
            
            if (mixedRule) {
                let newRight = [...rule.right]
                
                // Replace terminals with new non-terminals
                newRight = newRight.map(symbol => {
                    if (this.terminals.has(symbol)) {
                        if (!newNonTerminalsMap[symbol]) {
                            const newNonTerminal = `NT_${symbol}`;
                            newNonTerminalsMap[symbol] = newNonTerminal;
                            this.nonTerminals.add(newNonTerminal);
                            newRules.push({ left: newNonTerminal, right: [symbol] })
                        }
                        return newNonTerminalsMap[symbol];
                    }
                    return symbol;
                })
                
                newRules.push({ left: rule.left, right: newRight })
            } else {
                newRules.push(rule); // Retain rules that are already in correct form
            }
        })
        
        this.productionRules = newRules;
        
    }
    
    private breakDownLongProductions() {
        let newRules: ProductionRule[] = [];
        
        this.productionRules.forEach(rule => {
            if (rule.right.length > 2) {
                // Break down productions with more than 2 symbols on the right-hand side
                let currentLeft = rule.left
                for (let i = 0; i < rule.right.length - 2; i++) {
                    const newNonTerminal = `NT_${currentLeft}_${i}`
                    newRules.push({ left: currentLeft, right: [rule.right[i], newNonTerminal] })
                    this.nonTerminals.add(newNonTerminal)
                    currentLeft = newNonTerminal
                }
                newRules.push({ left: currentLeft, right: [rule.right[rule.right.length - 2], rule.right[rule.right.length - 1]] })
            } else {
                // Keep productions that are already in CNF
                newRules.push(rule)
            }
        })
        
        this.productionRules = newRules;
    }
    
    convertToCNF() { 
        // Step 1: Remove Null Productions
        this.removeNullProductions()
        
        // Step 2: Eliminate Unit Productions
        this.eliminateUnitProductions()
        
        // Step 3: Handle Mixed Productions
        this.handleMixedProductions()
        
        // Step 4: Break down remaining productions that are not in CNF
        this.breakDownLongProductions()
    }
    
    canGenerate(sentence: string){
        const length = sentence.length;
        let table = Array.from({ length }, () => Array.from({ length }, () => new Set<string>()))
        
        // Step 1: Fill for substrings of length 1
        for (let i = 0; i < length; i++) {
            this.productionRules.forEach(rule => {
                if (rule.right.includes(sentence[i])) {
                    table[0][i].add(rule.left);
                }
            })
        }
        
        // Step 2: Fill for longer substrings
        for (let l = 2; l <= length; l++) { // substring length
            for (let s = 0; s <= length - l; s++) { // substring start
                for (let p = 1; p < l; p++) { // partition position
                    this.productionRules.forEach(rule => {
                        if (rule.right.length === 2 && table[p][s].has(rule.right[0]) && table[l-p][s+p].has(rule.right[1])) {
                            table[l][s].add(rule.left);
                        }
                    })
                }
            }
        }
        
        // Step 3: Check if start symbol can generate the entire string
        return table[length-1][0].has('e')
    }

    static parse(): [CFG, string]{
        let [rawRules, target] = input.split('\n\n')
        
        const allSymbols = new Set<string>()
        const nonTerminals = new Set<string>()
        const terminals = new Set<string>()
        const productionRules: ProductionRule[] = []
        
        const rules = rawRules.split('\n').map(rule => {
            const [left, right] = rule.split(' => ')
            allSymbols.add(left)
            allSymbols.add(right)
            nonTerminals.add(left);
            return {left: left, right: right}
        })
        
        allSymbols.forEach(symbol => {
            if (nonTerminals.has(symbol)) {
                productionRules.push({
                    left: symbol,
                    right: rules.filter( r => r.left == symbol ).map( r => {
                        return r.right
                    })
                })
            } else {
                terminals.add(symbol)
            }
        })
        
        const cfg: CFG = new CFG(nonTerminals, terminals, productionRules)
        return [cfg, target]
    }

}

const [cfg, medicine] = CFG.parse()

cfg.convertToCNF()

console.log('can generate - ', medicine, ':', cfg.canGenerate(medicine))
