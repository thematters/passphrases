import { test, expect, describe } from 'vitest'
import {
  DictError,
  InputError,
  PassphrasesExpiredError,
  PassphrasesMismatchError,
  generate,
  verify,
} from '.'
import { getStartOfDate } from './utils'
import { loadDict, loadIndexDict } from './utils/dict'

const getSecret = () => (Math.random() + 1).toString(36).substring(7)
const getExpration = () => Date.now() + 1000 * 60 * 5

describe('Generate Passphrases', () => {
  const dict = loadDict()
  const indexDict = loadIndexDict()

  test('generate & verify', async () => {
    const sigExp = getExpration()
    const sigPayload = { email: 'test@example' }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()
    const take = 6

    // generate
    const passphrases = await generate({
      sigPayload,
      sigExp,
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

  test('cannnot generate with empty secret', async () => {
    const sigExp = getExpration()
    const sigPayload = { email: 'test@example' }
    const sigAlgorithm = 'sha256'
    const sigSecret = ''

    await expect(async () => {
      await generate({
        sigPayload,
        sigExp,
        sigAlgorithm,
        sigSecret,
        sigDict: dict,
        expDict: dict,
      })
    }).rejects.toThrowError(InputError)
  })

  test('can take shorter passphrases', async () => {
    const sigExp = getExpration()
    const sigPayload = { email: 'test@example' }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()

    const passphrases = await generate({
      sigPayload,
      sigExp,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
      take: 1,
    })
    expect(passphrases).toHaveLength(1)
  })

  test('cannot take oversize passphrases', async () => {
    const sigExp = getExpration()
    const sigPayload = { email: 'test@example' }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()

    await expect(async () => {
      await generate({
        sigPayload,
        sigExp,
        sigAlgorithm,
        sigSecret,
        sigDict: dict,
        expDict: dict,
        take: 200,
      })
    }).rejects.toThrowError(DictError)
  })

  test('can use custom dict', async () => {
    const sigExp = getExpration()
    const sigPayload = { email: 'test@example' }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()

    const passphrases = await generate({
      sigPayload,
      sigExp,
      sigAlgorithm,
      sigSecret,
      sigDict: loadDict('dict.json'),
      expDict: dict,
    })
    passphrases.forEach((p) => expect(typeof p).toBe('string'))
  })

  test('can custom expDictDiffSince', async () => {
    const sigExp = getExpration()
    const sigPayload = { email: 'test@example' }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()
    const startOfToday = getStartOfDate(new Date().getDate())

    // generate
    const passphrases = await generate({
      sigPayload,
      sigExp,

      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
      expDictDiffSince: startOfToday,
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
      expDictDiffSince: startOfToday,
    })
    expect(isValid).toBe(true)
  })
})

describe('Verify Passphrases', () => {
  const dict = loadDict()
  const indexDict = loadIndexDict()

  test('expired passphrases', async () => {
    const sigExp = Date.now() - 1000 * 60 * 5 // 5 minutes ago
    const sigPayload = { email: 'test@example' }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()

    const passphrases = await generate({
      sigPayload,
      sigExp,
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
    }).rejects.toThrowError(PassphrasesExpiredError)
  })

  test('wrong exp word', async () => {
    const sigExp = getExpration()
    const sigPayload = { email: 'test@example' }
    const sigAlgorithm = 'sha256'
    const sigSecret = getSecret()
    const take = 6

    // generate
    const passphrases = await generate({
      sigPayload,
      sigExp,
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
    }).rejects.toThrowError(DictError)
  })

  test('wrong passphrases', async () => {
    const sigExp = getExpration()
    const sigAlgorithm = 'sha256'
    const sigPayload = { email: 'test@example' }
    const sigSecret = getSecret()

    const passphrases = await generate({
      sigPayload,
      sigExp,
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
    }).rejects.toThrowError(PassphrasesMismatchError)
  })

  test('wrong secret', async () => {
    const sigExp = getExpration()
    const sigAlgorithm = 'sha256'
    const sigPayload = { email: 'test@example' }
    const sigSecret = getSecret()

    const wrongPassphrases = await generate({
      sigPayload,
      sigExp,
      sigAlgorithm,
      sigSecret: sigSecret + 'wrong',
      sigDict: dict,
      expDict: dict,
    })

    await expect(async () => {
      await verify({
        passphrases: wrongPassphrases,
        sigPayload,
        sigAlgorithm,
        sigSecret,
        sigDict: dict,
        expDict: dict,
        expIndexDict: indexDict,
      })
    }).rejects.toThrowError(PassphrasesMismatchError)
  })

  test('wrong sigPayload', async () => {
    const sigExp = getExpration()
    const sigAlgorithm = 'sha256'
    const sigPayload = { email: 'test@example' }
    const sigSecret = getSecret()

    const passphrases = await generate({
      sigPayload,
      sigExp,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
    })

    await expect(async () => {
      await verify({
        passphrases,
        sigPayload: { ...sigPayload, id: 'wrong' },
        sigAlgorithm,
        sigSecret,
        sigDict: dict,
        expDict: dict,
        expIndexDict: indexDict,
      })
    }).rejects.toThrowError(PassphrasesMismatchError)
  })

  test('wrong sigAlgorithm', async () => {
    const sigExp = getExpration()
    const sigAlgorithm = 'sha256'
    const sigPayload = { email: 'test@example' }
    const sigSecret = getSecret()

    const passphrases = await generate({
      sigPayload,
      sigExp,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
    })

    await expect(async () => {
      await verify({
        passphrases,
        sigPayload,
        sigAlgorithm: 'sha512',
        sigSecret,
        sigDict: dict,
        expDict: dict,
        expIndexDict: indexDict,
      })
    }).rejects.toThrowError(PassphrasesMismatchError)
  })

  test('wrong take', async () => {
    const sigExp = getExpration()
    const sigAlgorithm = 'sha256'
    const sigPayload = { email: 'test@example' }
    const sigSecret = getSecret()

    const passphrases = await generate({
      sigPayload,
      sigExp,
      sigAlgorithm,
      sigSecret,
      sigDict: dict,
      expDict: dict,
    })

    await expect(async () => {
      await verify({
        passphrases,
        sigPayload,
        sigAlgorithm: 'sha512',
        sigSecret,
        sigDict: dict,
        expDict: dict,
        expIndexDict: indexDict,
        take: 1,
      })
    }).rejects.toThrowError(PassphrasesMismatchError)
  })

  test('wrong expDictDiffSince', async () => {
    const sigExp = getExpration()
    const sigAlgorithm = 'sha256'
    const sigPayload = { email: 'test@example' }
    const sigSecret = getSecret()
    const startOfToday = getStartOfDate(new Date().getDate())

    const passphrases = await generate({
      sigPayload,
      sigExp,
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
        expDictDiffSince: startOfToday,
      })
    }).rejects.toThrowError(PassphrasesMismatchError)
  })
})
