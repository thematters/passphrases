import { test, expect, describe } from 'vitest'
import { sign as signNode } from './sign.node'
import { sign as signBrowser } from './sign.browser'

const getSecret = () => (Math.random() + 1).toString(36).substring(7)

describe.each([
  { type: 'node', sign: signNode },
  { type: 'browser', sign: signBrowser },
])('sign in $type', ({ sign }) => {
  test('can sign with sha256', async () => {
    const data = 'test'
    const secret = getSecret()
    const algorithm = 'sha256'
    const signature = await sign(data, secret, algorithm)
    expect(typeof signature).toBe('string')
  })

  test('can sign with sha512', async () => {
    const data = 'test'
    const secret = getSecret()
    const algorithm = 'sha512'
    const signature = await sign(data, secret, algorithm)
    expect(typeof signature).toBe('string')
  })

  test('can sign empty data', async () => {
    const data = ''
    const secret = getSecret()
    const algorithm = 'sha512'
    const signature = await sign(data, secret, algorithm)
    expect(typeof signature).toBe('string')
  })

  test('cannot sign with empty secret', async () => {
    const data = 'data'
    const secret = ''
    const algorithm = 'sha512'

    await expect(async () => {
      await sign(data, secret, algorithm)
    }).rejects.toThrowError()
  })
})
