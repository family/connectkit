import { defineConfig } from 'rolldown';

// Each connector is its own entry point so that apps only pull the connectors
// they import into their bundle graph — the SDKs backing coinbaseWallet,
// walletConnect and safe are optional peer dependencies.
const input = {
  index: './src/index.ts',
  'connectors/injected': './src/connectors/injected.ts',
  'connectors/metaMask': './src/connectors/metaMask.ts',
  'connectors/aaveAccount': './src/connectors/aaveAccount.ts',
  'connectors/coinbaseWallet': './src/connectors/coinbaseWallet.ts',
  'connectors/walletConnect': './src/connectors/walletConnect.ts',
  'connectors/safe': './src/connectors/safe.ts',
};

// ConnectKit ships an ESM library: every bare specifier (dependencies and
// peer dependencies alike) is left external and resolved by the consuming
// app's package manager and bundler.
const external = (id) => !id.startsWith('.') && !id.startsWith('/');

export default defineConfig({
  input,
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
