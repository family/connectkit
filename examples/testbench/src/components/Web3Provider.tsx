import { WagmiProvider, createConfig } from 'wagmi';
import { getDefaultConfig, wallets } from 'connectkit';

import { TestBenchProvider } from '../TestbenchProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { defineChain, type Chain, http } from 'viem';

const avalanche: Chain = defineChain({
  id: 43_114,
  name: 'Avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    snowtrace: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  testnet: false,
});

const ckConfig = getDefaultConfig({
  chains: [avalanche],
  transports: {
    [avalanche.id]: http(avalanche.rpcUrls.default.http[0]),
  },
  appName: 'ConnectKit testbench',
  appIcon: '/app.png',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
});

const config = createConfig({
  ...ckConfig,
  connectors: [wallets['family'], ...(ckConfig.connectors ?? [])],
});
const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TestBenchProvider
        //customTheme={{ '--ck-font-family': 'monospace' }}
        >
          {children}
        </TestBenchProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
