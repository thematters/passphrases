// timestamp in minute since given date (default to start of yesterday)
const MINUTE = 60000

export const getStartOfDate = (dayOfMonth: number) => {
  const startOfYesterday = new Date()
  startOfYesterday.setDate(dayOfMonth)
  startOfYesterday.setUTCHours(0, 0, 0, 0)
  return startOfYesterday.getTime()
}

export const startOfYesterday = () => {
  const now = new Date()
  return getStartOfDate(now.getDate() - 1)
}

export const toTimeDiff = (
  date: number,
  since: number = startOfYesterday()
): number => {
  return Math.ceil((date - since) / MINUTE)
}

export const fromTimeDiff = (
  diff: number,
  since: number = startOfYesterday()
) => {
  const ts = diff * MINUTE + since
  return ts
}
