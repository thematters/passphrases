export const sign = async (
  data: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256'
) => {
  if (typeof crypto !== undefined) {
    const signBrowser = (await import('./sign.browser')).sign
    return await signBrowser(data, secret, algorithm)
  } else {
    const signNode = (await import('./sign.node')).sign
    return await signNode(data, secret, algorithm)
  }
}
