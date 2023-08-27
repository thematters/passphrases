import { test, expect, describe } from 'vitest'
import { generate, verify } from '.'
import { getStartOfDate } from './utils'
import { loadDict, loadIndexDict } from './utils/dict'

const getSecret = () => (Math.random() + 1).toString(36).substring(7)
const getExpration = () => Date.now() + 1000 * 60 * 5

describe('Passphrases', () => {
  const dict = loadDict()
  const indexDict = loadIndexDict()

  test('generate & verify', async () => {
    const exp = getExpration()
    const sigPayload = { email: 'test@example', exp }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()
    const take = 6

    // generate
    const passphrases = await generate({
      sigPayload,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
      take,
    })
    expect(passphrases).toHaveLength(take)
    passphrases.forEach((p) => expect(typeof p).toBe('string'))

    // verify
    const isValid = await verify({
      passphrases,
      sigPayload,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
      expIndexDict: indexDict,
      take,
    })
    expect(isValid).toBe(true)
  })

  test('generate: empty secret', async () => {
    const exp = getExpration()
    const sigPayload = { email: 'test@example', exp }
    const sigAlgorithm = 'sha256'
    const sigSecret = ''

    await expect(async () => {
      await generate({
        sigPayload,
        sigAlgorithm,
        sigSecret,
        sigDict: dict,
        expDict: dict,
      })
    }).rejects.toThrowError('`sigSecret` is required.')
  })

  test('generate: take', async () => {
    const exp = getExpration()
    const sigPayload = { email: 'test@example', exp }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()

    await expect(async () => {
      await generate({
        sigPayload,
        sigAlgorithm,
        sigSecret,
        sigDict: dict,
        expDict: dict,
        take: 200,
      })
    }).rejects.toThrowError('Not enough words.')
  })

  test('generate: custom dict', async () => {
    const exp = getExpration()
    const sigPayload = { email: 'test@example', exp }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()

    // custom dict
    const passphrases = await generate({
      sigPayload,
      sigAlgorithm,
      sigSecret,
      sigDict: loadDict('dict.json'),
      expDict: dict,
    })
    passphrases.forEach((p) => expect(typeof p).toBe('string'))

    // // not enough words to generate passphrases
    // expect(() => {
    //   generate({
    //     sigPayload,
    //     sigAlgorithm,
    //     sigSecret,
    //     sigDict: loadDict('dict.json'),
    //   })
    // }).toThrowError()
  })

  test('generate: custom exp diff since', async () => {
    const exp = getExpration()
    const sigPayload = { email: 'test@example', exp }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()

    // generate
    const passphrases = await generate({
      sigPayload,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
      expDictDiffSince: getStartOfDate(new Date().getDate() - 1),
    })
    passphrases.forEach((p) => expect(typeof p).toBe('string'))

    // verify
    const isValid = await verify({
      passphrases,
      sigPayload,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
      expIndexDict: indexDict,
      expDictDiffSince: getStartOfDate(new Date().getDate() - 1),
    })
    expect(isValid).toBe(true)
  })

  test('verify: expired passphrases', async () => {
    const exp = Date.now() - 1000 * 60 * 5 // 5 minutes ago
    const sigPayload = { email: 'test@example', exp }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()

    const passphrases = await generate({
      sigPayload,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
    })

    await expect(async () => {
      await verify({
        passphrases,
        sigPayload,
        sigAlgorithm,
        sigSecret,
        sigDict: dict,
        expDict: dict,
        expIndexDict: indexDict,
      })
    }).rejects.toThrowError('Passphrases expired.')
  })

  test('verify: wrong exp word', async () => {
    const exp = getExpration()
    const sigPayload = { email: 'test@example', exp }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()
    const take = 6

    // generate
    const passphrases = await generate({
      sigPayload,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
      take,
    })
    expect(passphrases).toHaveLength(take)
    passphrases.forEach((p) => expect(typeof p).toBe('string'))

    // verify
    await expect(async () => {
      await verify({
        passphrases: ['wrong123', ...passphrases.slice(1)],
        sigPayload,
        sigAlgorithm,
        sigSecret,
        sigDict: dict,
        expDict: dict,
        expIndexDict: indexDict,
        take,
      })
    }).rejects.toThrowError('Unable to convert expWord to exp.')
  })

  test('verify: wrong passphrases', async () => {
    const exp = getExpration()
    const sigAlgorithm = 'sha256'
    const sigPayload = { email: 'test@example', exp }
    const sigSecret = getSecret()

    const passphrases = await generate({
      sigPayload,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
    })

    await expect(async () => {
      await verify({
        passphrases: [passphrases[0], ...passphrases.slice(1).reverse()],
        sigPayload,
        sigAlgorithm,
        sigSecret,
        sigDict: dict,
        expDict: dict,
        expIndexDict: indexDict,
      })
    }).rejects.toThrowError('Passphrases mismatch.')
  })
})
