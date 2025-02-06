import React from 'react';

import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OpenfortKitProvider, getDefaultConfig } from '@openfort/openfort-kit';

const config = createConfig(
  getDefaultConfig({
    appName: 'ConnectKit Vite demo',
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortKitProvider debugMode>{children}</OpenfortKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
