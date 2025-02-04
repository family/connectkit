"use client";
import React from 'react';

import { RecoveryMethod } from '@openfort/openfort-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FortKitProvider, FortOAuthProvider, getDefaultConfig } from 'connectkit';
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
        <FortKitProvider
          baseConfiguration={{
            publishableKey: process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!, // TODO: remove from here and put in options
          }}
          shieldConfiguration={{
            shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY!, // TODO: remove from here and put in options
          }}

          options={

            {
              authProviders: [
                FortOAuthProvider.GUEST,
                FortOAuthProvider.EMAIL,
                FortOAuthProvider.GOOGLE,
                FortOAuthProvider.TWITTER,
                FortOAuthProvider.FACEBOOK,
                FortOAuthProvider.WALLET,
              ],
              initialChainId: polygonAmoy.id,
              enforceSupportedChains: true,

              wallet: {
                createEmbeddedSigner: true,
                recoveryMethod: RecoveryMethod.PASSWORD,
              },
              hideBalance: true,
              skipEmailVerification: true,
              walletConnectCTA: 'both',
              // wallet: {
              //   linkWalletOnSignUp: true,
              // }
            }
          }
          debugMode
          // theme='rounded'
          // mode='dark'
          theme='retro'
        // theme='web95'

        >
          {children}
        </FortKitProvider>
      </QueryClientProvider>
    </WagmiProvider >
  );
};
