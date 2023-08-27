export class InputError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InputError'
  }
}

export class DictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DictError'
  }
}

export class PassphrasesExpiredError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PassphrasesExpiredError'
  }
}

export class PassphrasesMismatchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PassphrasesMismatchError'
  }
}
