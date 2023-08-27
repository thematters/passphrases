import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
// import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
// import generatePackageJson from 'rollup-plugin-generate-package-json'

const packageJson = require('./package.json')
const sourcemap = false
// const cjsExternal = [...Object.keys(packageJson.peerDependencies)]
// const esmExternal = [...Object.keys(packageJson.peerDependencies)]
const plugins = [
  resolve(),
  commonjs(),
  typescript({ tsconfig: './tsconfig.json' }),
  // terser(),
]

export default [
  // main
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap,
        name: packageJson.name,
        inlineDynamicImports: true,
      },
    ],
    plugins,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap,
        inlineDynamicImports: true,
      },
    ],
    plugins,
  },
  {
    input: 'src/index.browser.ts',
    output: [
      {
        file: packageJson.browser,
        format: 'esm',
        sourcemap,
        inlineDynamicImports: true,
      },
    ],
    plugins,
  },
  // types
  {
    input: 'dist/types/src/index.d.ts',
    output: [{ file: packageJson.types, format: 'esm' }],
    plugins: [dts.default()],
  },
  {
    input: 'dist/types/src/index.browser.d.ts',
    output: [{ file: packageJson.exports['./browser'].types, format: 'esm' }],
    plugins: [dts.default()],
  },
]
