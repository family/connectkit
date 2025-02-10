"use client";
import React from 'react';

import { RecoveryMethod } from '@openfort/openfort-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KitOAuthProvider, OpenfortKitProvider, getDefaultConfig } from '@openfort/openfort-kit';
import { beamTestnet, polygonAmoy } from 'viem/chains';
import { WagmiProvider, createConfig } from 'wagmi';

const config = createConfig(
  getDefaultConfig({
    appName: 'OpenfortKit Next.js demo',
    chains: [beamTestnet, polygonAmoy,],

    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    ssr: true,
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OpenfortKitProvider

          publishableKey={process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!}

          walletConfig={{
            // linkWalletOnSignUp: true,

            createEmbeddedSigner: true,

            embeddedSignerConfiguration: {
              shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY!,
              recoveryMethod: RecoveryMethod.AUTOMATIC,
              // createEncryptedSessionEndpoint: '/api/protected-create-encryption-session',
              getEncryptionSession: async () => {
                const res = await fetch('/api/protected-create-encryption-session', {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                return (await res.json()).session;
              },

              // You can set a policy id to sponsor the gas fees for your users
              ethereumProviderPolicyId: process.env.NEXT_PUBLIC_POLICY_ID,
            }
          }}

          options={{
            authProviders: [
              KitOAuthProvider.GUEST,
              KitOAuthProvider.EMAIL,
              KitOAuthProvider.GOOGLE,
              KitOAuthProvider.TWITTER,
              KitOAuthProvider.FACEBOOK,
              KitOAuthProvider.WALLET,
            ],
            initialChainId: polygonAmoy.id,
            // enforceSupportedChains: true,

            skipEmailVerification: true,
            reducedMotion: true,
          }}
          debugMode
          // theme='retro'
          theme='midnight'
        >
          {children}
        </OpenfortKitProvider>
      </QueryClientProvider>
    </WagmiProvider >
  );
};
