import React from 'react';

import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ConnectKitProvider,
  getDefaultConfig,
  aaveAccount,
  metaMask,
} from 'connectkit';
import { coinbaseWallet } from 'connectkit/connectors/coinbaseWallet';
import { walletConnect } from 'connectkit/connectors/walletConnect';
import { safe } from 'connectkit/connectors/safe';

const config = createConfig(
  getDefaultConfig({
    appName: 'ConnectKit Next.js demo',
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    connectors: [
      aaveAccount(),
      safe(),
      metaMask(),
      coinbaseWallet(),
      walletConnect(),
    ],
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
