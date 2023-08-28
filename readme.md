# Passphrases

## Introduction

TODO

## Usage

```bash
npm i @matters/passphrases
```

```js
import { generate, verify } from '@matters/passphrases'

// load default dict or use your custom dict
import { loadDict, loadIndexDict } from '@matters/passphrases/dict'
const dict = loadDict()
const indexDict = loadIndexDict()

// generate and take the first 6 words as passphrases
const passphrases = generate({
  sigPayload: { email: 'test@example' },
  sigExp: 1693036368286,
  sigSecret: 'abc',
  sigDict: dict,
  expDict: dict,
})

// verify passphrases
const isValid = verify({
  passphrases,
  sigPayload: { email: 'test@example' },
  sigSecret: 'abc',
  sigDict: dict,
  expDict: dict,
  expIndexDict: indexDict,
})
```

## Development

```bash
# build
npm run build

# test
npm run test

# build your own dictionary
npm run build:dict

# shuffle the dictionary to make it more secure
npm run shuffle:dict
```

## Benchmark

```bash
npm run benchmark
```
