import { Dict } from './definitions'
import { DictError, InputError } from './errors'
import {
  encode,
  binToWords,
  toTimeDiff,
  hexToBin,
  calcChunkSize,
} from './utils'
import { sign } from './utils/sign'

/**
 * Generate passphrases
 */
type Generate = {
  // signing
  sigPayload: {
    // other payload data
    [key: string]: number | string
  }
  // timestamp of expiration date in milliseconds
  sigExp: number
  sigAlgorithm?: 'sha256' | 'sha512'
  sigSecret: string

  // dictionaries to map signature and expiration date to words
  sigDict: Dict
  expDict: Dict
  expDictDiffSince?: number

  // take first n words as passphrases
  take?: number
}

export const generate = async ({
  sigPayload,
  sigExp,
  sigAlgorithm = 'sha256',
  sigSecret,
  sigDict,
  expDict,
  expDictDiffSince,
  take,
}: Generate) => {
  // sign the payload (JWT-like)
  if (!sigSecret || sigSecret.length <= 0)
    throw new InputError('`sigSecret` is required.')

  const normalizedExp = toTimeDiff(sigExp, expDictDiffSince)
  const payload = encode(
    JSON.stringify({
      ...sigPayload,
      exp: normalizedExp,
      since: expDictDiffSince,
    })
  )
  const header = encode(JSON.stringify({ alg: sigAlgorithm }))
  const signature = await sign(`${header}.${payload}`, sigSecret, sigAlgorithm)

  // signature to words
  const chunkSize = calcChunkSize(sigDict)
  let words: (string | null | undefined)[] | undefined = []
  try {
    words = await binToWords(hexToBin(signature), chunkSize, sigDict)
  } catch (err) {
    throw new DictError('Unable to convert signature to words.')
  }
  if (!words) throw new DictError('Unable to convert signature to words.')

  // exp to word
  let expWord: string | null | undefined = undefined
  try {
    expWord = await expDict.get(toTimeDiff(sigExp, expDictDiffSince))
  } catch (err) {
    throw new DictError('Unable to convert exp to word.')
  }
  if (!expWord) throw new DictError('Unable to convert exp to word.')

  // construct passphrases
  const result = [expWord, ...(words as string[])].slice(0, take)
  if (take && result.length < take) throw new DictError('Not enough words.')
  return result
}
