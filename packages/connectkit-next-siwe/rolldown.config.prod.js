import { defineConfig } from 'rolldown';

// ESM library: every bare specifier (dependencies and peer dependencies
// alike) is left external and resolved by the consuming app.
const external = (id) => !id.startsWith('.') && !id.startsWith('/');

export default defineConfig({
  input: { index: './src/index.ts' },
  external,
  tsconfig: './tsconfig.json',
  output: {
    dir: 'build',
    format: 'esm',
    sourcemap: false,
    entryFileNames: '[name].es.js',
    chunkFileNames: 'chunks/[name]-[hash].es.js',
  },
});
