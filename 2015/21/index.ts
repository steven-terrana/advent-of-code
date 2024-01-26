import shop from './shop.txt'

interface Item {
    name: string
    cost: number
    damage: number
    armor: number
}

class Shop{
    weapons: Item[]
    armor: Item[]
    rings: Item[]

    constructor(...categories: Item[][]){
        this.weapons = categories[0]
        this.armor = categories[1]
        this.rings = categories[2]
    }

    static parse(){
        let categories: Item[][] = []
        shop.split('\n\n').map( category => {
            let items: Item[] = []
            category.split('\n').slice(1).forEach(item => {
                let regex = /(?<name>[^\s]+(\s[^s]*)?)\s+(?<cost>\d+)\s+(?<damage>\d+)\s+(?<armor>\d+)/g
                let attributes = Array.from(item.matchAll(regex)).map(m => m.groups)[0]
                items.push({
                    name: attributes?.name.trim()!,
                    cost: parseInt(attributes?.cost!),
                    damage: parseInt(attributes?.damage!),
                    armor: parseInt(attributes?.armor!)
                })
            })
            categories.push(items)
        })
        return new Shop(...categories)
    }
}

interface InventoryConfig {
    weapon: {
        min: number
        max: number
    },
    armor: {
        min: number
        max: number
    },
    rings: {
        min: number
        max: number
    }
}

class Inventory {
    totalCost: number = 0
    weapons: Item[]
    armor:  Item[]
    rings:  Item[]
    
    calculateCost(){
        let items = [this.weapons, this.armor, this.rings].flat()
        let cost = 0
        for (let item of items){
            cost += item.cost
        }
        return cost
    }
}

interface PlayerProps {
    inventory: Inventory
    gold: number 
    hitPoints: number 
    damage?: number 
    armor?: number
}

class Player{
    inventory?: Inventory
    gold: number = Infinity
    hitPoints: number = 100
    damage: number = 0
    armor: number = 0

    constructor({inventory, gold, hitPoints, damage, armor}: PlayerProps){
        if(inventory){
            this.inventory = inventory
        }
        if(gold){
            this.gold=gold
        }
        if(hitPoints){
            this.hitPoints=hitPoints
        }
        if(damage){
            this.damage=damage
        }
        if(armor){
            this.armor=armor
        }
    }

    setInventory(i: Inventory){
        this.inventory = i
        let damage = 0
        let armor = 0
        let items = [i.weapons, i.armor, i.rings].flat()
        items.forEach(item => {
            damage += item.damage
            armor += item.armor
        })
        this.damage = damage
        this.armor = armor
    }

    possibleInventories(shop: Shop, i: InventoryConfig): Inventory[] {
        const getCombinations = function(items: Item[], N: number): Item[][] {
            let allOptions: Item[][] = []
            const fn = function(items: Item[], remaining: Item[]){
                if (items.length == N){
                    allOptions.push(items)
                    return 
                }
                for(let i = 0; i < remaining.length; i++){
                    let newI = items.slice()
                    let x = remaining[i]
                    let newR = remaining.filter(r => r.name != x.name)
                    newI.push(x)
                    fn(newI, newR)
                }
                    
            }
            fn([], items)
            return allOptions
        }

        let inventories: Inventory[] = []
        // choose weapon
        for(let w = i.weapon.min; w <= i.weapon.max; w++){
            let weaponOptions = getCombinations(shop.weapons, w)
            // choose armor
            for(let a = i.armor.min; a <= i.armor.max; a++){
                let armorOptions = getCombinations(shop.armor, a)
                // choose rings
                for (let r = i.rings.min; r <= i.rings.max; r++){
                    let ringOptions = getCombinations(shop.rings, r)

                    for(let wSelection of weaponOptions){
                        for(let aSelection of armorOptions){
                            for(let rSelection of ringOptions){
                                let i = new Inventory()
                                i.weapons = wSelection
                                i.armor   = aSelection
                                i.rings   = rSelection
                                // make sure we can afford this choice
                                if (i.calculateCost() < this.gold){
                                    inventories.push(i)
                                }
                            }
                        }
                    }

                }
            }
        }

        return inventories
    }

    winsFight(boss: Player){
        let turn = true
        let bossOriginalHealth = boss.hitPoints
        let playerOriginalHealth = this.hitPoints
        while(this.hitPoints > 0 && boss.hitPoints > 0){
            if(turn){
                // console.log(`the player deals ${this.damage} - ${boss.armor} = ${this.damage-boss.armor}; the boss goes down to ${boss.hitPoints - this.damage + boss.armor} hit points`)
                boss.hitPoints -= Math.max(this.damage - boss.armor, 1)
                turn = !turn
            } else {
                // console.log(`the boss deals ${boss.damage} - ${this.armor} = ${boss.damage-this.armor}; the player goes down to ${this.hitPoints - boss.damage + this.armor} hit points`)
                this.hitPoints -= Math.max(boss.damage - this.armor, 1)
                turn = !turn
            }
        }
        let won = this.hitPoints > 0
        this.hitPoints = playerOriginalHealth
        boss.hitPoints = bossOriginalHealth
        return won
    }
}

const iConf: InventoryConfig = {
    weapon: {
        min: 1,
        max: 1
    },
    armor: {
        min: 0,
        max: 1
    },
    rings: {
        min: 0,
        max: 2
    }
}

let boss = new Player({hitPoints: 109, damage: 8, armor: 2} as PlayerProps)
let player = new Player({} as PlayerProps)
let possibleInventories = player.possibleInventories(Shop.parse(), iConf)

let cheapestVictory = Infinity
let mostExpensiveLoss = -Infinity
for(let inventory of possibleInventories){
    player.setInventory(inventory)
    let cost = inventory.calculateCost()
    if(player.winsFight(boss)){
        if (cost < cheapestVictory){
            cheapestVictory = cost
        }
    } else {
        if (cost > mostExpensiveLoss){
            mostExpensiveLoss = cost
        }
    }
}

console.log('Part 1:', cheapestVictory)
console.log('Part 2:', mostExpensiveLoss)