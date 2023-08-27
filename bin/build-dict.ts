import fs from 'fs'
import path from 'path'

const corpusDir = path.resolve('./corpus')

const normalizeNGram = (ngrams: string, threshold: number): string[] => {
  return ngrams
    .split('\n')
    .map((line) => {
      const [ngram, count] = line.split(',')
      if (Number(count) < threshold) {
        return null
      }
      return ngram
    })
    .filter(Boolean)
    .map((n) => n!)
}

;(async () => {
  // read ngrams
  const threshold = 10000000
  const ngrams2 = normalizeNGram(
    fs.readFileSync(path.resolve(corpusDir, 'ngrams2.csv'), 'utf-8'),
    threshold
  )
  const ngrams3 = normalizeNGram(
    fs.readFileSync(path.resolve(corpusDir, 'ngrams3.csv'), 'utf-8'),
    threshold
  )

  // build dict
  const dict = new Set()
  ngrams2.map((ngram2) => {
    ngrams3.map((ngram3) => {
      dict.add((ngram2 + ngram3).toLowerCase())
    })
  })

  // export to JSON
  fs.writeFileSync(
    path.resolve(corpusDir, 'dict.json'),
    JSON.stringify(Array.from(dict), null, 2),
    'utf-8'
  )
})()
