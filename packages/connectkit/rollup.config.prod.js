import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from 'rollup-plugin-typescript2';

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

export default [
  {
    input,
    external: ['react', 'react-dom', 'framer-motion', 'wagmi'],
    output: {
      dir: 'build',
      format: 'esm',
      sourcemap: true,
      entryFileNames: '[name].es.js',
      chunkFileNames: 'chunks/[name]-[hash].es.js',
    },
    plugins: [
      peerDepsExternal(),
      typescript({
        useTsconfigDeclarationDir: true,
        exclude: 'node_modules/**',
      }),
    ],
  },
];
