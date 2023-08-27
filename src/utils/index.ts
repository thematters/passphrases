import base64url from 'base64url'

import { Dict } from '../definitions'

export * from './timestamp'

// chunk size of each binary numnbers mapping to passphrase
export const calcChunkSize = (dict: Dict) => {
  const chunkSize = Math.floor(Math.log2(dict.length))
  return chunkSize
}

// encode to base64url
export const encode = (str: string) => base64url.encode(str)

// base conversion
export const hexToBin = (hex: string) => BigInt(`0x${hex}`).toString(2)
export const binToDecimal = (bin: string) => BigInt(`0b${bin}`).toString(10)

// map number (binary string) to words
export const binToWords = async (
  binStr: string,
  chunkSize: number,
  dict: Dict
) => {
  // split number into chunks and right padding with zeros
  const chunks = binStr
    .padEnd(Math.ceil(binStr.length / chunkSize) * chunkSize, '0')
    .match(new RegExp(`.{${chunkSize}}`, 'g'))

  if (!chunks) return []

  // map chunks to words
  return await Promise.all(
    chunks.map(async (c) => {
      return await dict.get(+binToDecimal(c))
    })
  )
}
