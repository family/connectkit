'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '../config';
import { KitOAuthProvider, OpenfortKitProvider } from 'connectkit';

const queryClient = new QueryClient();
export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortKitProvider
          debugMode
          publishableKey={process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!}

          walletConfig={{
            // In this example, we require the user to link their wallet on sign up.
            // We don't need an embedded signer for this example,
            // we will be using the user wallet for signing.

            linkWalletOnSignUp: true,
          }}

          options={{
            skipEmailVerification: true,

            authProviders: [
              KitOAuthProvider.WALLET,
              KitOAuthProvider.EMAIL,
            ]
          }}
        >
          {props.children}
        </OpenfortKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
