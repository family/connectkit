import { readFileSync } from 'node:fs'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default [
  {
    input: ['./src/index.ts'],
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-is',
      'react-transition-state',
      'react-use-measure',
      'framer-motion',
      'styled-components',
      'wagmi',
      'viem',
      '@tanstack/react-query',
    ],
    output: {
      file: packageJson.exports.import,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      peerDepsExternal(),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: 'node_modules/**',
      }),
    ],
  },
]
