"use client";
import React from 'react';

import { RecoveryMethod } from '@openfort/openfort-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OpenfortKitProvider, KitOAuthProvider, getDefaultConfig } from 'connectkit';
import { beamTestnet, polygonAmoy } from 'viem/chains';
import { WagmiProvider, createConfig } from 'wagmi';

const config = createConfig(
  getDefaultConfig({
    appName: 'FortKit Next.js demo',
    chains: [beamTestnet, polygonAmoy],
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
              recoveryMethod: RecoveryMethod.PASSWORD,
              createEncryptedSessionEndpoint: '/api/protected-create-encryption-session',
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
            enforceSupportedChains: true,

            hideBalance: true,
            skipEmailVerification: true,
            reducedMotion: true,
            // walletConnectCTA: 'both',
            // wallet: {
            //   linkWalletOnSignUp: true,
            // }
          }}
          debugMode
          // theme='rounded'
          // mode='dark'
          theme='retro'
        // theme='web95'

        >
          {children}
        </OpenfortKitProvider>
      </QueryClientProvider>
    </WagmiProvider >
  );
};
