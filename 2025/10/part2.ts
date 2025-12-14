import { solve, equalTo } from "yalps"

class Machine {
  public lights: number[]

  constructor(
    nLights: number,
    public required_lights: Set<number>,
    public buttons: number[][],
    public joltage: number[]
  ) {
    this.required_lights = required_lights
    this.buttons = buttons
    this.joltage = joltage
    this.lights = new Array(nLights).fill(0)
  }

  /**
   * solves for the minimum number of button presses to reach joltage values
   * using Integer Linear Programming
   */
  solve(){
    const variables: Record<string, Record<string, number>> = {}

    // Each button is a variable that contributes:
    // - 1 to the total (what we minimize)
    // - 1 to each light it affects
    for (let b = 0; b < this.buttons.length; b++) {
      const contributions: Record<string, number> = { total: 1 }
      for (const light of this.buttons[b]!) {
        contributions[`light_${light}`] = 1
      }
      variables[`button_${b}`] = contributions
    }

    // each light must equal its joltage value
    const constraints: Record<string, ReturnType<typeof equalTo>> = {}
    for (let j = 0; j < this.joltage.length; j++) {
      constraints[`light_${j}`] = equalTo(this.joltage[j]!)
    }

    const model = {
      direction: "minimize" as const,
      objective: "total",
      constraints,
      variables,
      integers: true
    }

    const result = solve(model)
    return result.result
  }

  static parse(line: string): Machine {
    const regex = /\[([^\]]+)\]\s+(.*?)\s+\{([^}]+)\}/
    const match = line.match(regex)!

    const [, lights, parens, jolts] = match

    const nLights = [...lights!].length
    const required_lights = [...lights!]
      .map((c, i) => (c === "#" ? i : null))
      .filter((i) => i !== null)
    const buttons = parens!
      .match(/\(([^)]+)\)/g)!
      .map((p) => p.slice(1, -1).split(",").map(Number))
    const joltage = jolts!.split(",").map(Number)

    return new Machine(nLights, new Set(required_lights), buttons, joltage)
  }
}

const machines = await Bun.file("input.txt")
  .text()
  .then((text) => {
    return text.split("\n").filter(line => line.trim()).map((line) => Machine.parse(line))
  })

console.log(machines.reduce( (total, m) => total + m.solve(), 0))
