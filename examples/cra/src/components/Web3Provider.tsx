import React from 'react';

import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, OpenfortProvider, getDefaultConfig } from '@openfort/react';

const config = createConfig(
  getDefaultConfig({
    appName: 'OpenfortKit CRA demo',
    walletConnectProjectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID!,
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortProvider
          debugMode
          publishableKey={process.env.REACT_APP_OPENFORT_PUBLIC_KEY!}

          // In this example, we require the user to link their wallet on sign up.
          // We don't need an embedded signer for this example,
          // we will be using the user wallet for signing.

          uiConfig={{
            authProviders: [
              AuthProvider.GUEST,
              AuthProvider.EMAIL,
              AuthProvider.GOOGLE,
              AuthProvider.WALLET,
            ],

            skipEmailVerification: true,
          }}
        >
          {children}
        </OpenfortProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
