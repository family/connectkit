import React from 'react';

import { OAuthProvider } from '@openfort/openfort-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FortKitProvider, FortOAuthProvider, getDefaultConfig } from 'connectkit';
import { WagmiProvider, createConfig } from 'wagmi';

const config = createConfig(
  getDefaultConfig({
    appName: 'ConnectKit Next.js demo',
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  console.log("process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY", process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <FortKitProvider
          baseConfiguration={{
            publishableKey: process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!,
          }}
          shieldConfiguration={{
            shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY!,
          }}

          options={
            {
              authProviders: [
                FortOAuthProvider.GOOGLE,
                FortOAuthProvider.GUEST,
              ],
            }
          }
          debugMode
          // theme='nouns'
          mode='dark'
        // theme='retro'
        >
          {children}
        </FortKitProvider>
      </QueryClientProvider>
    </WagmiProvider >
  );
};
