import { test, expect, describe } from 'vitest'
import { fromTimeDiff, toTimeDiff } from './timestamp'

describe('timstamps', () => {
  test('can convert UNIX timestamp', () => {
    const now = Date.now()
    const minutes5 = 1000 * 60 * 5 // 5 minutes
    const minutes6 = 1000 * 60 * 6 // 6 minutes
    const tsSince2023 = toTimeDiff(now + minutes5)
    expect(tsSince2023).toBeGreaterThan(0)

    const ts = fromTimeDiff(tsSince2023)
    expect(ts).toBeGreaterThan(now)
    expect(ts).toBeGreaterThan(now + minutes5)
    expect(ts).toBeLessThanOrEqual(now + minutes6)
  })

  test('can convert UNIX timestamp since 2023-01-01', () => {
    const TS_2023_01_01 = 1672531200000
    const now = Date.now()
    const minutes5 = 1000 * 60 * 5 // 5 minutes
    const minutes6 = 1000 * 60 * 6 // 6 minutes
    const tsSince2023 = toTimeDiff(now + minutes5, TS_2023_01_01)
    expect(tsSince2023).toBeGreaterThan(0)

    const ts = fromTimeDiff(tsSince2023, TS_2023_01_01)
    expect(ts).toBeGreaterThan(now)
    expect(ts).toBeGreaterThan(now + minutes5)
    expect(ts).toBeLessThanOrEqual(now + minutes6)
  })
})
