import React from 'react';

import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, OpenfortKitProvider, getDefaultConfig } from '@openfort/openfort-kit';

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
        <OpenfortKitProvider
          debugMode
          publishableKey={process.env.REACT_APP_OPENFORT_PUBLIC_KEY!}

          walletConfig={{
            // In this example, we require the user to link their wallet on sign up.
            // We don't need an embedded signer for this example,
            // we will be using the user wallet for signing.

            linkWalletOnSignUp: true,
          }}

          options={{
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
        </OpenfortKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
