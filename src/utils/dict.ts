import fs from 'fs'
import path from 'path'

import { Dict, IndexDict } from '../definitions'

export const loadDict = (fileName: string = 'dict.json'): Dict => {
  const corpusDir = path.resolve('./corpus')

  const dict = JSON.parse(
    fs.readFileSync(path.resolve(corpusDir, fileName), 'utf-8')
  ) as string[]

  return {
    get: async (key: number) => dict[+key],
    length: dict.length,
  }
}

export const loadIndexDict = (fileName: string = 'dict.json'): IndexDict => {
  const corpusDir = path.resolve('./corpus')

  const dict = JSON.parse(
    fs.readFileSync(path.resolve(corpusDir, fileName), 'utf-8')
  ) as string[]

  return {
    get: async (key: string) => dict.indexOf(key),
    length: dict.length,
  }
}
