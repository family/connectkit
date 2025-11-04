import { globSync } from 'glob'
import typescript from 'rollup-plugin-typescript2'

const apiFiles = globSync('./src/api/**/*.ts')

export default apiFiles.map((input) => ({
  input,
  output: {
    file: input.replace('src/', 'dist/').replace('.ts', '.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'auto',
  },
  plugins: [
    typescript({
      check: false, // Skip type checking during build
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: './dist',
          moduleResolution: 'bundler',
          skipLibCheck: true,
        },
      },
    }),
  ],
  external: [
    '@vercel/node',
    'http',
    'https',
    'url',
    'path',
    'fs',
    'stream',
    'util',
    'events',
    'buffer',
    'crypto',
    'querystring',
  ],
}))
