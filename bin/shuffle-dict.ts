import fs from 'fs'
import path from 'path'

const corpusDir = path.resolve('./corpus')

// https://stackoverflow.com/a/53758827
const shuffle = (array: string[], seed: number) => {
  var m = array.length,
    t,
    i

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(random(seed) * m--) // <-- MODIFIED LINE

    // And swap it with the current element.
    t = array[m]
    array[m] = array[i]
    array[i] = t
    ++seed // <-- ADDED LINE
  }

  return array
}

const random = (seed: number) => {
  var x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

const getRandomint = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

;(async () => {
  // read dict
  const dict = JSON.parse(
    fs.readFileSync(path.resolve(corpusDir, 'dict.json'), 'utf-8')
  ) as string[]

  // shuffle dict with seed
  const seed = getRandomint(0, dict.length)
  const shuffledDict = Array.from(new Set(shuffle(dict, seed)))

  if (shuffledDict.length !== dict.length) {
    throw new Error('dict length mismatch')
  }

  // export to JSON
  fs.writeFileSync(
    path.resolve(corpusDir, 'dict-shuffled.json'),
    JSON.stringify(shuffledDict, null, 2),
    'utf-8'
  )
})()
