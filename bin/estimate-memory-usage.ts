import fs from 'fs'
import path from 'path'
import process from 'process'
import sizeof from 'object-sizeof'

const corpusDir = path.resolve('./corpus')

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getMemoryUsage = (label: string) => {
  const mu = process.memoryUsage()
  // # bytes / KB / MB / GB
  const gbNow = mu.heapUsed / 1024 / 1024 / 1024
  // const gbRounded = Math.round(gbNow * 100) / 100
  console.log(`[${label}] Heap allocated ${gbNow} GB`)

  return mu.heapUsed
}

;(async () => {
  let stime = performance.now() // started time
  getMemoryUsage('start')

  // read dict
  const dict = JSON.parse(
    fs.readFileSync(path.resolve(corpusDir, 'dict.json'), 'utf-8')
  )
  const memDictLoaded = getMemoryUsage('dict loaded')

  for (let i = 0; i < 1000000; i++) {
    const index = getRandomInt(0, dict.length - 1)
    // console.log(index, dict[index])
  }

  const memCalc = getMemoryUsage('dict used')
  let ftime = performance.now() // finished time

  let elapsed_time = ftime - stime
  console.log(`Execution time: ${elapsed_time} ms`)
  // console.log((memCalc - memDictLoaded) / 1024 / 1024, ' MB')

  const sizeObj = sizeof(dict)
  const sizeNow = sizeObj / 1024 / 1024 / 1024
  const sizeRounded = Math.round(sizeNow * 100) / 100
  console.log(`Size of the object: ${sizeRounded} GB`)
})()
