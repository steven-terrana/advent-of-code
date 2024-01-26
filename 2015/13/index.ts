import input from './input.txt'

type Guest = string
type Happiness = number
type HappinessMatrix = Map<Guest, Map<Guest, Happiness>>

function getPreferences(): HappinessMatrix{
    let preferences: HappinessMatrix = new Map<Guest, Map<Guest, Happiness>>
    for (let line of input.split('\n')){
        let parts = line.split(' ')
        let A = parts[0] as Guest
        let B = parts[parts.length - 1].slice(0,-1) as Guest // removes . from end
        let M = parts[2] == 'gain' ? 1 : -1
        let happiness = M * parseInt(parts[3]) as Happiness
        if (!preferences.has(A)){
            preferences.set(A, new Map<Guest,Happiness>)
        }
        preferences.get(A)?.set(B, happiness)
    }
    return preferences
}

function addSelfToPreferences(preferences: HappinessMatrix) {
    let guests = Array.from(preferences.keys())
    preferences.set('self', new Map<Guest, Happiness>)
    for (let guest of guests){
        preferences.get('self')?.set(guest, 0)
        preferences.get(guest)?.set('self', 0)
    }
}

function evaluateHappiness(chart: Guest[], preferences: HappinessMatrix){
    let happiness = 0
    const netHappiness = (A: Guest, B: Guest) => {
        return preferences.get(A)?.get(B)! + preferences.get(B)?.get(A)!
    }
    for (let i = 1; i < chart.length; i++){
        let A = chart[i-1]
        let B = chart[i]
        happiness += netHappiness(A,B)
    }
    let A = chart[0]
    let B = chart[chart.length - 1]
    happiness += netHappiness(A,B)
    return happiness
}

function arrange(preferences: HappinessMatrix, chart: Guest[], remaining: Guest[]){
    let options = remaining.filter(guest => !chart.includes(guest))
    if (options.length == 0){
        const h = evaluateHappiness(chart, preferences)
        if (h > best){
            best = h
        }
        return
    }
    // try all possible options steps
    for (let guest of options){
        let c: Guest[] = [...chart, guest]
        let r: Guest[] = options.filter( c => c != guest)
        arrange(preferences, c, r)
    }
}

const preferences = getPreferences()

let best = -Infinity
arrange(preferences, [], Array.from(preferences.keys()))
console.log('Part 1:', best)

best = -Infinity
addSelfToPreferences(preferences)
arrange(preferences, [], Array.from(preferences.keys()))
console.log('Part 2:', best)