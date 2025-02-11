'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '../config';
import { KitOAuthProvider, OpenfortKitProvider } from '@openfort/openfort-kit';
import { RecoveryMethod } from '@openfort/openfort-js';

const queryClient = new QueryClient();
export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortKitProvider
          debugMode
          publishableKey={process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!}

          // Set the wallet configuration. In this example, we will be using the embedded signer.
          walletConfig={{
            createEmbeddedSigner: true,

            embeddedSignerConfiguration: {
              shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY!,

              // Set the recovery method you want to use, in this case we will use the password recovery method
              recoveryMethod: RecoveryMethod.PASSWORD,

              // With password recovery we can set the encryption key to encrypt the recovery data
              // This way we don't have a backend to store the recovery data
              shieldEncryptionKey: process.env.NEXT_PUBLIC_SHIELD_ENCRYPTION_SHARE!,

              // You can set a policy id to sponsor the gas fees for your users
              ethereumProviderPolicyId: process.env.NEXT_PUBLIC_POLICY_ID,
            }
          }}


          options={{
            skipEmailVerification: true,

            authProviders: [
              KitOAuthProvider.EMAIL,
              KitOAuthProvider.WALLET,
            ]
          }}
        >
          {props.children}
        </OpenfortKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
