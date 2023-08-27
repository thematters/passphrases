import crypto from 'crypto'

export const sign = async (
  data: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
) => {
  if (!secret) {
    throw new Error('`secret` is required.')
  }

  const hmac = crypto.createHmac(algorithm, secret)
  hmac.update(data)
  const signature = hmac.digest('hex')
  return signature
}
