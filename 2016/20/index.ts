import input from './input.txt'

type BlockedCIDR = Uint32Array
type Firewall = BlockedCIDR[]

// parse the rules
function parse(): Firewall{
    let rules: Firewall = []
    input.split('\n').forEach(range => {
        let ips = range.split('-').map(ip => parseInt(ip))
        rules.push(new Uint32Array(ips))
    })
    rules.sort((a,b)=>a[0]-b[0])
    return rules
}

// checks if a given cidr range intersects with any
// rule within a group
function intersects(group: Firewall, b: BlockedCIDR){
    for(let a of group){
        // left bound is intersects
        if (b[0] >= a[0] && b[0] <= a[1] + 1){
            return true
        }
        // right bound intersects
        if (b[1] >= a[0] - 1 && b[1] <= a[1]){
            return true
        }
    }
    // nothing intersected
    return false
}

// consolidates the rules into the minimum number required
// to capture the same ranges of blocked IPs
function merge(rules: Firewall): Firewall{
    let original = rules.slice()
    let merged: Firewall = []
    while(original.length > 0){
        let toBeMerged: Firewall = [ original.shift()! ]
        while(original.length > 0 && intersects(toBeMerged, original[0])){
            toBeMerged.push(original.shift()!)
        }
        merged.push(new Uint32Array([
            toBeMerged.map(r => r[0]).reduce( (min, ip) => Math.min(min, ip), Infinity),
            toBeMerged.map(r => r[1]).reduce( (max, ip) => Math.max(max, ip), -Infinity),
        ]))
    }
    return merged
}

let rules = parse()
let firewall = merge(rules)

let minIP = firewall[0][0] != 0 ? 0 : firewall[0][1] + 1
console.log('Part 1:', minIP)

let allowed = firewall.reduce( (allowable, rule) => allowable - (rule[1] - rule[0] + 1), 2**32)
console.log('Part 2:',allowed)