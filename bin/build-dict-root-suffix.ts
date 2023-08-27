import fs from 'fs'
import path from 'path'

const corpusDir = path.resolve('./corpus')

;(async () => {
  // read ngrams
  const roots = Object.keys(
    JSON.parse(fs.readFileSync(path.resolve(corpusDir, 'roots.json'), 'utf-8'))
  )
  const suffixs = fs
    .readFileSync(path.resolve(corpusDir, 'suffix.txt'), 'utf-8')
    .split('\n')

  // build dict
  const dict = new Set()
  roots.map((root) => {
    suffixs.map((suffix) => {
      const word = (root + suffix).toLowerCase()
      if (word.length === 5) {
        dict.add(word)
      }
    })
  })

  // export to JSON
  fs.writeFileSync(
    path.resolve(corpusDir, 'dict-root-suffix.json'),
    JSON.stringify(Array.from(dict), null, 2),
    'utf-8'
  )
})()
