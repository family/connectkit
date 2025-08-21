import { createElement, createContext, useContext, useState } from 'react';
import { TestBenchProvider } from '../TestbenchProvider';

import { getDefaultConfig, wallets } from 'connectkit';

import { WagmiProvider, createConfig } from 'wagmi';
import { defineChain, type Chain, http } from 'viem';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';

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

export const ckConfig = getDefaultConfig({
  /*
  chains: [
    mainnet,
    //avalanche
  ],
  transports: {
    [mainnet.id]: http(mainnet.rpcUrls.default.http[0]),
    //[avalanche.id]: http(avalanche.rpcUrls.default.http[0]),
  },
  */
  appName: 'ConnectKit testbench',
  appIcon: '/app.png',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  //enableFamily: false,
});
const customConfig = {
  ...ckConfig,
  connectors: [wallets['rainbow'], ...(ckConfig.connectors ?? [])],
};
const config = createConfig(ckConfig);

const queryClient = new QueryClient();

type ContextValue = {};

const Context = createContext<ContextValue | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return createElement(
    Context.Provider,
    { value: {} },
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

export const useWeb3 = () => {
  const context = useContext(Context);
  if (!context) throw Error('useWeb3 must be inside a Web3Provider.');
  return context;
};
