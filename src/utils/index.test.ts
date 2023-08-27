import { test, expect, describe } from 'vitest'
import { hexToBin, binToDecimal, binToWords, toTimeDiff, fromTimeDiff } from '.'
import { loadDict } from './dict'

describe('hexToBin', () => {
  test('can convert hex to binanry', () => {
    const hex = 'a'
    const bin = hexToBin(hex)
    expect(bin).toBe('1010')
  })

  test('cannot convert invalid hex', () => {
    const hex = 'z'
    expect(() => hexToBin(hex)).toThrowError()
  })

  test('cannot convert empty hex', () => {
    const hex = ''
    expect(() => hexToBin(hex)).toThrowError()
  })
})

describe('binToDecimal', () => {
  test('can convert bin to decimal', () => {
    const bin = '1010'
    const decimal = binToDecimal(bin)
    expect(decimal).toBe('10')
  })

  test('cannot bin invalid decimal', () => {
    const bin = 'z'
    expect(() => binToDecimal(bin)).toThrowError()
  })

  test('cannot bin empty decimal', () => {
    const bin = ''
    expect(() => binToDecimal(bin)).toThrowError()
  })

  test('cannot bin negative decimal', () => {
    const bin = '-1'
    expect(() => binToDecimal(bin)).toThrowError()
  })
})

describe('binToWords', () => {
  test('can convert bin to words', async () => {
    const bin = '1010'
    const words = await binToWords(bin, 2, loadDict())!
    expect(words.length).toBe(2)
    words.forEach((w) => expect(typeof w).toBe('string'))
  })

  test('can convert bin to words with right zero padding', async () => {
    const bin = '1010'
    const words = await binToWords(bin, 3, loadDict())!
    expect(words.length).toBe(2)
    words.forEach((w) => expect(typeof w).toBe('string'))

    const bin2 = '1010'
    const words2 = await binToWords(bin2, 5, loadDict())!
    expect(words2.length).toBe(1)
    words2.forEach((w) => expect(typeof w).toBe('string'))
  })

  test('cannot convert invalid bin', async () => {
    const bin = 'z'
    await expect(
      async () => await binToWords(bin, 2, loadDict())
    ).rejects.toThrowError()
  })
})
