import { readFileSync } from 'node:fs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import { createTransformer as createStyledComponentsTransformer } from 'typescript-plugin-styled-components'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

const styledComponentsTransformer = createStyledComponentsTransformer({
  displayName: true,
})

export default [
  {
    input: ['./src/index.ts'],
    external: ['react', 'react-dom', 'framer-motion', 'wagmi'],
    output: [
      {
        file: packageJson.exports.import,
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [
      peerDepsExternal(),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: 'node_modules/**',
        transformers: [
          () => ({
            before: [styledComponentsTransformer],
          }),
        ],
      }),
    ],
  },
]
