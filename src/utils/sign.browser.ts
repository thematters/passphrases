export const sign = async (
  data: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
) => {
  const enc = new TextEncoder()
  const algo = {
    name: 'HMAC',
    hash: algorithm === 'sha256' ? 'SHA-256' : 'SHA-512',
  }
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    algo,
    false,
    ['sign', 'verify']
  )

  const signature = await crypto.subtle.sign(algo.name, key, enc.encode(data))

  // convert buffer to byte array
  const hashArray = Array.from(new Uint8Array(signature))

  // convert bytes to hex string
  const digest = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

  return digest
}
