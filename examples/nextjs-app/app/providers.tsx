'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '../config';
import { AuthProvider, OpenfortProvider, RecoveryMethod } from "@openfort/react";

const queryClient = new QueryClient();
export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortProvider
          debugMode
          publishableKey={process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!}

          // Set the wallet configuration. In this example, we will be using the embedded signer.
          walletConfig={{

            shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY!,

            // You can set a policy id to sponsor the gas fees for your users
            ethereumProviderPolicyId: process.env.NEXT_PUBLIC_POLICY_ID,
          }}

          uiConfig={{
            skipEmailVerification: true,

            authProviders: [
              AuthProvider.GUEST,
              AuthProvider.EMAIL,
              AuthProvider.WALLET,
              AuthProvider.GOOGLE,
            ]
          }}
        >
          {props.children}
        </OpenfortProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
