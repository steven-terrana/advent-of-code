import { getLines } from "../helpers"
import { parseSeeds, parseMappers, calculateLocation } from "./p1"

let input = getLines("test.txt")

test('seeds parsed correctly', () => {
  let seeds = parseSeeds(input)
  let expected = [79, 14, 55, 13]
  expect(seeds.length).toBe(expected.length)
  expected.forEach( s => expect(seeds.includes(s)) )
})

var mappers = parseMappers(input)

data = [
  { seed: 79, soil: 81, fertilizer: 81, water: 81, light: 74, temperature: 78, humidity: 78, location: 82 },
  { seed: 14, soil: 14, fertilizer: 53, water: 49, light: 42, temperature: 42, humidity: 43, location: 43 },
  { seed: 55, soil: 57, fertilizer: 57, water: 53, light: 46, temperature: 82, humidity: 82, location: 86 },
  { seed: 13, soil: 13, fertilizer: 52, water: 41, light: 34, temperature: 34, humidity: 35, location: 35 }
]

describe('seed to soil', () => {
  let mapper = mappers.find( m => m.description == "seed-to-soil map:")
  test.each(data)('seed $seed corresponds to soil $soil', ({seed, soil}) => {
     expect(mapper.transform(seed)).toBe(soil)
  })
})

describe('fertilizer to water', () => {
  let mapper = mappers.find( m => m.description == "fertilizer-to-water map:")
  test.each(data)('fertilizer $fertilizer corresponds to water $water', ({fertilizer, water}) => {
     expect(mapper.transform(fertilizer)).toBe(water)
  })
})

describe('water to light', () => {
  let mapper = mappers.find( m => m.description == "water-to-light map:")
  test.each(data)('water $water corresponds to light $light', ({water, light}) => {
     expect(mapper.transform(water)).toBe(light)
  })
})

describe('light to temperature', () => {
  let mapper = mappers.find( m => m.description == "light-to-temperature map:")
  test.each(data)('light $light corresponds to temperature $temperature', ({light, temperature}) => {
     expect(mapper.transform(light)).toBe(temperature)
  })
})

describe('temperature to humidity', () => {
  let mapper = mappers.find( m => m.description == "temperature-to-humidity map:")
  test.each(data)('temperature $temperature corresponds to humidity $humidity', ({temperature, humidity}) => {
     expect(mapper.transform(temperature)).toBe(humidity)
  })
})

describe('humidity to location', () => {
  mappers.forEach( m => console.log(m))
  let mapper = mappers.find( m => m.description == "humidity-to-location map:")
  test.each(data)('humidity $humidity corresponds to location $location', ({humidity, location}) => {
     expect(mapper.transform(humidity)).toBe(location)
  })
})

test.each(data)('Seed number $seed corresponds to location $location', ({seed, location}) => {
  expect(calculateLocation(mappers, seed)).toBe(location)
})




