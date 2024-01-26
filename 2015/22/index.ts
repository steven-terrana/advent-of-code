type Spell = {
    cost: number;
    cast: (player: Wizard, boss: Brute) => void;
}

const spells: { [key: string]: Spell } = {
    magicMissile: {
        cost: 53,
        cast: (player, boss) => {
            player.history.push('Player casts Magic Missle')
            boss.health -= 4; 
        }
    },
    drain: {
        cost: 73,
        cast: (player, boss) => {
            player.history.push('Player casts Drain')
            boss.health -= 2;
            player.health += 2;
        }
    },
    shield: {
        cost: 113,
        cast: (player, boss) => {
            if (player.effects['shield'] > 0) {
                throw new Error("Shield already active");
            }
            player.history.push('Player casts Shield')
            player.effects['shield'] = 6;
        }
    },
    poison: {
        cost: 173,
        cast: (player, boss) => {
            if (boss.effects['poison'] > 0) {
                throw new Error("Poison already active");
            }
            player.history.push('Player casts Poison')
            boss.effects['poison'] = 6;
        }
    },
    recharge: {
        cost: 229,
        cast: (player, boss) => {
            if (player.effects['recharge'] > 0) {
                throw new Error("Recharge already active");
            }
            player.history.push('Player casts Recharge')
            player.effects['recharge'] = 5;
        }
    }
}

class Character {
    health: number
    armor: number = 0
    effects: { [key: string]: number } = {}
}

class Wizard extends Character {
    mana: number = 0
    cost: number = 0
    history: string[] = []
    constructor(data: Partial<Wizard>){
        super()
        Object.assign(this, data)
    }
}

class Brute extends Character {
    damage: number = 0
    constructor(data: Partial<Brute>){
        super()
        Object.assign(this, data)
    }
} 

interface State {
    player: Wizard,
    boss: Brute,
    myTurn: boolean
}

function applyEffects(player: Wizard, boss: Brute){
    // Handle Shield effect
    if (player.effects['shield'] > 0) {
        player.armor = 7
        player.effects['shield']--
        player.history.push(`Shield's timer is now ${player.effects['shield']}`)
        if (player.effects['shield'] === 0) {
            player.armor = 0; // Remove shield effect
            player.history.push('Shield wears off')
        }
    }

    // Handle Recharge effect
    if (player.effects['recharge'] > 0) {
        player.mana += 101;
        player.effects['recharge']--
        player.history.push(`Recharge provides 101 mana; its timer is now ${player.effects['recharge']}`)
        if (player.effects['recharge'] === 0){
            player.history.push('Recharge wears off')
        }
    }

    // Handle Poison effect
    if (boss.effects['poison'] > 0) {
        boss.health -= 3;
        boss.effects['poison']--
        player.history.push(`Poison deals 3 damage. its timer is now ${boss.effects['poison']}`)
        if (player.effects['recharge'] === 0){
            player.history.push('Poison wears off')
        }
    }
}

function simulate(player: Wizard, boss: Brute, mode: 'easy'|'hard'): Wizard{
    let states: State[] = [{
        player: structuredClone(player),
        boss: structuredClone(boss),
        myTurn: true
    }]
    
    let leastCost = Infinity
    let winner: Wizard
    
    while(states.length){
        let {player, boss, myTurn} = states.shift()!
    
        player.history.push(...[
            `-- ${myTurn ? 'Player' : 'Boss'} turn --`,
            `- Player has ${player.health} hit points, ${player.armor} armor, ${player.mana} mana`,
            `- Boss has ${boss.health} hit points`
        ])
    
        if(myTurn){
            if (mode === 'hard'){
                player.health -= 1
                if(player.health <= 0){
                    continue
                }
            }
            for (let s of Object.keys(spells)){
                // clone the state
                let p = structuredClone(player)
                let b = structuredClone(boss)
        
                // PLAYER TURN            
                applyEffects(p, b)
                
                // validate we can cast this spell
                let spell = spells[s]
                if(p.mana < spell.cost || b.effects[s] || p.effects[s]){
                    continue
                }
                
                // player attack
                p.cost += spell.cost
                p.mana -= spell.cost
                spell.cast(p, b)
    
                if (b.health <= 0){
                    if (p.cost < leastCost){
                        leastCost = p.cost
                        winner = p
                    }
                } else if (p.cost + (b.health/4) < leastCost ) {
                    states.push({
                        player: p, 
                        boss: b,
                        myTurn: false
                    })
                }
            }
        } else { 
            // BOSS TURN
            applyEffects(player, boss)
            if (boss.health <= 0){
                if (player.cost < leastCost){
                    leastCost = player.cost
                    winner = player
                }
                continue
            }
            player.health -= Math.max(boss.damage - player.armor, 1)
            player.history.push(`Boss attacks for ${boss.damage} - ${player.armor} = ${Math.max(boss.damage - player.armor, 1)} damage!`)
            if (player.health > 0 && player.cost + (boss.health/4) < leastCost){
                states.push({
                    player: player,
                    boss: boss, 
                    myTurn: true
                })
            }
        }
    }

    return winner!
}

let player = new Wizard({ health: 50, mana: 500 } as Partial<Wizard>)
let boss = new Brute({ health: 58, damage: 9} as Partial<Brute>)

let part1 = simulate(player, boss, 'easy')
// console.log(part1.history.join("\n"))
console.log('Part 1:', part1.cost)

let part2 = simulate(player, boss, 'hard')
// console.log(part2.history.join("\n"))
console.log('Part 2:', part2.cost)