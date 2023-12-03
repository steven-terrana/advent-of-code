console.log(
  require('fs').readFileSync('input.txt', 'utf-8').split('\n').map( game => Object.values(Array.from(game.matchAll(new RegExp(/(?<red>\d+(?=\sred))|(?<green>\d+(?=\sgreen))|(?<blue>\d+(?=\sblue))/g))).reduce( (m, n) => {
    return { 
      red: n.groups.red ? Math.max(m.red, Number(n.groups.red)) : m.red, 
      blue: n.groups.blue ? Math.max(m.blue, Number(n.groups.blue)) : m.blue, 
      green: n.groups.green ? Math.max(m.green, Number(n.groups.green)) : m.green
    } 
  }, { red: 0, green: 0, blue: 0 })).reduce( (p, v) => p *= v, 1 )).reduce( (s, v) => s += v, 0)
)